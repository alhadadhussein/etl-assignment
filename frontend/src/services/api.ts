const apiClient = {
  async getHello(): Promise<string> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/hello`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return response.text()
  }
}

export default apiClient
