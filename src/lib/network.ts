import { ethers } from 'ethers'
import { get as getStore } from 'svelte/store'
import { goto } from '$app/navigation'

import { networkStore } from '$src/stores'
import { addNotification } from '$lib/notifications'

export type Network = {
  blockHeight: number
  activeChainId: string
}

export const APPROVED_NETWORKS = [
  '314',  // FIL mainnet
  '3141', // Hyperspace testnet
]

export const APPROVED_CHAIN_IDS = {
  hyperspace: '0xc45',
}

const WS_PROVIDER = 'wss://wss.hyperspace.node.glif.io/apigw/lotus/rpc/v1'
export const wsProvider = new ethers.WebSocketProvider(WS_PROVIDER)

export const APPROVED_CHAINS = [
  // {
  //   id: 314,
  //   token: 'FIL',
  //   label: 'Filecoin Mainnet',
  //   rpcUrl: 'https://api.node.glif.io/rpc/v1'
  // },
  {
    id: 3141,
    token: 'tFIL',
    label: 'Filecoin Hyperspace Testnet',
    rpcUrl: 'https://api.hyperspace.node.glif.io/rpc/v1'
  }
]

/**
 * Initialise the networkStore and have it listen for blockHeight change
 */
export const initialise = async (): Promise<void> => {
  const network = getStore(networkStore)

  if (!network.blockHeight) {
    // `block` events take a little while to start coming through, so we'll fetch the startingBlock first
    const startingBlock = await wsProvider.getBlockNumber()
    networkStore.update(state => ({
      ...state,
      blockHeight: startingBlock,
    }))

    wsProvider.on('block', blockHeight => {
      networkStore.update(state => {
        return {
          ...state,
          ...(state?.blockHeight !== blockHeight ? { blockHeight } : {}),
        }
      })
    })
  }
}

/**
 * Check if MetaMask is connected
 *
 * @returns boolean
 */
export const isConnected = async (): Promise<boolean> => {
  const accounts = await window?.ethereum?.request({ method: 'eth_accounts' })
  return !!(accounts as string[])?.length
}

/**
 * Prompt the user to switch to hyperspace
 */
export const switchChain = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: APPROVED_CHAIN_IDS.hyperspace }]
    })
  } catch (error) {
    goto('/')
    addNotification('Please switch to the Hyperspace testnet', 'error')
  }
}
