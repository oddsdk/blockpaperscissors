<script lang="ts">
  import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
  import { Web3Modal } from '@web3modal/html'
  import { configureChains, createConfig, getWalletClient } from '@wagmi/core'
  import { publicProvider } from '@wagmi/core/providers/public'
  import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
  import { arbitrum, filecoin, filecoinHyperspace, mainnet, optimism, polygon, polygonZkEvm } from '@wagmi/core/chains'
  import { ethers } from 'ethers'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'

  import { attachContractToStore } from '$lib/contract'
  import { addNotification } from '$lib/notifications'
  import { wsProvider, switchChain, initialise as initialiseNetworkStore } from '$lib/network'
  import { PUBLIC_ROUTES, initialise as initialiseSession } from '$lib/session'
  import { sessionStore } from '$src/stores'
  import FullScreenLoadingSpinner from '$components/common/FullScreenLoadingSpinner.svelte'

  const chains = [
    filecoin,
    filecoinHyperspace,
    // arbitrum,
    // mainnet,
    // optimism,
    // polygon,
    // polygonZkEvm,
  ]
  const projectId = 'e0a88efdcd4eba50434eaa623195c84c'

  const { publicClient } = configureChains(chains, [
    w3mProvider({ projectId }),
    publicProvider(),
    // jsonRpcProvider({
    //   rpc: (chain) => ({
    //     http: `https://${chain.id}.example.com`,
    //   }),
    // }),
  ])
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }),
    publicClient
  })
  const ethereumClient = new EthereumClient(wagmiConfig, chains)
  const web3modal = new Web3Modal({ projectId }, ethereumClient)
  console.log('ethereumClient', ethereumClient)
  const account = ethereumClient.getAccount()
  web3modal.setDefaultChain(filecoinHyperspace)

  getWalletClient().then(client => console.log('client', client))

  sessionStore.update(state => ({
    ...state,
    ethereumClient,
    web3modal,
  }))

  onMount(async () => {
    await initialiseSession()
    await initialiseNetworkStore()

    const unsubscribeModal = web3modal.subscribeModal(newState => {
      // console.log('modal state', newState)
      const address = ethereumClient.getAccount()?.address
      if (address && !newState?.open && $page.url.pathname === '/connect/') {
        sessionStore.update(state => ({
          ...state,
          authed: true,
          address,
        }))
        goto('/intro')
        switchChain()
      }
    })
    const unsubscribeEvents = web3modal.subscribeEvents(newState => console.log('events state', newState))

    return () => {
      unsubscribeModal()
      unsubscribeEvents()
    }
  })

  // $: loading = !account.isConnected
  $: loading = false

  $: {
    // if (!account.address && !loading && !PUBLIC_ROUTES.includes($page.url.pathname)) {
    //   goto('/')
    //   addNotification('Please connect your wallet first.')
    // }

    if (!$sessionStore.authed && !!account?.address) {
      sessionStore.update(state => ({
        ...state,
        authed: true,
        address: account.address,
      }))
    }
  }

  // const provider = new ethers.providers.JsonRpcProvider('https://api.hyperspace.node.glif.io/rpc/v1')
  const provider = new ethers.providers.JsonRpcProvider(ethereumClient.chains[1]?.rpcUrls.default.http[0]);
  // Attach BPS contract to networkStore
  attachContractToStore(provider).then(() => {
    // addNotification(
    //   'Wallet connected!',
    //   'success'
    // )
  })
</script>

{#if loading}
  <FullScreenLoadingSpinner />
{:else}
  <slot />
{/if}
