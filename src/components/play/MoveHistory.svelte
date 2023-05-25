<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  import { contractStore, networkStore } from '$src/stores'
  import { moveHistoryMap } from '$lib/contract'
  import InfiniteScroll from '$components/common/InfiniteScroll.svelte'

  export let loadingComplete

  let offset = 30
  let cursor = 1
  let moves = $contractStore?.results?.slice(0, offset * cursor)?.toReversed()
  let nextBatchOfMoves = []

  // Paginate the move history to show them via infinite scroll
  const getPreviousMoves = () => {
    nextBatchOfMoves = $contractStore?.results?.slice(offset * cursor, offset * (cursor + 1))?.toReversed()
    cursor++
    console.log('nextBatchOfMoves', nextBatchOfMoves)
  }

  $: moves = [
    ...nextBatchOfMoves,
		...moves,
  ];

  // Scroll to bottom of the list(this is a little sketchy)
  let scrolledToBottom = false
  let scrollTarget
  $: {
    if (scrollTarget) {
      setTimeout(() => {
        const scroll = () => window.scrollTo({
          top: document.body.scrollHeight,
        })
        scroll()
        loadingComplete()
        scrolledToBottom = true
        // console.log('scrolledToBottom')
      }, 10)
    }
  }

  // Find the last winner(non-draw and non-stalemate)
  const getPreviousWinner = (results, currentBlockHeight) => {
    const previousWinner = results.find(
      result => result?.blockHeight !== currentBlockHeight
    )

    return previousWinner
  }

  // Parse pending transactions to display in the history list
  let pendingResults = {}
  const unsubscribeNetworkStore = networkStore.subscribe((state) => {
    if (state.pendingTransactions.length) {
      pendingResults = state.pendingTransactions.reduce((acc, tx) => {
        let totalsForBlockHeight = {
          ...acc[tx.blockHeight],
          votes: {
            ...acc[tx.blockHeight]?.votes,
            [tx.choice]: acc[tx.blockHeight] && acc[tx.blockHeight]?.votes[tx.choice] ? (Number(acc[tx.blockHeight].votes[tx.choice]) + 1) : 1,
          }
        }

        let result = Object.keys(totalsForBlockHeight.votes).reduce((max, current) => totalsForBlockHeight.votes[max] > totalsForBlockHeight.votes[current] ? max : current)
        totalsForBlockHeight.result = result

        let previousResult = getPreviousWinner(state.pendingTransactions?.toReversed(), tx.blockHeight)
        if (!previousResult || Number(previousResult?.blockHeight) !== Number(tx.blockHeight)) {
          previousResult = $contractStore?.previousWinner?.result
        }

        totalsForBlockHeight.previousResult = previousResult

        return {
          ...acc,
          [tx.blockHeight]: totalsForBlockHeight
        }
      }, {})
    }

    // Clear out the pendingTransactions as the networkStore is updated
    if (Object.keys(pendingResults).length > 0) {
      if (state.pendingTransactions?.length < 1) {
        pendingResults = {}
      } else {
        state.pendingTransactions?.forEach((result) => {
          const stringifiedBlockHeight = String(result.blockHeight)
          if (!Object.keys(pendingResults).includes(stringifiedBlockHeight)) {
            delete pendingResults[stringifiedBlockHeight]
          }
        })
      }
    }
  })

  let moveHistory = $contractStore?.results.slice(0, 100).toReversed()
  const unsubscribeContractStore = contractStore.subscribe((state) => {
    if (state.results) {
      moveHistory = state.results?.slice(0, 100).toReversed()
      // console.log('moveHistory', moveHistory)
    }
  })

  onDestroy(() => {
    unsubscribeNetworkStore()
    unsubscribeContractStore()
  })
</script>

<!-- {#if scrolledToBottom}
  <InfiniteScroll
    hasMore={$contractStore?.results?.length !== moves.length}
    on:loadMore={() => getPreviousMoves()}
  />
{/if} -->
<div class="flex flex-col px-10">
  {#each moveHistory as result, i}
    {#if result?.result === 'stalemate'}
      <div class="flex items-center justify-center py-[18px]">
        <p class="text-base py-3">STALEMATE</p>
      </div>
    {:else if result?.result === 'draw'}
      <div class="flex items-center justify-center py-[18px]">
        <p class="text-base py-3">DRAW</p>
      </div>
    {:else}
      {@const moveHistory = moveHistoryMap(result)}
      <div class="relative z-0 flex items-center justify-center gap-9 py-[18px]">
        <!-- {#if moveHistory.result === 'win'}
          <div class="absolute z-0 top-0 left-1/2 -translate-x-1/2 h-10 w-[7px] bg-black-500"></div>
        {/if} -->

        <img src="{window.location.origin}/{result?.result}.svg" alt="{result?.result}" class="w-[56px] h-auto" />

        {#if moveHistory.result === 'win'}
          <p class="text-base text-yellow-500 font-bold bg-black-500 py-2 px-[15px]">WIN!</p>
        {:else if moveHistory.result === 'loss'}
          <p class="text-base text-red-500 font-bold">LOSS</p>
        {:else}
          <p class="text-base py-3">DRAW</p>
        {/if}

        <img src="{window.location.origin}/{moveHistory.previousMove === 'null' ? result.result : moveHistory.previousMove}.svg" alt="{moveHistory.previousMove === 'null' ? result.result : moveHistory.previousMove}" class="w-[56px] h-auto" />
      </div>
    {/if}
  {/each}
  {#each Object.keys(pendingResults) as key, i}
    {#if pendingResults[key]?.result}
      <div class="relative z-0 flex items-center justify-center gap-9 py-[18px]">
        <img src="{window.location.origin}/{pendingResults[key].result}.svg" alt="{pendingResults[key].result}" class="w-[56px] h-auto" />

        <p class="flex flex-col items-center justify-center py-3 text-base text-center text-xs">finalizing<br /><span><span class="block btn-loading w-[14px]"></span></span></p>

        <img src="{window.location.origin}/{pendingResults[key].previousResult}.svg" alt="{pendingResults[key].previousResult}" class="w-[56px] h-auto" />
      </div>
    {/if}
  {/each}
  <div bind:this={scrollTarget} />
</div>
