import { useQuery } from "@tanstack/react-query";
import api from "@/shared/api/api"; // шлях змінено на shared після рефакторингу
import type { Business } from "../model/types";

interface IUseBusinessesProps {
  enabled?: boolean;
}

export const useBusinesses = ({ enabled }: IUseBusinessesProps) =>
  useQuery<Business[]>({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await api.get("/onboarding/setup-business");
      return response.data;
    },
    enabled,
  });
