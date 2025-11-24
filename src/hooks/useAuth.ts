import { useState, useEffect, useCallback } from 'react'
import { authService } from '../services/api'
import type { User, LoginForm, RegisterForm } from '../types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null
  })

  // Vérifier l'authentification au montage
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setAuthState(prev => ({ ...prev, isLoading: false }))
        return
      }

      const user = await authService.getCurrentUser()
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null
      })
    } catch (error) {
      localStorage.removeItem('authToken')
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null
      })
    }
  }, [])

  const login = useCallback(async (credentials: LoginForm) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await authService.login(credentials)
      const { token, user } = response

      localStorage.setItem('authToken', token)

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null
      })

      return { success: true }
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Erreur de connexion'
      }))
      return { success: false, error: error.message }
    }
  }, [])

  const register = useCallback(async (userData: RegisterForm) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

      const response = await authService.register(userData)
      const { token, user } = response

      localStorage.setItem('authToken', token)

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null
      })

      return { success: true }
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Erreur d\'inscription'
      }))
      return { success: false, error: error.message }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch (error) {
      // Ignore les erreurs de logout
    } finally {
      localStorage.removeItem('authToken')
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null
      })
    }
  }, [])

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    ...authState,
    login,
    register,
    logout,
    clearError,
    checkAuthStatus
  }
}
