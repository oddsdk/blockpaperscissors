// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import '../lib/forge-std/src/Test.sol';
import '../contracts/BlockPaperScissors.sol';

contract TestBlockPaperScissors is Test {
  address public owner;
  address bob = address(0x12345);

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
    uint256 blockHeightOfLastMove;
    string lastMove;
    uint256 movesMade;
  }

  // // variables
  // uint256 latestBlock;
  // mapping(uint256 => mapping(string => Votes)) public votesPerBlock;
  // address[] allAddresses;
  // mapping(address => AccountState) public accountStates;
  // string[3] public choiceList = ['block', 'paper', 'scissors'];

  BlockPaperScissors public BPS;

  function setUp() public {
    owner = msg.sender;
    vm.label(address(this), 'BlockPaperScissors test contract');
    BPS = new BlockPaperScissors();
    vm.deal(address(bob), 5000 ether);
  }

  function testCastVoteAndGetters() public {
    vm.prank(address(bob));
    BPS.castVote{value: 60000000 gwei}('block', 258);

    assertEq(BPS.totalVotesForBlock(258).blockVotes.voters.length, 1);
    assertEq(BPS.totalVotesForChoice('block', 258).voters.length, 1);
    assertEq(BPS.totalVotesForChoice('block', 258).votes, 1);
    assertEq(BPS.historyForRange(1, 258)[0].blockVotes.votes, 1);
  }
}
