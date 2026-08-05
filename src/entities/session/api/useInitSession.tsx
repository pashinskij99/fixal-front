import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/shared/api/api";
import { useSessionStore } from "@/entities/session";
import type { IUser } from "../model/session.store";

const useInitSession = () => {
  const setUser = useSessionStore((state) => state.setUser);
  const clearSession = useSessionStore((state) => state.clearSession);
  const setInitializing = useSessionStore((state) => state.setInitializing);

  const query = useQuery<IUser, Error>({
    queryKey: ["session", "me"],
    queryFn: async () => {
      const response = await api.get("/users/me");
      return response.data;
    },
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUser(query.data);
      setInitializing(false);
    } else if (query.isError) {
      clearSession();
      setInitializing(false);
    }
  }, [
    query.isSuccess,
    query.isError,
    query.data,
    setUser,
    clearSession,
    setInitializing,
  ]);

  return query;
};

export default useInitSession;
