// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import '../lib/forge-std/src/Test.sol';
import '../contracts/BlockPaperScissors.sol';

contract TestBlockPaperScissors is Test {
  address public owner;
  address bob = address(0x12345);

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

  BlockPaperScissors public BPS;

  function setUp() public {
    owner = msg.sender;
    vm.label(address(this), 'BlockPaperScissors test contract');
    BPS = new BlockPaperScissors();
    vm.deal(address(bob), 1000 ether);
  }

  function testCastVoteAndGetters() public {
    vm.prank(address(bob));
    BPS.castVote{value: 30000000 gwei}('block', 'artist', 258);

    assertEq(BPS.totalVotesForBlock(258).blockVotes.voters.length, 1);
    assertEq(BPS.totalVotesForChoice('block', 258).voters.length, 1);
    assertEq(BPS.totalVotesForChoice('block', 258).votes, 1);
    assertEq(BPS.historyForRange(1, 258)[0].blockVotes.votes, 1);
  }
}
