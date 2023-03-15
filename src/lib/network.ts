import { ethers } from 'ethers'
import { get as getStore } from 'svelte/store'
import { goto } from '$app/navigation'

// import { abi } from '$contracts/BlockPaperScissors.sol/BlockPaperScissors.json'
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

// const RPC_URL = 'https://api.hyperspace.node.glif.io/rpc/v1'
const WS_PROVIDER = 'wss://wss.hyperspace.node.glif.io/apigw/lotus/rpc/v1'
// const WS_PROVIDER = 'wss://wss.hyperspace.node.glif.io/apigw/lotus/rpc/v0'
// const WS_PROVIDER = 'wss://wss.hyperspace.node.glif.io/apigw/lotus/'
export const wsProvider = new ethers.WebSocketProvider(WS_PROVIDER)
// const providerRPC = {
//   // TODO: uncomment this once we have a mainnet RPC URL
//   // mainnet: {
//   //   name: 'mainnet',
//   //   rpc: RPC_URL,
//   //   chainId: 314
//   // },
//   hyperspace: {
//     name: 'hyperspace',
//     rpc: RPC_URL,
//     chainId: 3141,
//   }
// }
// const provider = new ethers.JsonRpcProvider(providerRPC.hyperspace.rpc, {
//   chainId: providerRPC.hyperspace.chainId,
//   name: providerRPC.hyperspace.name
// })

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
