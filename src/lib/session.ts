import { get as getStore } from 'svelte/store'
import { goto } from '$app/navigation'

import { sessionStore } from '../stores'
import { addNotification } from '$lib/notifications'

export type Session = {
  address: string
  authed: boolean
  loading: boolean
  error: boolean
}

export const PUBLIC_ROUTES = ['', '/', '/connect/']

/**
 * Ask the user to connect their metamask so we can populate the sessionStore
 */
export const initialise: () => Promise<void> = async () => {
  try {
    // sessionStore.update(state => ({ ...state, loading: true }))

    sessionStore.update(state => ({
      ...state,
      authed: false,
      loading: false
    }))
  } catch (error) {
    console.error(error)
    sessionStore.update(state => ({ ...state, error: true, loading: false }))
    addNotification(error.message, 'error')
    throw new Error(error)
  }
}

/**
 * Disconnect the user from their webnative session, reset the sessionStore and go to homepage
 */
export const disconnect: () => Promise<void> = async () => {
  sessionStore.update(state => ({
    ...state,
    address: null,
    authed: false,
    loading: false,
    error: false
  }))

  goto('/')
}

/**
 * Copy the user's address to the clipboard
 */
export const copyAddressToClipboard: () => Promise<void> = async () => {
  try {
    const session = getStore(sessionStore)
    await navigator.clipboard.writeText(session.address)
    addNotification('Address copied to clipboard', 'success')
  } catch (error) {
    console.error(error)
    addNotification('Failed to copy address to clipboard', 'error')
  }
}
