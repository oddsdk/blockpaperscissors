<script lang="ts">
  import BlockIcon from '$components/icons/Block.svelte';
  import PaperIcon from '$components/icons/Paper.svelte';
  import ScissorsIcon from '$components/icons/Scissors.svelte';


  let pronouns = ['you', 'everybody', 'we'];
  let verbs = ['get', 'build', 'draw'];
  let adjectives = ['biggest', 'longest', 'most intricate']
  let nouns = ['combo', 'streak', 'pattern'];
  let colors = ['red', 'green', 'blue'];

  let i = 0;
  let j = 1;
  setInterval(function() {
    j == 2 ? j = 0 : j++;
    i == 2 ? i = 0 : i++;
  }, 3000);
</script>

  <hr/>
  <h1 class="text-3xl">
    CONNECT<br/>
    YOUR<br/>
    WALLET
  <hr/>
  <div>
    <BlockIcon />
    <PaperIcon />
    <ScissorsIcon />
  </div>
  <h2 class="text-xl">
    Can <span class="text-{colors[i]}-500">{pronouns[i]}</span> {verbs[i]} the {adjectives[i]} <span class="text-{colors[j]}-500">{nouns[i]}</span>?
  </h2>
  <a class="btn btn-primary btn-lg" href="/connect">
    Yes! Let's play
  </a>
  <a class="btn btn-secondary btn-lg" href="/connect">
    Let me watch first
  </a>