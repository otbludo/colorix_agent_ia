import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

export const GetStatDevisFromCustomer = (token, customer_id) => {
    return useQuery(
        ['GetStatDevisFromCustomer', customer_id],
        async () => {

            const response = await fetch(
                `${API_URL}/api/v1/stats_from_customer/${customer_id}`,
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

