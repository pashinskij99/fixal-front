import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/shared/api/api";
import { useSessionStore } from "@/entities/session";
import type { SignInFormValues } from "../model/signin.schema";

export function useSignIn() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setUser = useSessionStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: SignInFormValues) => {
      const response = await api.post("/users/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);

      queryClient.setQueryData(["session", "me"], data.user);

      navigate("/business");
    },
  });
}
