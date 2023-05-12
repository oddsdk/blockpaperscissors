<script lang="ts">
  import BlockMediumIcon from '$components/icons/BlockMedium.svelte'
  import PaperMediumIcon from '$components/icons/PaperMedium.svelte'
  import ScissorsMediumIcon from '$components/icons/ScissorsMedium.svelte'

  export let heightClass = 'h-[500px]'
</script>

<div class="flex flex-col items-center justify-center {heightClass}">
  <div class="relative my-auto">
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-fadeinout"><BlockMediumIcon /></div>
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-fadeinout animation-delay-[150ms] opacity-0"><PaperMediumIcon /></div>
    <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-fadeinout animation-delay-[300ms] opacity-0"><ScissorsMediumIcon /></div>
  </div>
</div>
