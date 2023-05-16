<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'

  import '$src/global.css'
  import { appDescription, appName, appURL } from '$lib/app-info'
  import { TABLET_WIDTH } from '$lib/device'
  import { APPROVED_CHAIN_IDS, initialise as initialiseNetworkStore, isConnected, switchChain } from '$lib/network'
  import { addNotification } from '$lib/notifications'
  import { PUBLIC_ROUTES, disconnect, initialise as initialiseSession } from '$lib/session'
  import { deviceStore, networkStore, sessionStore, themeStore } from '$src/stores'
  import SessionProvider from '$components/auth/SessionProvider.svelte'
  import FullScreenLoadingSpinner from '$components/common/FullScreenLoadingSpinner.svelte'
  import Notifications from '$components/notifications/Notifications.svelte'

  onMount(async () => {
    setDevice()
  })

  const setDevice = () => {
    if (window.innerWidth <= TABLET_WIDTH) {
      deviceStore.set({ isMobile: true })
    } else {
      deviceStore.set({ isMobile: false })
    }
  }

  // // Detect account changes and clear the sessionStore when disconnected
  // window.ethereum.on('accountsChanged', (accounts) => {
  //   if (!(accounts as string[])?.length) {
  //     disconnect()
  //   }
  // })

  // // If the user switches off hyperspace, prompt them to switch back and take them home
  // window.ethereum.on('chainChanged', async (chainId) => {
  //   if (APPROVED_CHAIN_IDS.hyperspace !== chainId) {
  //     goto('/')
  //     await switchChain()
  //   }
  // })

  $: loading = !$networkStore.blockHeight || $sessionStore.loading

  $: {
    if (!$sessionStore.authed && !loading && !PUBLIC_ROUTES.includes($page.url.pathname)) {
      goto('/')
      // addNotification('Please connect your wallet first.')
    }
  }

 const handleLogin = (user) => {
    console.log(`User ${user.id} logged in!`)
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

  <!-- <react:PrivyProvider
    appId="clfjzbafx000hmp08r3l8mj7c"
    createPrivyWalletOnLogin={true}
    config={{
      appearance: {
        accentColor: $themeStore.selectedTheme === 'light' ? '#252621' : '#F5F8E6',
        theme: $themeStore.selectedTheme === 'light' ? '#F5F8E6' : '#252621',
      }
    }}
    onSuccess={handleLogin}
  > -->
    <div class="pt-[70px] px-10 pb-10 max-w-lg mx-auto">
      <SessionProvider>
        {#if loading}
          <FullScreenLoadingSpinner />
        {:else}
          <slot />
        {/if}
      </SessionProvider>
    </div>
  <!-- </react:PrivyProvider> -->
</div>
