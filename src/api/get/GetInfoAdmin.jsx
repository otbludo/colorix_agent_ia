import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

export const GetInfoAdmin = (token) => {
    return useQuery(
        ['GetInfoAdmin'],
        async () => {

            const response = await fetch(
                `${API_URL}/api/v1/current_admin_info`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log("data:", response)
            return response.json();
        },
        {
            enabled: !!token,
        }
    );
};

