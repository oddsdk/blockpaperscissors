import { Contract as ContractType, ethers, type Provider } from 'ethers'
import { get as getStore } from 'svelte/store'

import { abi } from '$contracts/BlockPaperScissors.sol/BlockPaperScissors.json'
import { contractStore, networkStore, sessionStore } from '$src/stores'

export type Contract = {
  bps: ContractType
  networkStreak: string
  previousWinner: PreviousWinner
  provider: Provider
  results: BlockResult[]
  uniqueVoters: number
  userCombo: string
}

type PersonaResults = {
  [key: string]: {
    block: string
    majorityChoice: string
    paper: string
    percentageForMajority: number
    percentageForWinner: number
    scissors: string
    total: number
  }
}

type PreviousWinner = BlockResult & {
  votesByPersona: PersonaResults
}

type Voter = {
  address: string
  persona: string
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

export const CONTRACT_ADDRESS = '0x6fc2677244c191d32d5b5cb73298edfe54265633'

export const COLOR_MAP = {
  block: {
    bg: 'bg-red-500',
    text: 'text-red-500',
  },
  draw: {
    bg: 'bg-transparent',
    text: 'text-transparent',
  },
  paper: {
    bg: 'bg-green-500',
    text: 'text-green-500',
  },
  scissors: {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
  },
  stalemate: {
    bg: 'bg-transparent',
    text: 'text-transparent',
  },
}

const LOSING_MOVES_MAP = {
  block: 'scissors',
  paper: 'block',
  scissors: 'paper',
}

export const WINNING_MOVES_MAP = {
  block: 'paper',
  paper: 'scissors',
  scissors: 'block',
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
export const attachContractToStore = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum)

  await window.ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xc45' }] // chainId must be in hexadecimal numbers
  })

  const signer = await provider.getSigner()
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    JSON.stringify(abi),
    signer
  )

  contractStore.update(state => ({
    ...state,
    bps: contract,
    provider,
  }))
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
          address: votersObj[k][1],
          persona: votersObj[k][0]
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
 * Tracking persona stats for the previousWinner
 *
 * @param persona
 * @returns
 */
const sortVotesByPersona = (persona: string, previousWinner) => {
  const votesForOptions: { block: number; paper: number; scissors: number } =
    VOTE_OPTIONS.reduce(
      (acc, val) => ({
        ...acc,
        [val]: previousWinner[val]?.voters?.filter(
          voter => voter?.persona === persona
        ).length
      }),
      { block: 0, paper: 0, scissors: 0 }
    )
  const total =
    votesForOptions.block + votesForOptions.paper + votesForOptions.scissors
  const highestVote = Math.max(
    votesForOptions.block,
    votesForOptions.paper,
    votesForOptions.scissors
  )
  const majorityChoice = Object.keys(votesForOptions).find(
    key => votesForOptions[key] === highestVote
  )

  // 0/0 returns NaN, so we'll just set it to 0 if that's the case
  const percentageForWinner =
    votesForOptions[previousWinner?.result] === 0
      ? 0
      : (votesForOptions[previousWinner?.result] / total) * 100
  const percentageForMajority =
    votesForOptions[majorityChoice] === 0
      ? 0
      : (votesForOptions[majorityChoice] / total) * 100

  return {
    ...votesForOptions,
    total,
    percentageForWinner,
    percentageForMajority,
    majorityChoice
  }
}


/**
 * Find the last winner(non-draw and non-stalemate)
 *
 * @param results
 */
const getPreviousWinner = (results): PreviousWinner => {
  const previousWinner = results.find(
    result => result.result !== 'draw' && result.result !== 'stalemate'
  )

  return {
    ...previousWinner,
    votesByPersona: {
      artist: sortVotesByPersona('artist', previousWinner),
      builder: sortVotesByPersona('builder', previousWinner),
      speculator: sortVotesByPersona('speculator', previousWinner)
    }
  }
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

  outerloop:
  for (let i = 0; i < results.length; i++) {
    const votes = {
      block: results[i].block.voters,
      paper: results[i].paper.voters,
      scissors: results[i].scissors.voters,
    }
    const userChoices = {
      block: votes.block.find(voter => voter?.address?.toLowerCase() === userAddress),
      paper: votes.paper.find(voter => voter?.address?.toLowerCase() === userAddress),
      scissors: votes.scissors.find(voter => voter?.address?.toLowerCase() === userAddress),
    }
    // Only votes the user participated in will affect their combo
    if (
      userChoices.block ||
      userChoices.paper ||
      userChoices.scissors
    ) {
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
          if (results[i].result === VOTE_OPTIONS[j] && userChoices[VOTE_OPTIONS[j]]) {
            combo += 1
          } else if (results[i].result === VOTE_OPTIONS[j] && !userChoices[VOTE_OPTIONS[j]]) {
            break outerloop
          }
        }
      }
    } else {
      // console.log('didnt vote')
    }
  }

  return combo >= 256 ? '256+' : String(combo)
}


/**
 * Fetch the game state and update the contractStore
 */
export const fetchGameState = async () => {
  try {
    const contracts = getStore(contractStore)
    const network = getStore(networkStore)

    const res = await contracts?.bps?.historyForRange(256, network?.blockHeight)
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
      userCombo,
    }))
  } catch (error) {
    console.error(error)
  }
}