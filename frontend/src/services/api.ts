import { useAuth } from '../auth/useAuth'

// wrapper around fetch to automatically include auth token and base URL
const apiFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
  const { getToken } = useAuth()
  const token = await getToken()
  return fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })
}

const apiClient = {
  async getHello(): Promise<string> {
    const response = await apiFetch('/hello')
    if (!response.ok) throw new Error(`API error: ${response.status}`)
    return response.text()
  }
}

export default apiClient
