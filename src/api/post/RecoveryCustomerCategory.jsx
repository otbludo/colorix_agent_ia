import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

export const RecoveryCustomerCategory = (token) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['RecoveryCustomerCategory'],
        mutationFn: async ({ id }) => {
            const response = await fetch(`${API_URL}/api/v1/recovery_customer_category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id }),
            });

            return response.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries(['GetCustomerCategory']);
        },
    });
};
