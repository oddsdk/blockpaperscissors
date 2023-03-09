// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.13;

contract BlockPaperScissors {
  struct VotesInBlock {
    address recipient;
    uint num_contributions;
    mapping(uint => Vote) voters;
  }

  struct Vote {
    address voter;
    string choice;
  }

  mapping(string => VotesInBlock) public votesReceived;

  string[3] public choiceList = ['block', 'paper', 'scissors'];

  // Return the total votes a choice has received so far
  function totalVotesFor(string calldata choice) public view returns (uint256) {
    require(validChoice(choice));
    return votesReceived[choice].num_contributions;
  }

  // Increment the vote count for the specified choice
  function voteForChoice(string calldata choice) public {
    require(validChoice(choice));
    votesReceived[choice].num_contributions += 1;
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
