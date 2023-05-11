import {
  Contract as ContractType,
  ethers,
  type Provider,
  type Interface
} from 'ethers'
import { get as getStore } from 'svelte/store'

import { abi } from '$contracts/BlockPaperScissors.sol/BlockPaperScissors.json'
import { contractStore, networkStore, sessionStore } from '$src/stores'
import {
  APPROVED_CHAIN_IDS,
  APPROVED_NETWORKS,
  switchChain,
  wsProvider
} from '$lib/network'

export type Contract = {
  bps: ContractType
  bpsReader: ContractType
  networkStreak: string
  paramInterface: Interface
  previousWinner: BlockResult
  provider: Provider
  results: BlockResult[]
  uniqueVoters: number
  userCombo: string
}

type Voter = {
  address: string;
}

type Vote = {
  votes: number
  voters: Voter[]
}

export type BlockResult = {
  result: string
  blockHeight: number
  block: Vote
  paper: Vote
  scissors: Vote
}

// export const CONTRACT_ADDRESS = '0x76a62787d3ba8A1bb132FAC2905e8E8f9cF912c5'
export const CONTRACT_ADDRESS = '0x7333FCa97768AA4EfF3047c81d91e2fFb9A465e8'

export const COLOR_MAP = {
  block: {
    bg: 'bg-red-500',
    text: 'text-red-500'
  },
  draw: {
    bg: 'bg-base-100',
    text: 'text-base-100'
  },
  paper: {
    bg: 'bg-green-500',
    text: 'text-green-500'
  },
  scissors: {
    bg: 'bg-blue-500',
    text: 'text-blue-500'
  },
  stalemate: {
    bg: 'bg-base-100',
    text: 'text-base-100'
  }
}

const LOSING_MOVES_MAP = {
  block: 'scissors',
  paper: 'block',
  scissors: 'paper'
}

export const WINNING_MOVES_MAP = {
  block: 'paper',
  paper: 'scissors',
  scissors: 'block'
}

export const votingInstructionsMap = (previousWinner) => ({
  block: previousWinner === 'block' ? 'For a draw' : previousWinner === 'scissors' ? 'For a win' : 'For a loss',
  paper: previousWinner === 'paper' ? 'For a draw' : previousWinner === 'scissors' ? 'For a loss' : 'For a win',
  scissors: previousWinner === 'scissors' ? 'For a draw' : previousWinner === 'paper' ? 'For a win' : 'For a loss',
})

export const moveHistoryMap = (currentMove, previousMoves) => {
  const previousMove = previousMoves.find(
    move => move.result !== 'draw' && move.result !== 'stalemate'
  )

  let result
  if (WINNING_MOVES_MAP[previousMove?.result] === currentMove) {
    result = 'win'
  } else if (LOSING_MOVES_MAP[previousMove?.result] === currentMove) {
    result = 'loss'
  } else if (previousMove?.result === currentMove) {
    result = 'draw'
  }

  return {
    result,
    move: previousMove?.result
  }
}

export const VOTES_KEY_MAP = {
  0: 'block',
  1: 'paper',
  2: 'scissors'
}

const VOTE_OPTIONS = ['block', 'paper', 'scissors']

/**
 * Attach the BPS contract instance to the contractStore
 */
export const attachContractToStore = async provider => {
  const signer = await provider.getSigner()
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    JSON.stringify(abi),
    signer
  )

  const contractReader = new ethers.Contract(
    CONTRACT_ADDRESS,
    JSON.stringify(abi),
    wsProvider
  )

  contractStore.update(state => ({
    ...state,
    bps: contract,
    bpsReader: contractReader,
    provider
  }))

  // Switch to hyperspace if the user isn't already on it
  const chainId = provider?.provider?.walletProvider?.walletProvider?.chainId
  if (!!chainId && chainId !== APPROVED_NETWORKS[1]) {
    await switchChain()
  }
}

/**
 * Parse the response from totalVotesPerBlock
 *
 * @param res
 * @returns object with no proxies
 */
export const parseTotalVotesForBlock = res => {
  const resObj = Object.assign({}, res)
  const parsed = Object.keys(resObj).reduce((acc, key) => {
    const votersObj = Object.assign({}, resObj[key][1])
    const voters = Object.keys(votersObj).reduce(
      (a, k) => [
        ...a,
        {
          address: votersObj[k],
        }
      ],
      []
    )

    return {
      ...acc,
      [VOTES_KEY_MAP[key]]: {
        votes: Number(resObj[key][0]),
        voters
      }
    }
  }, {})

  return parsed
}

/**
 * Parse the response from a historyForRange call
 *
 * @param res
 */
export const parseHistoryForRange = res => {
  const resObj = Object.assign({}, res)
  const resArr = Object.values(resObj)

  const parsed = resArr.map(val => {
    const valObj = Object.assign({}, val)
    const result = valObj[0]
    const blockHeight = Number(valObj[1])

    return {
      result,
      blockHeight,
      ...parseTotalVotesForBlock({ 0: valObj[2], 1: valObj[3], 2: valObj[4] })
    }
  })

  return parsed
}

