<script lang="ts">
  import { page } from '$app/stores'

  import Nav from '$components/nav/Nav.svelte'
  import SessionProvider from '$components/auth/SessionProvider.svelte'
</script>

<SessionProvider>
  <div class="pb-10">
    <slot />
  </div>

  {#if !$page.url.pathname.includes('/connect/') && !$page.url.pathname.includes('/intro/')}
    <Nav />
  {/if}
</SessionProvider>
