import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "@/shared/api/api";
import type { SignUpFormValues } from "../model/signup.schema";

export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: SignUpFormValues) => {
      const response = await api.post("/users/register", data);
      return response.data;
    },
    onSuccess: () => {
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    },
  });
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || "Something went wrong";
  }
  return "An unexpected error occurred";
};
