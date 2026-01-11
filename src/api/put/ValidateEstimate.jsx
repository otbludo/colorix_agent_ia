import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const ValidateEstimate = (token) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["ValidateEstimate"],

        mutationFn: async (formData) => {
            const response = await fetch(`${API_URL}/api/v1/validate_devis`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),

            });

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["GetDevis"] });
        },

    });
};
