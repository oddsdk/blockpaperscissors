<script lang="ts">
  import Divider from '$components/common/Divider.svelte'
  import PersonaNav from '$components/nav/PersonaNav.svelte'
  import ProfileInfo from '$components/account/ProfileInfo.svelte'
</script>

<div class="flex flex-col gap-8 h-[618px]">
  <ProfileInfo />

  <Divider />

  <h1 class="text-xl font-bold mt-[164px] mb-[127px] text-center">Leaderboards are coming soon!</h1>

  <div class="mt-auto">
    <PersonaNav />
  </div>
</div>
