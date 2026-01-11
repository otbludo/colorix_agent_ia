import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const EditAdmin = (token) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["EditAdmin"],

    mutationFn: async (formData) => {
      const response = await fetch(`${API_URL}/api/v1/edit-statuts-admin`, {
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
      queryClient.invalidateQueries(['GetAdmin']);
    },
  });
};
