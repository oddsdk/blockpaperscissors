<script lang="ts">
  import { onMount } from 'svelte'

  import { contractStore, networkStore } from '$src/stores'
  import { checkStatusOfPendingTX } from '$lib/network'


  $: previousMove = $contractStore?.previousWinner?.result

  onMount(() => {
    if ($networkStore.pendingTransaction) {
        // Poll for the tx receipt to show or hide the user's pending vote
      checkStatusOfPendingTX($networkStore.pendingTransaction.txHash, true)
    }
  })
</script>

<div class="relative left-0 right-0 mt-8 flex items-center justify-center border-black-500 dark:border-base-content border-t-[7px] border-dashed"><span class="p-4 -translate-y-[26px] inline-block rounded-full bg-black-500 dark:bg-base-content text-yellow-500 dark:text-black-500 text-xs font-bold">CURRENT MOVE</span></div>
<div class="flex items-center justify-center gap-6 mt-2 mb-10 px-10">
  <span class="relative flex items-center justify-center w-[98px] h-[98px] rounded-full bg-beige-400 text-center">
    <img src={`${window.location.origin}/questionmark.svg`} alt="question mark" />
    {#if $networkStore?.pendingTransaction?.choice}
      <span class="absolute -right-3 -bottom-3 z-0 flex items-center justify-center w-[48px] h-[48px] bg-base-content rounded-full"><img class="w-[28px] h-auto" src={`${window.location.origin}/${$networkStore.pendingTransaction.choice}.svg`} alt="pending vote" /></span>
    {/if}
  </span>
  <span class="font-bold text-xs">vs</span>
  <img class="w-[91px] h-auto" src={`${window.location.origin}/${previousMove}.svg`} alt={previousMove} />
</div>
