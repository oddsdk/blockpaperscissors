import { switchNetwork } from '@wagmi/core'
import { ethers } from 'ethers'
import { dev } from '$app/environment'
// import { goto } from '$app/navigation'
import { get as getStore } from 'svelte/store'

import { abi } from '$contracts/BlockPaperScissors.sol/BlockPaperScissors.json'
import { contractStore, networkStore, sessionStore } from '$src/stores'
import { CONTRACT_ADDRESS, VOTES_KEY_MAP, fetchGameState } from '$lib/contract'
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

export const APPROVED_CHAIN_IDS = {
  hyperspace: '0xc45'
}

export const TEAM_NETWORK_MAP = {
  arbitrum: {
    mainnet: {
      chainId: '42161',
      wsProvider:
        'wss://arbitrum-one.blastapi.io/6a15a0f6-08df-4f5a-aecf-32e4531d2104'
    },
    testnet: {
      chainId: '421613',
      contractAddress: '0x8Db9849dBc5ff9da0F56d33836010843e235a092',
      wsProvider:
        'wss://arbitrum-goerli.blastapi.io/6a15a0f6-08df-4f5a-aecf-32e4531d2104'
    }
  },
  ethereum: {
    mainnet: {
      chainId: '1',
      wsProvider:
        'wss://eth.api.onfinality.io/ws?apikey=fcd55fe3-dc50-4294-8e04-9110c91f1484'
      // 'wss://g.w.lavanet.xyz:443/gateway/eth/rpc/654ffff52d55ada78b6e82ffda56ba65'
    },
    testnet: {
      chainId: '5',
      contractAddress: '0x8Db9849dBc5ff9da0F56d33836010843e235a092',
      wsProvider:
        'wss://eth-goerli.api.onfinality.io/ws?apikey=fcd55fe3-dc50-4294-8e04-9110c91f1484'
      // 'wss://g.w.lavanet.xyz:443/gateway/gth1/rpc/654ffff52d55ada78b6e82ffda56ba65'
    }
  },
  filecoin: {
    mainnet: {
      chainId: '314',
      wsProvider: 'wss://wss.node.glif.io/apigw/lotus/rpc/v1'
    },
    testnet: {
      chainId: '3141',
      contractAddress: '0xe124F194ED4D3380d5398ea24fC4466abA010219',
      wsProvider: 'wss://wss.hyperspace.node.glif.io/apigw/lotus/rpc/v1'
    }
  },
  optimism: {
    mainnet: {
      chainId: '10',
      wsProvider:
        'wss://optimism-mainnet.blastapi.io/6a15a0f6-08df-4f5a-aecf-32e4531d2104'
    },
    testnet: {
      chainId: '420',
      wsProvider:
        'wss://optimism-goerli.blastapi.io/6a15a0f6-08df-4f5a-aecf-32e4531d2104'
    }
  },
  polygon: {
    mainnet: {
      chainId: '137',
      wsProvider:
        'wss://polygon-mainnet.g.alchemy.com/v2/VLZTS2lKe63EInDVJNGNIsdXymX1WD2Y'
      // 'wss://rpc-mainnet.maticvigil.com/ws/v1/9b2edaa23e72253f89c1e02e54cc95f6c102bc42'
    },
    testnet: {
      chainId: '80001',
      contractAddress: '0xE39e7F936A751fA236761CE8d2993fCb9A1364c6',
      wsProvider:
        'wss://polygon-mumbai.g.alchemy.com/v2/nEHUKWaxj3R606D7A-M2XKDWzpiLlGB-'
      // 'wss://matic.getblock.io/62041869-664d-428b-8ba5-5ad871dfe5d4/testnet/'
      // 'wss://rpc-mumbai.maticvigil.com/ws/v1/9b2edaa23e72253f89c1e02e54cc95f6c102bc42'
    }
  }
}

export const APPROVED_NETWORKS = [
  TEAM_NETWORK_MAP.filecoin.mainnet.chainId,
  TEAM_NETWORK_MAP.filecoin.testnet.chainId,
  TEAM_NETWORK_MAP.ethereum.mainnet.chainId,
  TEAM_NETWORK_MAP.ethereum.testnet.chainId,
  TEAM_NETWORK_MAP.polygon.mainnet.chainId,
  TEAM_NETWORK_MAP.polygon.testnet.chainId,
]

/**
 * Initialise the networkStore and have it listen for blockHeight change
 */
export const initialise = async (team: string): Promise<void> => {
  const wsProvider = new ethers.providers.WebSocketProvider(TEAM_NETWORK_MAP[team].testnet.wsProvider)
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

  // document.addEventListener('visibilitychange', () => {
  //   if (document.visibilityState === 'visible') {
  //     // Restart connection
      // console.log('starting ws connection')
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

        if (
          !!transaction?.to &&
          transaction.to.toLowerCase() ===
            TEAM_NETWORK_MAP[team].testnet.contractAddress.toLowerCase()
        ) {
          const decodedData = paramInterface.parseTransaction({
            data: transaction.data,
            value: transaction.value
          })
          // console.log('txHash', txHash)
          // console.log('decodedData', decodedData)
          const blockHeight = decodedData.args[1].toNumber()
          const choice = VOTES_KEY_MAP[decodedData.args[0]]

          networkStore.update(state => {
            // Ensure the same transaction isn't added multiple times
            if (
              !state.pendingTransactions?.find(
                pendingTx => pendingTx?.txHash === txHash
              )
            ) {
              return {
                ...state,
                pendingTransactions: [
                  ...state.pendingTransactions,
                  {
                    blockHeight: Number(blockHeight),
                    choice,
                    txHash
                  }
                ]
              }
            } else {
              return {
                ...state
              }
            }
          })

          await checkStatusOfPendingTX(txHash)
        }
      })
  //   } else {
  //     // Cancel connection
  //     try {
  //       wsProvider.destroy().then(() => console.log('ws connection closed'))
  //     } catch (error) {
  //       console.log('already closing')
  //     }
  //   }
  // })

  // wsProvider.on('error', async () => {
  //   console.log(`Unable to connect to ${WS_PROVIDER_URL_FILECOIN} retrying in 3s...`)
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
const CHAIN_ID_MAP = {
  ethereum: 3,
  filecoin: 1,
  polygon: 5
}
export const switchChain = async (team) => {
  try {
    const session = getStore(sessionStore)

    await switchNetwork({
      chainId: session.ethereumClient.chains[CHAIN_ID_MAP[team]].id
    })

    // const contract = getStore(contractStore)
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
