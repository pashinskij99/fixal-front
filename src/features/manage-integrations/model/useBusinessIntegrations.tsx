import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/api/api";

interface Integration {
  type: string;
  apiKey: string;
}

export function useBusinessIntegrations(businessId: number | undefined) {
  const queryClient = useQueryClient();

  const { data: integrations, isLoading } = useQuery<Integration[]>({
    queryKey: ["integrations", businessId],
    queryFn: async () => {
      const response = await api.get(
        `/onboarding/integrations/business/${businessId}`,
      );
      return response.data;
    },
    enabled: !!businessId,
  });

  const connectNovaPoshta = useMutation({
    mutationFn: (data: { apiKey: string; businessId: number }) =>
      api.post("/onboarding/integrations/nova-poshta", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations", businessId] });
      alert("Nova Poshta updated!");
    },
  });

  const connectPrro = useMutation({
    mutationFn: (data: { token: string; businessId: number }) =>
      api.post("/onboarding/integrations/prro", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations", businessId] });
      alert("PRRO updated!");
    },
  });

  const updateBusinessSettings = useMutation({
    mutationFn: (data: { businessId: number; defaultCarrier: string }) =>
      api.patch(`/onboarding/setup-business/${data.businessId}/settings`, {
        defaultCarrier: data.defaultCarrier,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });

  return {
    integrations,
    isLoading,
    connectNovaPoshta,
    connectPrro,
    updateBusinessSettings,
  };
}
