import { useMutation, useQueryClient} from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const EditDevis = (token) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["EditDevis"],

        mutationFn: async (formData) => {
            const response = await fetch(`${API_URL}/api/v1/update_devis`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData.playLoad),

            });
            return response.json();
        },

        onSuccess: () => {
            queryClient.invalidateQueries(['GetDevis']);
        },
    });
};
