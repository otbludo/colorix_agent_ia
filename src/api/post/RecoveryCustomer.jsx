import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

export const RecoveryCustomer = (token) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['RecoveryCustomer'],
        mutationFn: async (adminId) => {
            const response = await fetch(`${API_URL}/api/v1/recovery_customer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id: adminId }),
            });

            return response.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries(['GetCustomer']);
        },
    });
};
