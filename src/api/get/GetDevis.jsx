import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

export const GetDevis = (token, statusFilter) => {
    return useQuery(
        ['GetDevis', statusFilter],
        async () => {
            let query = '';
            if (statusFilter) query += `status=${statusFilter}`;

            const response = await fetch(
                `${API_URL}/api/v1/get_devis${query ? `?${query}` : ''}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.json();
        },
        {
            enabled: !!token,
        }
    );
};

