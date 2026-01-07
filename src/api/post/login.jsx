import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const LoginUser = () => {
  return useMutation({
    mutationKey: ["LoginUser"],

    mutationFn: async ({ email, password }) => {
      const body = new URLSearchParams();
      body.append("grant_type", "password");
      body.append("username", email);
      body.append("password", password);

      const response = await fetch(`${API_URL}/api/v1/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      });

      return response.json();
    },
  });
};
