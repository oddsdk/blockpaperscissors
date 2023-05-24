// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.13;

contract BlockPaperScissors {
  struct Votes {
    uint256 votes;
    address[] voters;
  }

  struct VotesInBlock {
    Votes blockVotes;
    Votes paperVotes;
    Votes scissorsVotes;
  }

  struct VotesWithResultsInBlock {
    string result;
    uint256 blockHeight;
    Votes blockVotes;
    Votes paperVotes;
    Votes scissorsVotes;
  }

  struct AccountState {
    bool accountExists;
    address accountAddress;
    uint256 blockHeightOfLastMove;
    string lastMove;
    uint256 movesMade;
  }

  struct BlockState {
    bool blockExists;
  }

  enum VoteOptions {
    Block,
    Paper,
    Scissors
  }

  struct Vote {
    address voter;
    VoteOptions option;
  }

  struct BlockVote {
    uint256 votes;
    Vote[] voters;
  }

  struct BlockResult {
    string result;
  }

  mapping(VoteOptions => BlockVote) public votes;

  event LogAccount(address voter, string choice, bool accountExists);

  // variables
  uint256 latestBlock;
  mapping(uint256 => mapping(string => Votes)) public votesPerBlock;
  mapping(address => AccountState) public accountStates;
  address[] allAddresses;
  mapping(uint256 => BlockState) public blockStates;
  uint256[] activeBlocks;
  string[3] public choiceList = ['block', 'paper', 'scissors'];

  // Increment the `votes` count for the specific `choice` and record the `msg.sender` as having voted
  // also, update the AccountState of the `msg.sender`
  function castVote(
    string calldata choice,
    uint256 blockHeight
  ) public payable {
    if (latestBlock != block.number) {
      latestBlock = block.number;
    }

    require(validChoice(choice));
    require(validVoter(choice, blockHeight));

    // Record vote in votesPerBlock
    votesPerBlock[blockHeight][choice].votes += 1;
    votesPerBlock[blockHeight][choice].voters.push(msg.sender);

    // // Push blockHeight to `activeBlocks` so we can more easily query only for blocks that were voted in
    // if (!blockStates[blockHeight].blockExists) {
    //   activeBlocks.push(blockHeight);
    // }

    // BlockState memory blockInstance = blockStates[blockHeight];
    // blockInstance.blockExists = true;
    // blockStates[blockHeight] = blockInstance;

    // Push `msg.sender` to `allAddresses` if they haven't voted before
    if (!accountStates[msg.sender].accountExists) {
      allAddresses.push(msg.sender);
    }

    AccountState memory accountInstance = accountStates[msg.sender];

    // Update AccountState
    accountInstance.accountAddress = msg.sender;
    accountInstance.accountExists = true;
    accountInstance.blockHeightOfLastMove = blockHeight;
    accountInstance.lastMove = choice;
    accountInstance.movesMade += 1;
    accountStates[msg.sender] = accountInstance;
  }

  // Return the total votes a choice has received so far
  function totalVotesForChoice(
    string calldata choice,
    uint256 blockHeight
  ) external view returns (Votes memory) {
    require(validChoice(choice));

    return votesPerBlock[blockHeight][choice];
  }

  // Return the total votes a choice has received so far
  function totalVotesForBlock(
    uint256 blockHeight
  ) public view returns (VotesInBlock memory) {
    VotesInBlock memory votes;

    votes.blockVotes = votesPerBlock[blockHeight][choiceList[0]];
    votes.paperVotes = votesPerBlock[blockHeight][choiceList[1]];
    votes.scissorsVotes = votesPerBlock[blockHeight][choiceList[2]];

    return votes;
  }

  // Return all the voting data and results for the last 256 blocks
  function historyForRange(
    uint256 range,
    uint256 blockHeight
  ) external view returns (VotesWithResultsInBlock[] memory) {
    VotesWithResultsInBlock[] memory allVotes = new VotesWithResultsInBlock[](
      range + 1
    );

    for (uint256 i = 0; i <= range; i++) {
      VotesInBlock memory votesForBlock = totalVotesForBlock(blockHeight - i);
      VotesWithResultsInBlock memory votesForBlockWithResults;

      votesForBlockWithResults.blockVotes = votesForBlock.blockVotes;
      votesForBlockWithResults.paperVotes = votesForBlock.paperVotes;
      votesForBlockWithResults.scissorsVotes = votesForBlock.scissorsVotes;

      string memory result = calculateBlockResults(blockHeight - i);
      string memory previousResult = calculateBlockResults(blockHeight - i - 1);

      // Check for a draw(same result as previousResult if not stalemate)
      if (
        compareStringsbyBytes(result, previousResult) &&
        !compareStringsbyBytes(result, 'stalemate') &&
        !compareStringsbyBytes(previousResult, 'stalemate')
      ) {
        votesForBlockWithResults.result = 'draw';
      } else {
        votesForBlockWithResults.result = result;
      }

      votesForBlockWithResults.blockHeight = blockHeight - i;

      allVotes[i] = votesForBlockWithResults;
    }

    return allVotes;
  }

  // // Return all the voting data and results for blocks where votes have been made
  // function historyForActiveBlocks()
  //   external
  //   view
  //   returns (VotesWithResultsInBlock[] memory)
  // {
  //   VotesWithResultsInBlock[] memory allVotes = new VotesWithResultsInBlock[](
  //     activeBlocks.length + 1
  //   );

  //   for (uint256 i = 0; i < activeBlocks.length; i++) {
  //     VotesInBlock memory votesForBlock = totalVotesForBlock(activeBlocks[i]);
  //     VotesWithResultsInBlock memory votesForBlockWithResults;

  //     votesForBlockWithResults.blockVotes = votesForBlock.blockVotes;
  //     votesForBlockWithResults.paperVotes = votesForBlock.paperVotes;
  //     votesForBlockWithResults.scissorsVotes = votesForBlock.scissorsVotes;

  //     string memory result = calculateBlockResults(activeBlocks[i]);
  //     string memory previousResult = calculateBlockResults(activeBlocks[i] - 1);

  //     // Check for a draw(same result as previousResult if not stalemate)
  //     if (
  //       compareStringsbyBytes(result, previousResult) &&
  //       !compareStringsbyBytes(result, 'stalemate') &&
  //       !compareStringsbyBytes(previousResult, 'stalemate')
  //     ) {
  //       votesForBlockWithResults.result = 'draw';
  //     } else {
  //       votesForBlockWithResults.result = result;
  //     }

  //     votesForBlockWithResults.blockHeight = activeBlocks[i];

  //     allVotes[i] = votesForBlockWithResults;
  //   }

  //   return allVotes;
  // }

  // Calculate the result for given block. Results are block, paper, scissors, draw, stalemate
  function calculateBlockResults(
    uint256 blockHeight
  ) public view returns (string memory) {
    string memory result;
    // string memory previousResult = calculateBlockResults(blockHeight - 1);
    uint256 blockVotes = votesPerBlock[blockHeight][choiceList[0]].votes;
    uint256 paperVotes = votesPerBlock[blockHeight][choiceList[1]].votes;
    uint256 scissorsVotes = votesPerBlock[blockHeight][choiceList[2]].votes;

    // Check for a winner or a stalemate(no clear majority)
    if (blockVotes > paperVotes && blockVotes > scissorsVotes) {
      result = choiceList[0]; // block
    } else if (paperVotes > blockVotes && paperVotes > scissorsVotes) {
      result = choiceList[1]; // paper
    } else if (scissorsVotes > blockVotes && scissorsVotes > paperVotes) {
      result = choiceList[2]; // scissors
    } else if (scissorsVotes == blockVotes && scissorsVotes == paperVotes) {
      result = 'stalemate';
    } else if (
      blockVotes == paperVotes ||
      blockVotes == scissorsVotes ||
      paperVotes == scissorsVotes
    ) {
      result = 'stalemate';
    } else {
      result = '';
    }

    return result;
  }

  function parseTotalVotesForBlock(
    uint256[3] memory res
  ) internal pure returns (BlockVote[3] memory) {
    BlockVote[3] memory parsed;

    for (uint256 i = 0; i < res.length; i++) {
      Vote[] memory voters = new Vote[](res[i]);
      parsed[i].votes = res[i];
      parsed[i].voters = voters;
    }

    return parsed;
  }

  function parseHistoryForRange(
    uint256[][] memory res
  ) internal pure returns (BlockVote[3][] memory) {
    BlockVote[3][] memory parsed = new BlockVote[3][](res.length);

    for (uint256 i = 0; i < res.length; i++) {
      uint256[5] memory val = res[i];
      parsed[i] = parseTotalVotesForBlock([val[2], val[3], val[4]]);
      VoteOptions result = VoteOptions(val[0]);
      uint256 blockHeight = val[1];
    }

    return parsed;
  }

  function getPreviousWinner(
    BlockResult[] memory results
  ) internal pure returns (BlockResult memory) {
    for (uint256 i = 0; i < results.length; i++) {
      if (
        keccak256(bytes(results[i].result)) != keccak256(bytes('draw')) &&
        keccak256(bytes(results[i].result)) != keccak256(bytes('stalemate'))
      ) {
        return results[i];
      }
    }
  }

  // Return the state of all voters' accounts
  function allAccountStates() public view returns (AccountState[] memory) {
    AccountState[] memory allAccounts = new AccountState[](allAddresses.length);

    for (uint i; i < allAddresses.length; i++) {
      AccountState memory accountInstance = accountStates[allAddresses[i]];

      accountInstance.accountAddress = accountStates[allAddresses[i]]
        .accountAddress;
      accountInstance.accountExists = accountStates[allAddresses[i]]
        .accountExists;
      accountInstance.blockHeightOfLastMove = accountStates[allAddresses[i]]
        .blockHeightOfLastMove;
      accountInstance.lastMove = accountStates[allAddresses[i]].lastMove;
      accountInstance.movesMade = accountStates[allAddresses[i]].movesMade;

      allAccounts[i] = accountInstance;
    }

    return allAccounts;
  }

  // Return the state of a voter's account
  function singleAccountState(
    address account
  ) public view returns (AccountState memory) {
    // AccountState memory account;
    AccountState memory accountInstance = accountStates[account];

    accountInstance.accountAddress = accountStates[account].accountAddress;
    accountInstance.accountExists = accountStates[account].accountExists;
    accountInstance.blockHeightOfLastMove = accountStates[account]
      .blockHeightOfLastMove;
    accountInstance.lastMove = accountStates[account].lastMove;
    accountInstance.movesMade = accountStates[account].movesMade;

    return accountInstance;
  }

  // Return the state of the `msg.sender`'s account
  function myAccountState() public view returns (AccountState memory) {
    // AccountState memory account;
    AccountState memory accountInstance = accountStates[msg.sender];

    accountInstance.accountAddress = accountStates[msg.sender].accountAddress;
    accountInstance.accountExists = accountStates[msg.sender].accountExists;
    accountInstance.blockHeightOfLastMove = accountStates[msg.sender]
      .blockHeightOfLastMove;
    accountInstance.lastMove = accountStates[msg.sender].lastMove;
    accountInstance.movesMade = accountStates[msg.sender].movesMade;

    return accountInstance;
  }

  // Return a list of all addresses that have voted
  function getAllAddresses() public view returns (address[] memory) {
    return allAddresses;
  }

  // Return a list of blockHeights that had activity in them
  function getAllActiveBlockHeights() public view returns (address[] memory) {
    return activeBlocks;
  }

  // Ensure voter has not already voted for this block
  function validVoter(
    string calldata choice,
    uint256 blockHeight
  ) public view returns (bool) {
    for (
      uint256 i = 0;
      i < votesPerBlock[blockHeight][choice].voters.length;
      i++
    ) {
      if (votesPerBlock[blockHeight][choice].voters[i] == msg.sender) {
        return false;
      }
    }

    return true;
  }

  // Ensure the choice passed in exists in the choiceList
  function validChoice(string calldata choice) public view returns (bool) {
    for (uint256 i = 0; i < choiceList.length; i++) {
      if (compareStringsbyBytes(choiceList[i], choice)) {
        return true;
      }
    }

    return false;
  }

  // Compare string equality
  function compareStringsbyBytes(
    string memory s1,
    string memory s2
  ) public pure returns (bool) {
    return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
  }
}
