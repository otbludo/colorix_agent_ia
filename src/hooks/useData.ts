import { useState, useEffect, useCallback } from 'react'

interface UseDataOptions {
  page?: number
  limit?: number
  search?: string
  filters?: Record<string, any>
}

interface UseDataResult<T> {
  data: T[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null
  refetch: () => Promise<void>
  setPage: (page: number) => void
  setSearch: (search: string) => void
  setFilters: (filters: Record<string, any>) => void
}

export function useData<T>(
  fetchFunction: (params: any) => Promise<any>,
  initialOptions: UseDataOptions = {}
): UseDataResult<T> {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>(null)
  const [options, setOptions] = useState<UseDataOptions>(initialOptions)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetchFunction(options)

      if (response.data && Array.isArray(response.data)) {
        setData(response.data)
      } else if (Array.isArray(response)) {
        setData(response)
      } else {
        setData([])
      }

      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des données')
      setData([])
    } finally {
      setLoading(false)
    }
  }, [fetchFunction, options])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const setPage = useCallback((page: number) => {
    setOptions(prev => ({ ...prev, page }))
  }, [])

  const setSearch = useCallback((search: string) => {
    setOptions(prev => ({ ...prev, search, page: 1 }))
  }, [])

  const setFilters = useCallback((filters: Record<string, any>) => {
    setOptions(prev => ({ ...prev, ...filters, page: 1 }))
  }, [])

  return {
    data,
    loading,
    error,
    pagination,
    refetch: fetchData,
    setPage,
    setSearch,
    setFilters
  }
}
