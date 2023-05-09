<script lang="ts">
  import Divider from '$components/common/Divider.svelte'

  const contentMap = [
    {
      title: 'How do I win?',
      description: 'Some content here',
    },
    {
      title: 'Who made this game?',
      description: 'Some content here',
    },
    {
      title: 'How do I report a bug?',
      description: 'Some content here',
    },
    {
      title: 'What is SLW RK’D?',
      description: 'Some content here',
    },
    {
      title: 'I have an idea for a game. How do I get involved?',
      description: 'Some content here',
    },
    {
      title: 'Why did you do this?',
      description: 'Some content here',
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
        <p>{content.description}</p>
      </div>
    </div>
  {/each}
</div>
