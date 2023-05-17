<script lang="ts">
  import { onMount } from 'svelte'
  import { dev } from '$app/environment'

  import { contractStore, networkStore } from '$src/stores'

  $: previousMove = $contractStore?.previousWinner?.result

  // Poll for the tx receipt to show or hide the user's pending vote
  const checkStatusOfPendingTX = async () => {
    let receipt = null
    while (receipt === null) {
      try {
        receipt = await $contractStore.provider.getTransactionReceipt($networkStore.pendingTransaction.txHash as string)

        if (receipt === null) {
          if (dev) {
            console.log('Checking for tx receipt...')
          }
          continue
        }

        networkStore.update((state) => ({
          ...state,
          pendingTransaction: null
        }))

        if (dev) {
          console.log('Receipt fetched:', receipt)
        }
      } catch (e) {
        console.error(e)
        break
      }
    }
  }

  onMount(() => {
    if ($networkStore.pendingTransaction) {
      checkStatusOfPendingTX()
    }
  })
</script>

<div class="relative left-0 right-0 mt-8 flex items-center justify-center border-black-500 border-t-[7px] border-dashed"><span class="p-4 -translate-y-[26px] inline-block rounded-full bg-black-500 text-yellow-500 text-xs font-bold">CURRENT MOVE</span></div>
<div class="flex items-center justify-center gap-6 mt-2 mb-10">
  <span class="relative flex items-center justify-center w-[98px] h-[98px] rounded-full bg-beige-400 text-center">
    <img src={`${window.location.origin}/questionmark.svg`} alt="question mark" />
    {#if $networkStore?.pendingTransaction?.choice}
      <span class="absolute -right-3 -bottom-3 z-0 flex items-center justify-center p-3 bg-base-content rounded-full"><img class="w-[28px] h-auto" src={`${window.location.origin}/${$networkStore.pendingTransaction.choice}.svg`} alt="pending vote" /></span>
    {/if}
  </span>
  <span class="font-bold text-xs">vs</span>
  <img class="w-[91px] h-auto" src={`${window.location.origin}/${previousMove}.svg`} alt={previousMove} />
</div>
