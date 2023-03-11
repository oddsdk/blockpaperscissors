import { ethers } from 'ethers'
import { get as getStore } from 'svelte/store'

import { networkStore } from '$src/stores'

export type Network = {
  blockNumber: number
}

export const CONTRACT_ADDRESS = '0xd9145CCE52D386f254917e481eB44e9943F39138'
// const RPC_URL = 'https://api.hyperspace.node.glif.io/rpc/v1'
const WS_PROVIDER = 'wss://wss.hyperspace.node.glif.io/apigw/lotus/rpc/v0'
const wsProvider = new ethers.WebSocketProvider(WS_PROVIDER)
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
 * Initialise the networkStore and have it listen for blockNumber change
 */
export const initialise = async (): Promise<void> => {
  const network = getStore(networkStore)

  if (!network.blockNumber) {
    // `block` events take a little while to start coming through, so we'll fetch the startingBlock first
    const startingBlock = await wsProvider.getBlockNumber()
    networkStore.update(state => ({
      ...state,
      blockNumber: startingBlock,
    }))

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
