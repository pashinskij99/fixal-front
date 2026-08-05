import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/shared/api/api";
import { useSessionStore } from "@/entities/session";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearSession = useSessionStore((state) => state.clearSession);

  return useMutation({
    mutationFn: async () => {
      await api.post("/users/logout");
    },
    onSuccess: () => {
      clearSession();

      queryClient.clear();

      navigate("/signin", { replace: true });
    },
    onError: (error) => {
      console.error(
        "Logout failed on server, clearing client session anyway:",
        error,
      );
      clearSession();
      queryClient.clear();
      navigate("/signin", { replace: true });
    },
  });
};
