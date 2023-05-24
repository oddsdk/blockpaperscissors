<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'

  import '$src/global.css'
  import { appDescription, appName, appURL } from '$lib/app-info'
  import { TABLET_WIDTH } from '$lib/device'
  import { addNotification } from '$lib/notifications'
  import { PUBLIC_ROUTES } from '$lib/session'
  import { deviceStore, networkStore, sessionStore, themeStore } from '$src/stores'
  // import SessionProvider from '$components/auth/SessionProvider.svelte'
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

  $: loading = $sessionStore.loading
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

  <div class="pt-[70px] {$page?.route?.id === '/[team]/play' ? '' : 'px-10'} pb-10 max-w-lg mx-auto">
    <!-- <SessionProvider> -->
      {#if loading}
        <FullScreenLoadingSpinner />
      {:else}
        <slot />
      {/if}
    <!-- </SessionProvider> -->
  </div>
</div>
