<script lang="ts">
  import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
  import { Web3Modal } from '@web3modal/html'
  import { configureChains, createConfig, getWalletClient } from '@wagmi/core'
  import { publicProvider } from '@wagmi/core/providers/public'
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
  const chainMap = {
    ethereum: {
      mainnet: mainnet,
      testnet: goerli,
    },
    filecoin: {
      mainnet: filecoin,
      testnet: filecoinHyperspace,
    },
    polygon: {
      mainnet: polygon,
      testnet: polygonMumbai
    },
  }

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
  web3modal.setDefaultChain(chainMap[$page.params.team].testnet)

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
      console.log('newState', newState)
      console.log('newState address', address)
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
    account = ethereumClient.getAccount()
    if (!$sessionStore.authed && !!account?.address) {
      sessionStore.update(state => ({
        ...state,
        authed: true,
        address: account.address,
      }))

      if (!$networkStore.blockHeight) {
        initialiseNetworkStore($page.params.team)
      }
    }

  }

  // Set provider
  const RPC_URL_MAP = {
    ethereum: 'https://ethereum-goerli.publicnode.com',
    filecoin: ethereumClient.chains[1]?.rpcUrls.default.http[0],
    polygon: 'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78',
  }
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL_MAP[$page.params.team]);

  // Attach BPS contract to contractStore
  attachContractToStore(provider, $page.params.team)
</script>

{#if loading}
  <FullScreenLoadingSpinner />
{:else}
  <slot />
{/if}
