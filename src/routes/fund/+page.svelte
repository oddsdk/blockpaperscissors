<script lang="ts">
  import Divider from '$components/common/Divider.svelte'
  import BlockIcon from '$components/icons/Block.svelte'
  import PaperIcon from '$components/icons/Paper.svelte'
  import ScissorsIcon from '$components/icons/Scissors.svelte'
</script>

<svelte:head>
  <script src={`${window.location.origin}/fund-ring-widget.js`}></script>
</svelte:head>

<Divider align="right" size="small" />

<h1 class="text-3xl pt-8 pb-10">
  <span class="text-red-500">BLOCK</span><br/>
  <span class="text-green-500">PAPER</span><br/>
  <span class="text-blue-500">SCISSORS</span>
</h1>

<Divider size="medium" />

<div class="mb-10"></div>

<fund-ring-widget
  contractAddress="0xA369Ae5472c0F6E78BaBb73Baa624a5F694DEe51"
  title="Help fund the SLW RK'D!"
  description="We're trying to build the world's slowest arcade. With your help, we can realize this vision a little less slowly"
/>