/**
 * Count number of unique voters in a given set of results
 *
 * @param results
 */
export const tallyVoters = (results: BlockResult[]): number => {
  let voters = []

  results.forEach(result => {
    result.block.voters.forEach(voter => {
      if (voter?.address) {
        voters = [...voters, voter.address]
      }
    })

    result.paper.voters.forEach(voter => {
      if (voter?.address) {
        voters = [...voters, voter.address]
      }
    })

    result.scissors.voters.forEach(voter => {
      if (voter?.address) {
        voters = [...voters, voter.address]
      }
    })
  })

  return new Set(voters).size
}

/**
 * Find the last winner(non-draw and non-stalemate)
 *
 * @param results
 */
const getPreviousWinner = (results): BlockResult => {
  const previousWinner = results.find(
    result => result.result !== 'draw' && result.result !== 'stalemate'
  )

  return previousWinner
}

/**
 * Determine the networks's streak based on the last 256 plays given these parameters:
 * - If the previous winning move wins: increment the streak.
 * - If draw or stalemate: hold the streak
 * - If the previous winning move loses: streak resets to 0.
 */
export const getNetworkStreak = (previousWinner, results): string => {
  if (!previousWinner) {
    return String(0)
  }

  const previousWinnerIndex = results.findIndex(
    ({ blockHeight }) => blockHeight === previousWinner.blockHeight
  )
  let streak = 1
  let updatedPreviousMove = previousWinner

  // We know the previous winner's index, so we can count back from there
  for (let i = previousWinnerIndex + 1; i < results.length; i++) {
    if (LOSING_MOVES_MAP[updatedPreviousMove.result] === results[i].result) {
      streak += 1
      updatedPreviousMove = results[i]
    } else if (WINNING_MOVES_MAP[previousWinner.result] === results[i].result) {
      break
    }
  }

  return streak >= 256 ? '256+' : String(streak)
}

/**
 * Determine the user's combo based on the last 256 plays given these parameters:
 * - If you voted with the clear majority, your combo is incremented.
 * - If your vote participated in a draw or stalemate: your combo is held.
 * - If you voted with the clear minority: your combo resets to zero. (Note: this will
 *   also be the case if there was a draw, but you voted for the 3rd option that didn't
 *   participate in the draw eg. Block & Paper drew, but you voted for Scissors).
 */
export const getUserCombo = (results): string => {
  const session = getStore(sessionStore)
  const userAddress = session?.address?.toLowerCase()
  let combo = 0

  outerloop: for (let i = 0; i < results.length; i++) {
    const votes = {
      block: results[i].block.voters,
      paper: results[i].paper.voters,
      scissors: results[i].scissors.voters
    }
    const userChoices = {
      block: votes.block.find(
        voter => voter?.address?.toLowerCase() === userAddress
      ),
      paper: votes.paper.find(
        voter => voter?.address?.toLowerCase() === userAddress
      ),
      scissors: votes.scissors.find(
        voter => voter?.address?.toLowerCase() === userAddress
      )
    }

    // Only votes the user participated in will affect their combo
    if (userChoices.block || userChoices.paper || userChoices.scissors) {
      if (results[i].result === 'draw') {
        // If the user was in the minorty of a draw, it breaks the combo
        if (
          (votes.block === votes.paper && userChoices.scissors) ||
          (votes.block === votes.scissors && userChoices.paper) ||
          (votes.scissors === votes.paper && userChoices.scissors)
        ) {
          break
        }

        // If the user wasn't in the minority, continue
        continue
      } else if (VOTE_OPTIONS.includes(results[i].result)) {
        for (let j = 0; j < VOTE_OPTIONS.length; j++) {
          if (
            results[i].result === VOTE_OPTIONS[j] &&
            userChoices[VOTE_OPTIONS[j]]
          ) {
            combo += 1
          } else if (
            results[i].result === VOTE_OPTIONS[j] &&
            !userChoices[VOTE_OPTIONS[j]]
          ) {
            break outerloop
          }
        }
      }
    }
  }

  return combo >= 256 ? '256+' : String(combo)
}

/**
 * Fetch the game state and update the contractStore
 */
export const fetchGameState = async () => {
  try {
    // await switchChain()
    const contracts = getStore(contractStore)
    const network = getStore(networkStore)

    const res = await contracts?.bpsReader?.historyForRange(
      400,
      network?.blockHeight
    )
    const parsed = parseHistoryForRange(res)

    const results = parsed.slice(0, -1)
    const uniqueVoters = tallyVoters(results as BlockResult[])

    const previousWinner = getPreviousWinner(results)

    const networkStreak = getNetworkStreak(previousWinner, results)
    const userCombo = getUserCombo(results)

    contractStore.update(state => ({
      ...state,
      networkStreak,
      previousWinner,
      results: results as BlockResult[],
      uniqueVoters,
      userCombo
    }))
  } catch (error) {
    console.error(error)
  }
}
