import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const InitResetInfosAdmin = (token) => {
    return useMutation({
        mutationKey: ["InitResetInfosAdmin"],

        mutationFn: async (formData) => {
            const response = await fetch(`${API_URL}/api/v1/request-update-info`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            return response.json();
        },
    });
};
