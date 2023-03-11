<script lang="ts">
  import { onMount } from 'svelte'

  import '../global.css'
  import { appDescription, appName, appURL } from '$lib/app-info'
  import { TABLET_WIDTH } from '$lib/device'
  import { initialise as initialiseNetworkStore, isConnected } from '$lib/network'
  import { initialise as initialiseWalletAuth } from '$lib/session'
  import { deviceStore, sessionStore, themeStore } from '$src/stores'
  import FullScreenLoadingSpinner from '$components/common/FullScreenLoadingSpinner.svelte'
  import Notifications from '$components/notifications/Notifications.svelte'
  // import Footer from '$components/Footer.svelte'

  let metaMaskLoading = false

  // If MetaMask is already connected, automatically initialize WalletAuth
  const checkMetaMaskConnection = async () => {
    metaMaskLoading = true
    const metamaskConnected = await isConnected()
    if (metamaskConnected) {
      await initialiseWalletAuth()
    }
    metaMaskLoading = false
  }

  onMount(async () => {
    await checkMetaMaskConnection()
    await initialiseNetworkStore()
    setDevice()
  })

  const setDevice = () => {
    if (window.innerWidth <= TABLET_WIDTH) {
      deviceStore.set({ isMobile: true })
    } else {
      deviceStore.set({ isMobile: false })
    }
  }
</script>

<svelte:head>
  <title>{appName}</title>

  <meta name="description" content={appDescription} />
  <meta property="og:title" content={appName} />
  <meta property="og:description" content={appDescription} />
  <meta property="og:url" content={appURL} />
  <meta name="twitter:title" content={appName} />
  <meta name="twitter:description" content={appDescription} />
  <meta name="twitter:image:alt" content={appName} />
</svelte:head>

<svelte:window on:resize={setDevice} />

<div data-theme={$themeStore.selectedTheme} class="min-h-screen">
  <Notifications />

  {#if metaMaskLoading || $sessionStore.loading}
    <FullScreenLoadingSpinner />
  {:else}
    <div class="pt-[70px] px-10 pb-10 max-w-lg mx-auto">
      <slot />
    </div>
  {/if}
</div>
