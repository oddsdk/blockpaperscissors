<script lang="ts">
  import { onDestroy } from 'svelte'
  import { get as getStore } from 'svelte/store'
  import { page } from '$app/stores'

  import { fetchGameState } from '$lib/contract'
  import { networkStore } from '$src/stores'

  const BLOCK_TIME_MAP = {
    ethereum: 15,
    filecoin: 30,
    polygon: 2,
  }

  let previousBlockHeight = getStore(networkStore)?.blockHeight
  let now = Date.now()
  let end = now + BLOCK_TIME_MAP[$page.params.team] * 1000

  $: count = Math.round((end - now) / 1000)

  const updateTimer = () => (now = Date.now())

  let interval = setInterval(updateTimer, 1000)

  // Reset the timer each time the blockHeight changes
  const unsubscribe = networkStore.subscribe(state => {
    if (state?.blockHeight !== previousBlockHeight) {
      previousBlockHeight = state.blockHeight

      clearInterval(interval)
      fetchGameState()

      now = Date.now()
      end = now + BLOCK_TIME_MAP[$page.params.team] * 1000
      interval = setInterval(updateTimer, 1000)
    }
  })

  onDestroy(unsubscribe)
</script>

<span>~{count}<span class="lowercase">s</span></span>
