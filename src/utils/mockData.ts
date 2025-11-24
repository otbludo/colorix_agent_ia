// Données mockées pour le développement

import type { User, Customer, Quote, TimeEntry } from '../types'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'admin@colorix.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-12-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Marie Dupont',
    email: 'marie.dupont@colorix.com',
    role: 'manager',
    status: 'active',
    createdAt: '2024-02-15T00:00:00Z',
    lastLogin: '2024-12-15T09:15:00Z'
  },
  {
    id: '3',
    name: 'Jean Martin',
    email: 'jean.martin@colorix.com',
    role: 'user',
    status: 'active',
    createdAt: '2024-03-01T00:00:00Z',
    lastLogin: '2024-12-14T16:45:00Z'
  }
]

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'TechCorp Inc.',
    email: 'contact@techcorp.com',
    phone: '+33123456789',
    address: '123 Rue de la Innovation',
    city: 'Paris',
    country: 'France',
    status: 'active'
  },
  {
    id: '2',
    name: 'ShopOnline',
    email: 'manager@shoponline.fr',
    phone: '+33198765432',
    address: '456 Avenue du Commerce',
    city: 'Lyon',
    country: 'France',
    status: 'active'
  },
  {
    id: '3',
    name: 'SecureData Corp',
    email: 'security@securedata.com',
    phone: '+33111223344',
    address: '789 Boulevard de la Sécurité',
    city: 'Marseille',
    country: 'France',
    status: 'prospect'
  }
]

export const mockQuotes: Quote[] = [
  {
    id: '1',
    title: 'Refonte site web entreprise',
    client: 'TechCorp Inc.',
    clientEmail: 'contact@techcorp.com',
    clientPhone: '+33123456789',
    amount: 8500,
    status: 'sent',
    createdAt: '2024-11-20',
    validUntil: '2024-12-20',
    description: 'Refonte complète du site web avec nouvelle charte graphique'
  },
  {
    id: '2',
    title: 'Application mobile e-commerce',
    client: 'ShopOnline',
    clientEmail: 'manager@shoponline.fr',
    clientPhone: '+33198765432',
    amount: 12500,
    status: 'approved',
    createdAt: '2024-11-15',
    validUntil: '2024-12-15',
    description: 'Développement d\'une application mobile pour boutique en ligne'
  }
]

export const mockTimeEntries: TimeEntry[] = [
  {
    id: '1',
    task: 'Design homepage mockup',
    project: 'Website Redesign',
    user: 'Marie Dupont',
    date: '2024-12-15',
    duration: 120,
    description: 'Working on homepage wireframes',
    status: 'stopped'
  },
  {
    id: '2',
    task: 'API development',
    project: 'Mobile App',
    user: 'Jean Martin',
    date: '2024-12-15',
    duration: 180,
    description: 'Implementing user authentication endpoints',
    status: 'running'
  }
]

// Fonction utilitaire pour simuler un délai API
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Fonction pour simuler une réponse API avec pagination
export function mockApiResponse<T>(
  data: T[],
  options: { page?: number; limit?: number } = {}
): { data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } } {
  const { page = 1, limit = 10 } = options
  const total = data.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedData = data.slice(startIndex, endIndex)

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  }
}
