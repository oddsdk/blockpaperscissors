import { switchNetwork } from '@wagmi/core'
import { ethers } from 'ethers'
import { dev } from '$app/environment'
// import { goto } from '$app/navigation'
import { get as getStore } from 'svelte/store'

import { abi } from '$contracts/BlockPaperScissors.sol/BlockPaperScissors.json'
import { contractStore, networkStore, sessionStore } from '$src/stores'
import { CONTRACT_ADDRESS, fetchGameState } from '$lib/contract'
// import { addNotification } from '$lib/notifications'

type PendingTX = {
  blockHeight: number
  choice: string
  // previousResult: string
  txHash: string
}

export type Network = {
  blockHeight: number
  activeChainId: string
  pendingTransaction: PendingTX
  pendingTransactions: PendingTX[]
}

export const APPROVED_NETWORKS = [
  '314', // FIL mainnet
  '3141' // Hyperspace testnet
]

export const APPROVED_CHAIN_IDS = {
  hyperspace: '0xc45'
}

const WS_PROVIDER_URL = 'wss://wss.hyperspace.node.glif.io/apigw/lotus/rpc/v1'
export const wsProvider = new ethers.providers.WebSocketProvider(
  WS_PROVIDER_URL
)

/**
 * Initialise the networkStore and have it listen for blockHeight change
 */
export const initialise = async (): Promise<void> => {
  const contract = getStore(contractStore)
  const paramInterface = new ethers.utils.Interface(abi)

  // Attach the paramIntface to the contractStore if it doesn't exist yet
  if (!contract.paramInterface) {
    contractStore.update(state => ({
      ...state,
      paramInterface
    }))
  }

  // `block` events take a little while to start coming through, so we'll fetch the startingBlock first
  const startingBlock = await wsProvider.getBlockNumber()
  networkStore.update(state => ({
    ...state,
    blockHeight: startingBlock
  }))

  wsProvider.on('block', blockHeight => {
    networkStore.update(state => {
      return {
        ...state,
        ...(state?.blockHeight !== blockHeight ? { blockHeight } : {})
      }
    })
  })

  wsProvider.on('pending', async txHash => {
    const transaction = await wsProvider.getTransaction(txHash)

    // console.log('txHash', txHash)
    // console.log('transaction', transaction)

    if (
      !!transaction?.to &&
      transaction.to.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
    ) {
      // console.log('MATCH')
      const decodedData = paramInterface.parseTransaction({
        data: transaction.data,
        value: transaction.value
      })
      const blockHeight = decodedData.args[1].toNumber()
      const choice = decodedData.args[0]

      // console.log('decodedData', decodedData)
      // console.log('choice', choice)
      // console.log('blockHeight', blockHeight)

      networkStore.update(state => ({
        ...state,
        pendingTransactions: [
          ...state.pendingTransactions,
          {
            blockHeight: Number(blockHeight),
            choice,
            txHash
          }
        ]
      }))

      await checkStatusOfPendingTX(txHash)
    }
  })

  // wsProvider.on('error', async () => {
  //   console.log(`Unable to connect to ${WS_PROVIDER_URL} retrying in 3s...`)
  //   setTimeout(initialise, 3000)
  // })
  // wsProvider.on('close', async code => {
  //   console.log(
  //     `Connection lost with code ${code}! Attempting reconnect in 3s...`
  //   )
  //   wsProvider.websocket.close()
  //   setTimeout(initialise, 3000)
  // })
}

/**
 * Prompt the user to switch to hyperspace
 */
export const switchChain = async () => {
  try {
    const session = getStore(sessionStore)
    // const contract = getStore(contractStore)
    await switchNetwork({ chainId: session.ethereumClient.chains[1].id })
    // await contract.provider?.request({
    //   method: 'wallet_switchEthereumChain',
    //   params: [{ chainId: APPROVED_CHAIN_IDS.hyperspace }]
    // })
  } catch (error) {
    console.error(error)
    // goto('/')
    // addNotification('Please switch to the Hyperspace testnet', 'error')
  }
}


/**
 * Poll for the tx receipt to show or hide the user's pending vote
 */
export const checkStatusOfPendingTX = async (txHash: string, isUsersTx: boolean = false): Promise<void> => {
  let receipt = null
  while (receipt === null) {
    try {
      const contract = getStore(contractStore)
      receipt = await contract.provider.getTransactionReceipt(txHash)

      if (receipt === null) {
        if (dev) {
          console.log('Checking for tx receipt...')
        }
        continue
      }

      await fetchGameState()

      if (isUsersTx) {
        networkStore.update((state) => ({
          ...state,
          pendingTransaction: null
        }))
      } else {
        networkStore.update(state => ({
          ...state,
          pendingTransactions: state.pendingTransactions.filter((tx) => String(tx.txHash) !== String(txHash)),
        }))
      }

      if (dev) {
        console.log('Receipt fetched:', receipt)
      }
    } catch (e) {
      console.error(e)
      break
    }
  }
}
