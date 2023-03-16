// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.13;

contract BlockPaperScissors {
  struct Vote {
    string persona;
    address sender;
  }

  struct Votes {
    uint256 votes;
    Vote[] voters;
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

  // variables
  uint256 latestBlock;
  mapping(uint256 => mapping(string => Votes)) public votesPerBlock;
  string[3] public choiceList = ['block', 'paper', 'scissors'];
  string[3] public personaList = ['builder', 'speculator', 'artist'];

  // Increment the `votes` count for the specific `choice` and record the `msg.sender` and their `persona` as having voted
  function castVote(
    string calldata choice,
    string calldata persona,
    uint256 blockHeight
  ) public payable {
    if (latestBlock != block.number) {
      latestBlock = block.number;
    }

    require(validChoice(choice));
    require(validPersona(persona));
    require(validVoter(choice, blockHeight));

    votesPerBlock[blockHeight][choice].votes += 1;
    votesPerBlock[blockHeight][choice].voters.push(Vote(persona, msg.sender));
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

      // Check for a draw(same result as previousResult)
      if (compareStringsbyBytes(result, previousResult)) {
        votesForBlockWithResults.result = 'draw';
      } else {
        votesForBlockWithResults.result = result;
      }

      votesForBlockWithResults.blockHeight = blockHeight - i;

      allVotes[i] = votesForBlockWithResults;
    }

    return allVotes;
  }

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
      if (votesPerBlock[blockHeight][choice].voters[i].sender == msg.sender) {
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

  // Ensure the persona passed in exists in the personaList
  function validPersona(string calldata persona) public view returns (bool) {
    for (uint256 i = 0; i < personaList.length; i++) {
      if (compareStringsbyBytes(personaList[i], persona)) {
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
