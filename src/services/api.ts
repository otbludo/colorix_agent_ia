// Configuration de base pour les appels API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

// Classe pour gérer les erreurs API
export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: any) {
    super(message)
    this.name = 'ApiError'
  }
}

// Fonction utilitaire pour les appels API
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Ajouter le token d'authentification si disponible
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erreur réseau' }))
      throw new ApiError(response.status, errorData.message || 'Erreur API', errorData)
    }

    // Pour les réponses 204 (No Content), retourner null
    if (response.status === 204) {
      return null as T
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Erreur réseau ou autre
    throw new ApiError(0, 'Erreur de connexion réseau', error)
  }
}

// Services API organisés par domaine
export const authService = {
  async login(credentials: { email: string; password: string }) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },

  async register(userData: { name: string; email: string; password: string }) {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  async logout() {
    return apiRequest('/auth/logout', {
      method: 'POST',
    })
  },

  async getCurrentUser() {
    return apiRequest('/auth/me')
  },

  async refreshToken() {
    return apiRequest('/auth/refresh', {
      method: 'POST',
    })
  },
}

export const userService = {
  async getUsers(params?: { page?: number; limit?: number; search?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)

    const queryString = queryParams.toString()
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`

    return apiRequest(endpoint)
  },

  async getUserById(id: string) {
    return apiRequest(`/users/${id}`)
  },

  async createUser(userData: any) {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  },

  async updateUser(id: string, userData: any) {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  },

  async deleteUser(id: string) {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
    })
  },
}

export const customerService = {
  async getCustomers(params?: { page?: number; limit?: number; search?: string; status?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status) queryParams.append('status', params.status)

    const queryString = queryParams.toString()
    const endpoint = `/customers${queryString ? `?${queryString}` : ''}`

    return apiRequest(endpoint)
  },

  async getCustomerById(id: string) {
    return apiRequest(`/customers/${id}`)
  },

  async createCustomer(customerData: any) {
    return apiRequest('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    })
  },

  async updateCustomer(id: string, customerData: any) {
    return apiRequest(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    })
  },

  async deleteCustomer(id: string) {
    return apiRequest(`/customers/${id}`, {
      method: 'DELETE',
    })
  },
}

export const quoteService = {
  async getQuotes(params?: { page?: number; limit?: number; search?: string; status?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status) queryParams.append('status', params.status)

    const queryString = queryParams.toString()
    const endpoint = `/quotes${queryString ? `?${queryString}` : ''}`

    return apiRequest(endpoint)
  },

  async getQuoteById(id: string) {
    return apiRequest(`/quotes/${id}`)
  },

  async createQuote(quoteData: any) {
    return apiRequest('/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    })
  },

  async updateQuote(id: string, quoteData: any) {
    return apiRequest(`/quotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quoteData),
    })
  },

  async deleteQuote(id: string) {
    return apiRequest(`/quotes/${id}`, {
      method: 'DELETE',
    })
  },
}

export const timeLogService = {
  async getTimeEntries(params?: { page?: number; limit?: number; userId?: string; date?: string }) {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.userId) queryParams.append('userId', params.userId)
    if (params?.date) queryParams.append('date', params.date)

    const queryString = queryParams.toString()
    const endpoint = `/time-entries${queryString ? `?${queryString}` : ''}`

    return apiRequest(endpoint)
  },

  async createTimeEntry(entryData: any) {
    return apiRequest('/time-entries', {
      method: 'POST',
      body: JSON.stringify(entryData),
    })
  },

  async updateTimeEntry(id: string, entryData: any) {
    return apiRequest(`/time-entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entryData),
    })
  },

  async deleteTimeEntry(id: string) {
    return apiRequest(`/time-entries/${id}`, {
      method: 'DELETE',
    })
  },

  async startTimer(entryData: any) {
    return apiRequest('/time-entries/start', {
      method: 'POST',
      body: JSON.stringify(entryData),
    })
  },

  async stopTimer(entryId: string) {
    return apiRequest(`/time-entries/${entryId}/stop`, {
      method: 'POST',
    })
  },
}
