import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

export const auditLogs = (token) => {
  return useQuery(
    ['auditLogs'],
    async () => {
      const response = await fetch(`${API_URL}/api/v1/audit_logs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.json();
    },
    {
      enabled: !!token, // la requête ne se fait que si le token existe
    }
  );
};
