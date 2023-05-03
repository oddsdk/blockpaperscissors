<script lang="ts">
  import { usePrivy } from '@privy-io/react-auth';
  import { goto } from '$app/navigation'
  import { hooks } from 'svelte-preprocess-react'

  import { initialise } from '$lib/session'
  import Divider from '$components/common/Divider.svelte'

  const store = hooks(() => {
    const { authenticated, login, ready, user } = usePrivy()
    console.log('authenticated', authenticated)
    console.log('ready', ready)
    console.log('user', user)
    return {
      authenticated,
      login,
      ready,
      user,
    }
  })

  // Connect to WalletAuth then redirect to the intro page
  const init = async () => {
    try {
      const { login } = $store
      login()
    } catch (error) {
      console.error(error)
    }
  }

  $: {
    console.log('$store', $store)
    if ($store) {
      const { authenticated } = $store
      console.log('isAuthenticated')
      if (authenticated) {
        const initStoreAndContinue = async () => {
          await initialise()
          console.log('test')
          goto('/intro')
        }
        initStoreAndContinue()
      }
    }
  }
</script>

<Divider align="right" size="small" />

<h1 class="text-3xl pt-8 pb-10">
  CONNECT<br/>
  YOUR<br/>
  WALLET
</h1>

<Divider size="medium" />

<div class="flex flex-col gap-10 py-10">
  <p class="text-xl font-bold">
    As one of the first guests to our SLW RK’d, you get unlimited free plays.
  </p>

  <p class="text-xl font-bold">
    Have a gas! (which is all you’ll pay)
  </p>
</div>

<button class="btn btn-primary btn-lg w-full mb-4 text-lg uppercase rounded-none" on:click={init}>
  Connect Wallet
</button>
