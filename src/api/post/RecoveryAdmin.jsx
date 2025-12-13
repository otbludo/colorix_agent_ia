import { useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL;

export const useRecoveryAdmin = (token) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['recoveryAdmin'],
        mutationFn: async (adminId) => {
            const response = await fetch(`${API_URL}/api/v1/recovery-admin`, {
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
            queryClient.invalidateQueries(['getAdmins']);
        },
    });
};
