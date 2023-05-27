<script lang="ts">
  import { onMount, onDestroy } from 'svelte'

  import { contractStore, networkStore } from '$src/stores'
  import { moveHistoryMap } from '$lib/contract'
  import InfiniteScroll from '$components/common/InfiniteScroll.svelte'
  import BlockMediumIcon from '$components/icons/BlockMedium.svelte'
  import PaperMediumIcon from '$components/icons/PaperMedium.svelte'
  import ScissorsMediumIcon from '$components/icons/ScissorsMedium.svelte'

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

  let moveHistory = $contractStore?.results.slice(0, 100).toReversed()
  const unsubscribeContractStore = contractStore.subscribe((state) => {
    if (state.results) {
      moveHistory = state.results?.slice(0, 100).toReversed()

      if ($networkStore.pendingTransactions.length) {
        moveHistory = moveHistory.map(move => {
          const pendingTXsForBlockHeight = $networkStore.pendingTransactions.filter(pendingTx => Number(pendingTx.blockHeight) === Number(move?.blockHeight))

          let leadingMajority = null
          if (pendingTXsForBlockHeight.length) {

            const blockVotes = pendingTXsForBlockHeight.filter(pendingTx => pendingTx.choice === 'block').length
            const paperVotes = pendingTXsForBlockHeight.filter(pendingTx => pendingTx.choice === 'paper').length
            const scissorsVotes = pendingTXsForBlockHeight.filter(pendingTx => pendingTx.choice === 'scissors').length

            if (blockVotes > paperVotes && blockVotes > scissorsVotes) {
              leadingMajority = 'block'
            } else if (paperVotes > blockVotes && paperVotes > scissorsVotes) {
              leadingMajority = 'paper'
            } else if (scissorsVotes > blockVotes && scissorsVotes > paperVotes) {
              leadingMajority = 'scissors'
            }

            if (leadingMajority) {
              return {
                ...move,
                result: leadingMajority,
                pending: true
              }
            }
          }

          return move
        })
      }
      // console.log('moveHistory', moveHistory)
    }
  })

  // Parse pending transactions to display in the history list
  // let pendingResults = {}
  // const unsubscribeNetworkStore = networkStore.subscribe((state) => {
  //   console.log('state.pendingTransactions', state.pendingTransactions)

  //   if (state.pendingTransactions.length) {
      // moveHistory = moveHistory.map(move => {
      //   const pendingTXsForBlockHeight = state.pendingTransactions.filter(pendingTx => Number(pendingTx.blockHeight) === Number(move?.blockHeight))
      //   console.log('pendingTXsForBlockHeight', pendingTXsForBlockHeight)

      //   let leadingMajority = null
      //   if (pendingTXsForBlockHeight.length) {

      //     const blockVotes = pendingTXsForBlockHeight.filter(pendingTx => pendingTx.choice === 'block').length
      //     const paperVotes = pendingTXsForBlockHeight.filter(pendingTx => pendingTx.choice === 'paper').length
      //     const scissorsVotes = pendingTXsForBlockHeight.filter(pendingTx => pendingTx.choice === 'scissors').length

      //     console.log('blockVotes', blockVotes)
      //     console.log('paperVotes', paperVotes)
      //     console.log('scissorsVotes', scissorsVotes)
      //     if (blockVotes > paperVotes && blockVotes > scissorsVotes) {
      //       leadingMajority = 'block'
      //     } else if (paperVotes > blockVotes && paperVotes > scissorsVotes) {
      //       leadingMajority = 'paper'
      //     } else if (scissorsVotes > blockVotes && scissorsVotes > paperVotes) {
      //       leadingMajority = 'scissors'
      //     }

      //     if (leadingMajority) {
      //       console.log('leadingMajority', leadingMajority)
      //       return {
      //         ...move,
      //         result: leadingMajority,
      //         pending: true
      //       }
      //     }
      //   }

      //   return move
      // })


    //   pendingResults = state.pendingTransactions.reduce((acc, tx) => {
    //     let totalsForBlockHeight = {
    //       ...acc[tx.blockHeight],
    //       votes: {
    //         ...acc[tx.blockHeight]?.votes,
    //         [tx.choice]: acc[tx.blockHeight] && acc[tx.blockHeight]?.votes[tx.choice] ? (Number(acc[tx.blockHeight].votes[tx.choice]) + 1) : 1,
    //       }
    //     }

    //     let result = Object.keys(totalsForBlockHeight.votes).reduce((max, current) => totalsForBlockHeight.votes[max] > totalsForBlockHeight.votes[current] ? max : current)
    //     totalsForBlockHeight.result = result

    //     let previousResult = getPreviousWinner(state.pendingTransactions?.toReversed(), tx.blockHeight)
    //     if (!previousResult || Number(previousResult?.blockHeight) !== Number(tx.blockHeight)) {
    //       previousResult = $contractStore?.previousWinner?.result
    //     }

    //     totalsForBlockHeight.previousResult = previousResult

    //     return {
    //       ...acc,
    //       [tx.blockHeight]: totalsForBlockHeight
    //     }
    //   }, {})
    // }

    // // Clear out the pendingTransactions as the networkStore is updated
    // if (Object.keys(pendingResults).length > 0) {
    //   if (state.pendingTransactions?.length < 1) {
    //     pendingResults = {}
    //   } else {
    //     state.pendingTransactions?.forEach((result) => {
    //       const stringifiedBlockHeight = String(result.blockHeight)
    //       if (!Object.keys(pendingResults).includes(stringifiedBlockHeight)) {
    //         delete pendingResults[stringifiedBlockHeight]
    //       }
    //     })
    //   }
  //   }
  // })

  onDestroy(() => {
    // unsubscribeNetworkStore()
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
      {@const move = moveHistoryMap(result)}
      <!-- {#if result.pending}
        {console.log('result', result)}
      {/if} -->
      <div class="relative z-0 flex items-center justify-center gap-9 py-[18px]">
        <!-- {#if move.result === 'win'}
          <div class="absolute z-0 top-0 left-1/2 -translate-x-1/2 h-10 w-[7px] bg-black-500"></div>
        {/if} -->

        <div class="relative">
          <img src="{window.location.origin}/{result?.result}.svg" alt="{result?.result}" class="w-[56px] h-auto" />
          {#if result.pending}
            <span class="absolute -right-5 -bottom-5 z-0 flex items-center justify-center w-[36px] h-[36px] bg-base-content rounded-full">
              <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-fadeinout"><img src="{window.location.origin}/block.svg" alt="block" class="w-[21px] h-auto" /></div>
              <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-fadeinout animation-delay-[150ms] opacity-0"><img src="{window.location.origin}/paper.svg" alt="paper" class="w-[21px] h-auto" /></div>
              <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-fadeinout animation-delay-[300ms] opacity-0"><img src="{window.location.origin}/scissors.svg" alt="scissors" class="w-[21px] h-auto" /></div>
            </span>
          {/if}
        </div>

        {#if result.pending}
          <p class="flex flex-col items-center justify-center py-3 text-base text-center text-xs">finalizing<br /><span><span class="block btn-loading w-[14px]"></span></span></p>
        {:else}
          {#if move.result === 'win'}
            <p class="text-base text-yellow-500 font-bold bg-black-500 py-2 px-[15px]">WIN!</p>
          {:else if move.result === 'loss'}
            <p class="text-base text-red-500 font-bold">LOSS</p>
          {:else}
            <p class="text-base py-3">DRAW</p>
          {/if}
        {/if}

        {#if result.pending}
          <img src="{window.location.origin}/{$contractStore?.previousWinner?.result}.svg" alt="{$contractStore?.previousWinner?.result}" class="w-[56px] h-auto" />
        {:else}
          <img src="{window.location.origin}/{move.previousMove === 'null' ? result.result : move.previousMove}.svg" alt="{move.previousMove === 'null' ? result.result : move.previousMove}" class="w-[56px] h-auto" />
        {/if}
      </div>
    {/if}
  {/each}
  <!-- {#each Object.keys(pendingResults) as key, i}
    {#if pendingResults[key]?.result}
      <div class="relative z-0 flex items-center justify-center gap-9 py-[18px]">
        <img src="{window.location.origin}/{pendingResults[key].result}.svg" alt="{pendingResults[key].result}" class="w-[56px] h-auto" />

        <p class="flex flex-col items-center justify-center py-3 text-base text-center text-xs">finalizing<br /><span><span class="block btn-loading w-[14px]"></span></span></p>

        <img src="{window.location.origin}/{pendingResults[key].previousResult}.svg" alt="{pendingResults[key].previousResult}" class="w-[56px] h-auto" />
      </div>
    {/if}
  {/each} -->
  <div bind:this={scrollTarget} />
</div>
