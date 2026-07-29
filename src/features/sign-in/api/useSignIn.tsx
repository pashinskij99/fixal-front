import { useNavigate } from "react-router-dom";
import type { SignInFormValues } from "../model/signin.schema";
import { useMutation } from "@tanstack/react-query";
import api from "@/shared/api/api";
import { sessionModel } from "@/entities/session";

export function useSignIn() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SignInFormValues) => {
      const response = await api.post("/users/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      sessionModel.setToken(data.access_token);
      navigate("/");
    },
  });
}
