<script lang="ts">
  import Divider from '$components/common/Divider.svelte'

  const contentMap = [
    {
      title: 'How do I win?',
      description: '<p>Let\'s rephrase that to: how do *we* win?</p><br/><p>The network you choose to play on is effectively your team. Your goal as a team is to maintain the longest winning streak against the other teams / networks. And because these networks are permission-less, I suppose there’s nothing stopping you from trying to sabotage your opponents, is there?</p><br/><p>Block, Paper, Scissors is currently deployed to the following testnets:</p><ul><li>+Ethereum Goerli</li><li>+Polygon Mumbai</li><li>+Filecoin Calibration</li></ul>',
    },
    {
      title: 'Who made this game?',
      description: '<p>This game is the first release in the SLW RK’D, which was started by the odd protocol engineering minds over at Fission. We work on low level local-first edge computing protocols, and easy-to-use platforms for deploying them in your apps. Playing games requires a state of flow, so we think that designing and building a game is a great way to identify where all the rough edges still are in DX and UX.</p>',
    },
    {
      title: 'How do I report a bug?',
      description: `Open an issue in the <a href="https://github.com/oddsdk/blockpaperscissors"><u>Github Repo</u></a>, or hop into the <a href="https://discord.com/channels/478735028319158273/1118323336791986216/1118324083705258014"><u>SLW RK’D channel</u></a> on Fission’s server.`,
    },
    {
      title: 'What is SLW RK’D?',
      description: '<p>SLW RK’D (pronounced: “slow arcade”) is primarily focused on making games that incorporate the capabilities and constraints of the distributed networks they are deployed to into their core mechanic. Read more about the <a href="https://github.com/oddsdk/blockpaperscissors/pull/8/files#diff-9a83d42c29efbf2e9edda928b9c6d877e33ca510222de6f2f2e284a1accd0545"><u>SLW RK\'D\'s 7 core principles</u></a> in our draft Solidity Interface contract.</p>',
    },
    {
      title: 'I have an idea for a game. How do I get involved?',
      description: '<p>Awesome! We’re still in draft mode, so please join the conversation in the <a href="https://discord.com/channels/478735028319158273/1118323336791986216/1118324083705258014"><u>SLW RK’D channel</u></a> of <a href="https://fission.codes/discord"><u>Fission\'s Discord</u></a>. You can also check out the core <a href="https://github.com/oddsdk/blockpaperscissors"><u>SLW RK’D repository</u></a> to review principles and look at our sample interface contracts.</p>',
    },
  ]
</script>

<Divider align="right" size="small" />

<h1 class="text-3xl pt-8 pb-10 uppercase">
  Help
</h1>

<Divider size="medium" />

<div class="mt-11">
  {#each contentMap as content}
    <div class="collapse mb-4">
      <input type="checkbox" />
      <div class="collapse-title !p-0 text-[31px] font-bold">
        {content.title}
      </div>
      <div class="collapse-content">
        {@html content.description}
      </div>
    </div>
  {/each}
</div>
