// Types communs pour l'application Colorix

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'manager'
  status: 'active' | 'inactive'
  createdAt?: string
  lastLogin?: string
  avatar?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  status: 'active' | 'inactive' | 'prospect'
}

export interface Quote {
  id: string
  title: string
  description: string
  client: string
  clientEmail: string
  clientPhone: string
  amount: number
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired'
  createdAt: string
  validUntil: string
}

export interface TimeEntry {
  id: string
  task: string
  project: string
  user: string
  date: string
  duration: number // in minutes
  description: string
  status: 'running' | 'stopped'
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'on-hold'
  progress: number
  dueDate: string
  team: number
  tasks: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Types pour les formulaires
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface QuoteForm {
  title: string
  description: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCompany: string
  amount: number
  validUntil: string
}

export interface UserForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: 'admin' | 'user' | 'manager'
  status: 'active' | 'inactive'
}

// Types pour les filtres et recherches
export interface FilterOptions {
  status?: string[]
  dateRange?: {
    start: string
    end: string
  }
  search?: string
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

// Types pour la navigation
export interface NavItem {
  icon: any
  label: string
  path: string
}

// Types pour les erreurs
export interface ApiError {
  message: string
  code?: string
  details?: any
}
