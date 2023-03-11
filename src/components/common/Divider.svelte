<script lang="ts">
  export let align = 'left'
  export let size = 'large'

  let widths = {
    small: 'w-[82px]',
    medium: 'w-[189px]',
    large: 'w-full',
  }
</script>

{#if align === 'right'}
  <div class="flex justify-end">
    <div class="h-[7px] {widths[size]} bg-base-content" />
  </div>
{:else}
  <div class="h-[7px] {widths[size]} bg-base-content" />
{/if}
