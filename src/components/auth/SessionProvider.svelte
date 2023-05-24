<script lang="ts">
  import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
  import { Web3Modal } from '@web3modal/html'
  import { configureChains, createConfig, getWalletClient } from '@wagmi/core'
  import { publicProvider } from '@wagmi/core/providers/public'
  // import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
  import { arbitrum, arbitrumGoerli, filecoin, filecoinHyperspace, goerli, mainnet, optimism, optimismGoerli, polygon, polygonMumbai, polygonZkEvm, polygonZkEvmTestnet } from '@wagmi/core/chains'
  import { ethers } from 'ethers'
  import { dev } from '$app/environment'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'

  import { attachContractToStore } from '$lib/contract'
  import { addNotification } from '$lib/notifications'
  import { switchChain, initialise as initialiseNetworkStore } from '$lib/network'
  import { PUBLIC_ROUTES, initialise as initialiseSession } from '$lib/session'
  import { networkStore, sessionStore } from '$src/stores'
  import FullScreenLoadingSpinner from '$components/common/FullScreenLoadingSpinner.svelte'

  const chains = [
    filecoin,
    filecoinHyperspace,
    mainnet,
    goerli,
    polygon,
    polygonMumbai,
    // optimism,
    // optimismGoerli,
    // arbitrum,
    // arbitrumGoerli,
    // polygonZkEvm,
  ]
  const projectId = 'e0a88efdcd4eba50434eaa623195c84c'

  const { publicClient } = configureChains(chains, [
    w3mProvider({ projectId }),
    publicProvider(),
  ])
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }),
    publicClient
  })
  const ethereumClient = new EthereumClient(wagmiConfig, chains)
  const web3modal = new Web3Modal({ projectId }, ethereumClient)

  let account = ethereumClient.getAccount()
  web3modal.setDefaultChain($page.params.team === 'ethereum' ? goerli : filecoinHyperspace)

  getWalletClient()
  // .then(client => console.log('client', client))

  sessionStore.update(state => ({
    ...state,
    ethereumClient,
    web3modal,
  }))

  onMount(async () => {
    await initialiseSession()
    await initialiseNetworkStore($page.params.team ?? 'filecoin')

    const unsubscribeModal = web3modal.subscribeModal(async newState => {
      const address = ethereumClient.getAccount()?.address
      if (address && !newState?.open && $page.url.pathname.includes('/connect/')) {
        sessionStore.update(state => ({
          ...state,
          authed: true,
          address,
        }))

        await initialiseNetworkStore($page.params.team)
        goto(`/${$page.params.team}/intro`)
        await switchChain($page.params.team)
      }
    })
    const unsubscribeEvents = web3modal.subscribeEvents(newState => {
      if (dev) {
        console.log('events state', newState)
      }
    })

    return () => {
      unsubscribeModal()
      unsubscribeEvents()
    }
  })

  $: loading = !$networkStore.blockHeight || $sessionStore.loading
  $: {
    account = ethereumClient.getAccount()
    if (!account.address && !loading && !PUBLIC_ROUTES.includes($page.url.pathname)) {
      goto('/')
      addNotification('Please connect your wallet first.')
    }
  }

  $: {
    if (!$sessionStore.authed && !!account?.address) {
      sessionStore.update(state => ({
        ...state,
        authed: true,
        address: account.address,
      }))
    }

  }

  // Set provider
  const provider = new ethers.providers.JsonRpcProvider($page.params.team === 'ethereum' ? 'https://ethereum-goerli.publicnode.com' : ethereumClient.chains[1]?.rpcUrls.default.http[0]);

  // Attach BPS contract to contractStore
  attachContractToStore(provider, $page.params.team)
</script>

{#if loading}
  <FullScreenLoadingSpinner />
{:else}
  <slot />
{/if}
