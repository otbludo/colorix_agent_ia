import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const DeleteProduct = (token) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["DeleteProduct"],

    mutationFn: async (formData) => {
      const response = await fetch(`${API_URL}/api/v1/delete_product`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      return response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries(['GetProduct']);
    },
  });
};
