// Constantes de l'application

export const APP_CONFIG = {
  name: 'Colorix',
  version: '1.0.0',
  description: 'Application de gestion d\'entreprise'
}

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000, // 10 secondes
  retries: 3
}

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
  maxLimit: 100
}

export const STORAGE_KEYS = {
  authToken: 'authToken',
  user: 'user',
  theme: 'theme',
  language: 'language'
}

export const ROUTES = {
  home: '/',
  login: '/login',
  dashboard: '/dashboard',
  users: '/users',
  customers: '/customers',
  quotes: '/quotes',
  timeLog: '/time-log',
  settings: '/settings'
}

export const USER_ROLES = {
  admin: 'Administrateur',
  manager: 'Manager',
  user: 'Utilisateur'
} as const

export const CUSTOMER_STATUSES = {
  active: 'Actif',
  inactive: 'Inactif',
  prospect: 'Prospect'
} as const

export const QUOTE_STATUSES = {
  draft: 'Brouillon',
  sent: 'Envoyé',
  approved: 'Approuvé',
  rejected: 'Rejeté',
  expired: 'Expiré'
} as const

export const TIME_ENTRY_STATUSES = {
  running: 'En cours',
  stopped: 'Arrêté'
} as const
