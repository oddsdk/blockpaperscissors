import { Contract as ContractType, ethers, type Provider } from 'ethers'
import { get as getStore } from 'svelte/store'

import { abi } from '$contracts/BlockPaperScissors.sol/BlockPaperScissors.json'
import { contractStore, networkStore } from '$src/stores'

export type Contract = {
  bps: ContractType
  previousWinner: BlockResult
  provider: Provider
  results: BlockResult[]
  uniqueVoters: number
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

// export const CONTRACT_ADDRESS = '0x8B798DeEb9Fd3d9730AC39d6D01203E6aB8bC61e'
export const CONTRACT_ADDRESS = '0x6fc2677244c191d32d5b5cb73298edfe54265633'

export const VOTES_KEY_MAP = {
  0: 'block',
  1: 'paper',
  2: 'scissors'
}

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

export const WINNING_MOVES_MAP = {
  block: 'paper',
  paper: 'scissors',
  scissors: 'block',
}

/**
 * Attach the BPS contract instance to the contractStore
 */
export const attachContractToStore = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum)
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
 * Find the last winner(non-draw and non-stalemate)
 *
 * @param results
 */
const getPreviousWinner = (results) => results.find(result => result.result !== 'draw' && result.result !== 'stalemate')

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

    contractStore.update(state => ({
      ...state,
      previousWinner: getPreviousWinner(results),
      results: results as BlockResult[],
      uniqueVoters,
    }))
  } catch (error) {
    console.error(error)
  }
}
