<script>
  import { onDestroy, createEventDispatcher } from 'svelte'

  export let hasMore = true

  const dispatch = createEventDispatcher()
  let isLoadMore = false

  let y = 0
  const trackScroll = (scrollY) => {
    if (scrollY === 0) {
      if (!isLoadMore && hasMore) {
        dispatch('loadMore')
      }
      isLoadMore = true
    } else {
      isLoadMore = false
    }
    console.log('scrollY', scrollY)
  }

  $: trackScroll(y)
</script>

<svelte:window bind:scrollY={y} />
<!-- <div bind:this={component} class='w-0' /> -->
