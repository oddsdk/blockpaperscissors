<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'

  import { sessionStore } from '$src/stores'
  import { switchChain } from '$lib/network'
  import { initialise } from '$lib/session'
  import Divider from '$components/common/Divider.svelte'

  // Connect to WalletAuth then redirect to the intro page
  const init = async () => {
    try {
      $sessionStore.web3modal.openModal({
        route: 'ConnectWallet'
      })
    } catch (error) {
      console.error(error)
    }
  }

  $: {
    if ($sessionStore.ethereumClient) {
      const account = $sessionStore.ethereumClient.getAccount()
      if (account.isConnected) {
        switchChain($page.params.team).then(() => {
          goto(`/${$page.params.team}/intro`)
        })
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
