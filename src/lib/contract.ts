import { getContract, readContract } from '@wagmi/core'
import {
  Contract as ContractType,
  ethers
  // type Provider,
  // type Interface
} from 'ethers'
import { get as getStore } from 'svelte/store'

import { abi } from '$contracts/BlockPaperScissors.sol/BlockPaperScissors.json'
import { contractStore, networkStore, sessionStore } from '$src/stores'
import {
  APPROVED_NETWORKS,
  TEAM_NETWORK_MAP,
  switchChain,
} from '$lib/network'

export type Contract = {
  allAccounts: AccountState[]
  bps: ContractType
  bpsReader: ContractType
  myAccount: AccountState
  networkStreak: string
  paramInterface: any
  previousWinner: PreviousWinner
  provider: any
  results: BlockResult[]
  topStreaks: Streak[]
  uniqueVoters: number
  userCombo: string
}

type Streak = {
  endBlockHeight: number
  startBlockHeight: number
  length: number
}

type Voter = {
  address: string
}

type Vote = {
  votes: number
  voters: Voter[]
}

type PreviousWinner = {
  blockHeight: number
  result: string
}

export type BlockResult = {
  result: string
  blockHeight: number
  block: Vote
  paper: Vote
  scissors: Vote
}

type RawAccountState = {
  address: string
  blockHeightOfLastMove: number
  lastMove: string
  movesMade: number
}

export type AccountState = RawAccountState & {
  power: number
}

// export const CONTRACT_ADDRESS = '0x33EdE8BE3d5b86593dbC20aAc158516Eb3ca1CB8'
// export const CONTRACT_ADDRESS = '0x09E859Ee639B2B4A2Ba38F8fDbd17b0B471B0A20'
export const CONTRACT_ADDRESS = '0x46457083d57ac1F1dE4e7B4920f1dC75Dd321124'
// export const CONTRACT_ADDRESS = '0x2367e429AD13fB0EaCE8d74F986296dA1501eaAC'

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

export const votingInstructionsMap = previousWinner => ({
  block:
    previousWinner === 'block'
      ? 'For a draw'
      : previousWinner === 'scissors'
      ? 'For a win'
      : 'For a loss',
  paper:
    previousWinner === 'paper'
      ? 'For a draw'
      : previousWinner === 'scissors'
      ? 'For a loss'
      : 'For a win',
  scissors:
    previousWinner === 'scissors'
      ? 'For a draw'
      : previousWinner === 'paper'
      ? 'For a win'
      : 'For a loss'
})

export const moveHistoryMap = (currentMove) => {
  const previousMove = currentMove.previousResult
  let result

  if (WINNING_MOVES_MAP[previousMove] === currentMove.result) {
    result = 'win'
  } else if (LOSING_MOVES_MAP[previousMove] === currentMove.result) {
    result = 'loss'
  } else if (previousMove === currentMove.result) {
    result = 'draw'
  }

  return {
    result,
    previousMove
  }
}

export const VOTES_KEY_MAP = {
  0: 'null',
  1: 'block',
  2: 'paper',
  3: 'scissors',
  4: 'stalemate',
  5: 'draw',
}

/**
 * Attach the BPS contract instance to the contractStore
 */
