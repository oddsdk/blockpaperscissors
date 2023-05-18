import { get as getStore } from 'svelte/store'

import type { AccountState } from '$lib/contract'
import { contractStore } from '$src/stores'

/**
 * Check the `movesMade` of `allAccounts` and return the top 10
 *
 * @returns top 10 accounts based on moves made
 */
export const getTop10Streaks = (): AccountState[] => {
  const contracts = getStore(contractStore)
  const allAccounts = contracts.allAccounts

  const values = allAccounts
    .map(account => account?.movesMade)
    .sort((a, b) => b - a)
    .slice(0, 10)

  return allAccounts
    .filter(account => values.includes(account?.movesMade))
    .reverse()
}
/**
 * Check the `power` of `allAccounts` and return the top 10
 *
 * @returns top 10 accounts based on power
 */
export const getTop10Voters = (): AccountState[] => {
  const contracts = getStore(contractStore)
  const allAccounts = contracts.allAccounts

  const values = allAccounts
    .map(account => account?.power)
    .sort((a, b) => b - a)
    .slice(0, 10)

  return allAccounts
    .filter(account => values.includes(account?.power))
    .reverse()
}
