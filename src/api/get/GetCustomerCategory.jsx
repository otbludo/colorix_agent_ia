import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

export const GetCustomerCategory = (token, statusFilter) => {
    return useQuery(
        ['GetCustomerCategory', statusFilter],
        async () => {
            let query = '';
            if (statusFilter) query += `category_data=${statusFilter}`;

            const response = await fetch(
                `${API_URL}/api/v1/get_customer_category${query ? `?${query}` : ''}`,
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