export const attachContractToStore = async (provider, team) => {
  const signer = await provider.getSigner()

  const contractAddress = TEAM_NETWORK_MAP[team].testnet.contractAddress

  const contract = getContract({
    address: contractAddress,
    abi
  })

  const contractReader = new ethers.Contract(
    contractAddress,
    JSON.stringify(abi),
    provider
  )

  contractStore.update(state => ({
    ...state,
    bps: contract,
    bpsReader: contractReader,
    provider
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
          address: votersObj[k]
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
    let result = VOTES_KEY_MAP[valObj.winningMove]

    return {
      result: result === 'null' ? 'stalemate' : result,
      previousResult: VOTES_KEY_MAP[valObj.previousWinningMove],
      blockHeight: valObj.blockHeight.toNumber(),
      isDraw: valObj.isDraw,
      isStalemate: valObj.isStalemate,
      block: {
        votes: valObj.blockVotes.toNumber(),
        voters: valObj.blockVoters
      },
      paper: {
        votes: valObj.paperVotes.toNumber(),
        voters: valObj.paperVoters
      },
      scissors: {
        votes: valObj.scissorsVotes.toNumber(),
        voters: valObj.scissorsVoters
      }
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
 * Parse accountState from response data
 */
const parseAccountState = (res): RawAccountState => {
  if (!!res?.accountAddress) {
    return {
      address: String(res.accountAddress),
      blockHeightOfLastMove: res.lastMoveBlockHeight.toNumber(),
      lastMove: VOTES_KEY_MAP[res.lastMove],
      movesMade: res.totalMoves.toNumber()
    }
  }

  return {
    address: null,
    blockHeightOfLastMove: null,
    lastMove: null,
    movesMade: 0
  }
}

/**
 * Fetch the game state and update the contractStore
 */
export const fetchGameState = async () => {
  try {
    const contracts = getStore(contractStore)
    const res = await contracts?.bpsReader?.getResultsOfPreviousBlocks(257)

    const parsed = parseHistoryForRange(res)
    const results = parsed.slice(0, -1)

    const streaksRes = await contracts?.bpsReader?.getAllStreaks()
    const lastWinningMove = await contracts?.bpsReader?.lastWinningMove()
    const lastWinningMoveBlockHeight = (await contracts?.bpsReader?.lastWinningMoveBlockHeight())?.toNumber()
    const networkStreak =
      streaksRes?.length === 1
        ? streaksRes[0]?._length?.toNumber()
        : streaksRes
            .find(
              streak =>
                streak.endBlockHeight.toNumber() === lastWinningMoveBlockHeight
            )
            ?._length?.toNumber()

    const previousWinner = {
      blockHeight: lastWinningMoveBlockHeight,
      result: VOTES_KEY_MAP[lastWinningMove],
    }

    contractStore.update(state => ({
      ...state,
      networkStreak,
      previousWinner,
      results: results as BlockResult[],
    }))
  } catch (error) {
    console.error(error)
  }
}

/**
 * Calculate the `power` rating of each account based on these parameters:
 *
 * MOVES_QUOTIENT = moves made by this account / most moves made by any account
 * FRESHNESS_QUOTIENT = 2.71828^(-.01 x MOVES_QUOTIENT x Blocks since last move)
 * POWER = 10 x MOVES_QUOTIENT x FRESHNESS_QUOTIENT
 * @param allAccounts
 * @returns
 */
const calculatePower = (allAccounts: RawAccountState[]): AccountState[] => {
  const network = getStore(networkStore)

  // Find the most `movesMade` of any account
  let mostMovesMade = allAccounts[0].movesMade
  for (let i = 0; i < allAccounts.length; i++) {
    if (mostMovesMade < allAccounts[i].movesMade) {
      mostMovesMade = allAccounts[i].movesMade
    }
  }

  let allAccountsWithPower = []
  for (let i = 0; i < allAccounts.length; i++) {
    const account = allAccounts[i]
    const movesQuotient = account.movesMade / mostMovesMade
    const freshnessQuotient =
      Math.pow(2.71828,
      (-0.01 *
        movesQuotient *
        (network.blockHeight - account.blockHeightOfLastMove)))

    allAccountsWithPower.push({
      ...account,
      power: 10 * movesQuotient * freshnessQuotient
    })
  }

  return allAccountsWithPower
}

/**
 * Fetch all account states and update the contractStore
 */
export const fetchAllAccounts = async () => {
  try {
    const contracts = getStore(contractStore)
    const res = await contracts?.bpsReader?.getAllUsers()
    const resObj = Object.assign({}, res)
    const resArr = Object.values(resObj)

    const allAccountStates = resArr.map(val => {
      const valObj = Object.assign({}, val)
      return parseAccountState(valObj)
    })

    contractStore.update(state => ({
      ...state,
      allAccounts: calculatePower(allAccountStates)
    }))
  } catch (error) {
    console.error(error)
  }
}

/**
 * Fetch the current user's account state and update the contractStore
 */
export const fetchAccount = async (address: string) => {
  try {
    const contracts = getStore(contractStore)
    const res = await contracts?.bps?.getUserByAddress(address)
    const accountState = parseAccountState(res)

    return accountState
  } catch (error) {
    console.error(error)
  }
}

/**
 * Fetch the current user's account state and update the contractStore
 */
export const fetchMyAccount = async () => {
  try {
    const contracts = getStore(contractStore)
    const session = getStore(sessionStore)

    const res = await contracts?.bpsReader?.getUserByAddress(session.address)
    const accountState = parseAccountState(res)

    contractStore.update(state => ({
      ...state,
      myAccount: accountState
    }))
  } catch (error) {
    console.error(error)
  }
}

/**
 * Fetch the top streaks from the contract
 */
export const fetchTopStreaks = async () => {
  try {
    const contracts = getStore(contractStore)
    const res = await contracts?.bpsReader?.getTopStreaks(10)

    const parsedStreaks = res.map(streak => ({
      endBlockHeight: streak.endBlockHeight.toNumber(),
      startBlockHeight: streak.startBlockHeight.toNumber(),
      length: streak._length.toNumber(),
      lastWinningMove: VOTES_KEY_MAP[streak.lastWinningMove],
    }))

    parsedStreaks.sort((a, b) => b.length - a.length)

    contractStore.update(state => ({
      ...state,
      topStreaks: parsedStreaks,
    }))
  } catch (error) {
    console.error(error)
  }
}
