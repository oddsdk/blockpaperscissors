<script>
  import { onDestroy, createEventDispatcher } from 'svelte'

  export let threshold = 0
  export let horizontal = false
  let elementScroll
  export let hasMore = true

  const dispatch = createEventDispatcher()
  let isLoadMore = false
  let component

  $: {
    if (component || elementScroll) {
      const element = elementScroll ? elementScroll : component.parentNode

      element.addEventListener('scroll', onScroll)
      element.addEventListener('resize', onScroll)
    }
  }

  const onScroll = e => {
    const element = e.target
    // console.log('element.scrollHeight', element.scrollHeight)
    // console.log('element.clientHeight', element.clientHeight)
    // console.log('element.scrollTop', element.scrollTop)

    const offset = horizontal
      ? element.scrollWidth - element.clientWidth - element.scrollLeft
      : element.scrollHeight - element.clientHeight - element.scrollTop

    if (offset <= threshold) {
      if (!isLoadMore && hasMore) {
        dispatch('loadMore')
      }
      isLoadMore = true
    } else {
      isLoadMore = false
    }
  }

  onDestroy(() => {
    if (component || elementScroll) {
      const element = elementScroll ? elementScroll : component.parentNode

      element.removeEventListener('scroll', null)
      element.removeEventListener('resize', null)
    }
  })
</script>

<div bind:this={component} class='w-0' />
