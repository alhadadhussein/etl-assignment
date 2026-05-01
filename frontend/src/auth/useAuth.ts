import { ref, computed } from 'vue'
import { msalInstance } from './msalInstance'
import { loginRequest } from './msalConfig'
import { InteractionRequiredAuthError } from '@azure/msal-browser'
import type { AccountInfo } from '@azure/msal-browser'

const account = ref<AccountInfo | null>(null)

export function useAuth() {
  const isAuthenticated = computed(() => !!account.value)
  const user = computed(() => account.value?.name ?? '')

  //For the single-tenant, single-user app, we can simply set the first account as active.
  const setActiveAccount = () => {
    const accounts = msalInstance.getAllAccounts()
    if (accounts.length > 0) {
      msalInstance.setActiveAccount(accounts[0])
      account.value = accounts[0]
    }
  }

  const login = () => {
    msalInstance.loginRedirect(loginRequest)
  }

  const logout = () => {
    msalInstance.logoutRedirect()
  }

  const getToken = async (): Promise<string> => {
    const activeAccount = msalInstance.getActiveAccount()
    if (!activeAccount) {
      throw new Error('No active account')
    }

    try {
      // Try to get a token silently from cache or refresh token (no user interaction)
      const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: activeAccount,
      })
      return response.accessToken
    } catch (error) {
      // If silent fails for example if refresh token is expired, redirect to login page
      if (error instanceof InteractionRequiredAuthError) {
        msalInstance.acquireTokenRedirect({
          ...loginRequest,
          account: activeAccount,
        })
      }
      throw error
    }
  }

  return { isAuthenticated, user, login, logout, getToken, setActiveAccount }
}
