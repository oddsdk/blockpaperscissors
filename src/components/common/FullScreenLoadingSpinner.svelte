<script lang="ts">
  import LoadingSpinner from '$components/common/LoadingSpinner.svelte'
  import IconLoader from '$components/common/IconLoader.svelte'

  export let style = 'icons'
</script>

<div class="w-full h-[calc(100vh-72px)] flex items-center justify-center">
  {#if style === 'icons'}
    <IconLoader />
  {:else}
    <LoadingSpinner />
  {/if}
</div>
