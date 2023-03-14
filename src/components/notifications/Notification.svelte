<script lang="ts">
  import { fade, fly } from 'svelte/transition'

  import { themeStore } from '../../stores'
  import type { Notification } from '$lib/notifications'
  import CheckThinIcon from '$components/icons/CheckThinIcon.svelte'
  import InfoThinIcon from '$components/icons/InfoThinIcon.svelte'
  import WarningThinIcon from '$components/icons/WarningThinIcon.svelte'
  import XThinIcon from '$components/icons/XThinIcon.svelte'

  export let notification: Notification

  const iconMap = {
    info: {
      component: InfoThinIcon,
      props: {
        color: '#F5F8E6'
      }
    },
    error: {
      component: XThinIcon,
      props: {
        color: '#F5F8E6'
      }
    },
    success: {
      component: CheckThinIcon,
      props: {
        color: '#F5F8E6'
      }
    },
    warning: {
      component: WarningThinIcon,
      props: {
        color: '#F5F8E6'
      }
    }
  }
</script>

<div
  in:fly={{ y: 20, duration: 400 }}
  out:fade
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  <div class="alert alert-{notification.type} items-center justify-start rounded-none text-sm mb-3 peer-last:mb-0 text-white-500">
    <div>
      <svelte:component
        this={iconMap[notification.type].component}
        {...iconMap[notification.type].props}
      />
      <span class="pl-1">{@html notification.msg}</span>
    </div>
  </div>
</div>
