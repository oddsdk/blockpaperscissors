<script lang="ts">
  import { usePrivy } from '@privy-io/react-auth'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { hooks } from 'svelte-preprocess-react'

  import { attachContractToStore } from '$lib/contract'
  import { addNotification } from '$lib/notifications'
  import { switchChain } from '$lib/network'
  import { PUBLIC_ROUTES } from '$lib/session'
  import { sessionStore } from '$src/stores'
  import FullScreenLoadingSpinner from '$components/common/FullScreenLoadingSpinner.svelte'

  // onMount(async () => {
  //   await initialiseSession()
  //   await initialiseNetworkStore()
  // })

  const store = hooks(() => {
    const { authenticated, getEthersProvider, login, logout, ready, user } = usePrivy()
    const provider = getEthersProvider()
    console.log('authenticated', authenticated)
    console.log('provider', provider)
    console.log('chainId', provider?.provider?.walletProvider?.walletProvider?.chainId)
    console.log('ready', ready)
    console.log('user', user)

    return {
      authenticated,
      login,
      logout,
      provider,
      ready,
      user,
    }
  })

  $: loading = !$store || !$store?.ready

  $: {
    if (!$sessionStore.authed && !loading && !PUBLIC_ROUTES.includes($page.url.pathname)) {
      goto('/')
      // addNotification('Please connect your wallet first.')
    }

    if (!$sessionStore.authed && $store && $store.authenticated && $store.provider && $store.user) {
      console.log('FIRING')
      sessionStore.update(state => ({
        ...state,
        authed: true,
        address: $store.user.wallet.address,
      }))

      // Attach BPS contract to networkStore
      attachContractToStore($store.provider).then(() => {
        // addNotification(
        //   'Wallet connected!',
        //   'success'
        // )

        switchChain()
      })
    }
  }
</script>

{#if loading}
  <FullScreenLoadingSpinner />
{:else}
  <slot />
  <!-- <button on:click={async () => {
    await $store.logout()
    window.location.href = window.location.origin
    addNotification(
      'Logout successful!',
      'success'
    )
  }} class="btn btn-primary opacity-0 hover:opacity-100">LOGOUT</button> -->
{/if}
