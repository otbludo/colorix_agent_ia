import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

export const GetAdmin = (token, statusFilter, dateRange) => {
  return useQuery(
    ['GetAdmin', statusFilter, dateRange],
    async () => {
      let query = '';
      if (statusFilter) query += `status=${statusFilter}`;
      if (dateRange?.start) query += query ? `&start=${dateRange.start}` : `start=${dateRange.start}`;
      if (dateRange?.end) query += query ? `&end=${dateRange.end}` : `end=${dateRange.end}`;

      const response = await fetch(`${API_URL}/api/v1/get_admins${query ? `?${query}` : ''}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      return response.json();
    },
    {
      enabled: !!token,
    }
  );
};
