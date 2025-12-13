import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

export const GetProduct = (token, statusFilter) => {
    return useQuery(
        ['GetProduct', statusFilter],
        async () => {
            let query = '';
            if (statusFilter) query += `product_data=${statusFilter}`;

            const response = await fetch(`${API_URL}/api/v1/get_product${query ? `?${query}` : ''}`, {
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
