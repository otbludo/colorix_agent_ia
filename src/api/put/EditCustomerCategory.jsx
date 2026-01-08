import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const EditCustomerCategory = (token) => {
    return useMutation({
        mutationKey: ["EditCustomerCategory"],

        mutationFn: async (formData) => {
            const response = await fetch(`${API_URL}/api/v1/update_customer_category`, {
                method: "PUT",
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
