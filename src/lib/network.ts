import { ethers } from 'ethers'
import { get as getStore } from 'svelte/store'

import { networkStore } from '$src/stores'

export type Network = {
  blockNumber: number
}

export const CONTRACT_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138'
const WS_PROVIDER = 'wss://wss.hyperspace.node.glif.io/apigw/lotus/rpc/v0'
const wsProvider = new ethers.WebSocketProvider(WS_PROVIDER)

/**
 * Initialise the networkStore and have it listen for blockNumber change
 */
export const initialise = async (): Promise<void> => {
  const network = getStore(networkStore)

  if (!network.blockNumber) {
    wsProvider.on('block', blockNumber => {
      networkStore.update(state => ({
        ...state,
        ...(state?.blockNumber !== blockNumber ? { blockNumber } : {}),
      }))
    })
  }
}

/**
 * Check if MetaMask is connected
 *
 * @returns boolean
 */
export const isConnected = async (): Promise<boolean> => {
  const accounts = await window.ethereum.request({ method: 'eth_accounts' })
  return !!(accounts as string[])?.length
}
