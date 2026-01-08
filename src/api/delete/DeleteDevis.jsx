import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const DeleteCustomer = (token) => {
  return useMutation({
    mutationKey: ["DeleteCustomer"],

    mutationFn: async (formData) => {
      const response = await fetch(`${API_URL}/api/v1/delete_customer`, {
        method: "DELETE",
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
