<script lang="ts">
  import Divider from '$components/common/Divider.svelte'
  import BlockIcon from '$components/icons/Block.svelte'
  import PaperIcon from '$components/icons/Paper.svelte'
  import ScissorsIcon from '$components/icons/Scissors.svelte'

  let pronouns = ['you', 'everybody', 'we']
  let verbs = ['get', 'build', 'draw']
  let adjectives = ['biggest', 'longest', 'most intricate']
  let nouns = ['combo', 'streak', 'pattern']
  let colors = ['red', 'green', 'blue']

  let i = 0
  let j = 1
  setInterval(function() {
    j == 2 ? j = 0 : j++
    i == 2 ? i = 0 : i++
  }, 3000)
</script>

<Divider align="right" size="small" />

<h1 class="text-3xl pt-8 pb-10">
  <span class="text-red-500">BLOCK</span><br/>
  <span class="text-green-500">PAPER</span><br/>
  <span class="text-blue-500">SCISSORS</span>
</h1>

<Divider size="medium" />

<div class="flex gap-6 items-center justify-between py-10">
  <BlockIcon />
  <PaperIcon />
  <ScissorsIcon />
</div>

<Divider />

<h2 class="text-xl pt-8 pb-10">
  Can <span class="text-{colors[i]}-500">{pronouns[i]}</span> {verbs[i]} the {adjectives[i]} <span class="text-{colors[j]}-500">{nouns[i]}</span>?
</h2>

<a class="btn btn-primary btn-lg w-full mb-4 text-lg uppercase rounded-none" href="/connect">
  Yes! Let's play
</a>
<a class="btn btn-outline btn-lg w-full border-[6px] text-lg uppercase rounded-none" href="/watch">
  Let me watch first
</a>
