import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "../../api";
import { novaPoshtaSchema, type NovaPoshtaFormValues, prroSchema, type PrroFormValues } from "../Integrations/integrations.schema";

interface Business {
  id: number;
  legalName: string;
  publicName?: string;
  taxId: string;
  defaultCarrier?: string | null;
}

interface Integration {
  type: string;
  apiKey: string;
}

const carrierOptions = [
  { value: "nova_poshta", label: "Nova Poshta" },
  { value: "ukrposhta", label: "Ukrposhta" },
  { value: "meest", label: "Meest" },
  { value: "rozetka", label: "Rozetka" },
  { value: "sat", label: "SAT" },
  { value: "delivery_group", label: "Delivery Group" },
];

export default function BusinessListPage() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null,
  );
  const queryClient = useQueryClient();

  const { data: businesses, isLoading } = useQuery<Business[]>({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await api.get("/onboarding/setup-business");
      return response.data;
    },
  });

  const { data: integrations } = useQuery<Integration[]>({
    queryKey: ["integrations", selectedBusiness?.id],
    queryFn: async () => {
      const response = await api.get(
        `/onboarding/integrations/business/${selectedBusiness?.id}`,
      );
      return response.data;
    },
    enabled: !!selectedBusiness,
  });

  const novaPoshtaForm = useForm<NovaPoshtaFormValues>({
    resolver: zodResolver(novaPoshtaSchema),
  });

  const prroForm = useForm<PrroFormValues>({
    resolver: zodResolver(prroSchema),
  });

  useEffect(() => {
    if (selectedBusiness && integrations) {
      const np = integrations.find(i => i.type === 'nova-poshta');
      novaPoshtaForm.reset({ apiKey: np?.apiKey || "" });
      const prro = integrations.find(i => i.type === 'prro');
      prroForm.reset({ token: prro?.apiKey || "" });
    }
  }, [selectedBusiness, integrations, novaPoshtaForm, prroForm]);

  const connectNovaPoshtaMutation = useMutation({
    mutationFn: (data: { apiKey: string; businessId: number }) =>
      api.post("/onboarding/integrations/nova-poshta", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations", selectedBusiness?.id] });
      alert("Nova Poshta updated!");
    },
  });

  const connectPrroMutation = useMutation({
    mutationFn: (data: { token: string; businessId: number }) =>
      api.post("/onboarding/integrations/prro", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations", selectedBusiness?.id] });
      alert("PRRO updated!");
    },
  });

  const updateBusinessSettingsMutation = useMutation({
    mutationFn: (data: { businessId: number; defaultCarrier: string }) =>
      api.patch(`/onboarding/setup-business/${data.businessId}/settings`, {
        defaultCarrier: data.defaultCarrier,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
  });

  const onNovaPoshtaSubmit = (data: NovaPoshtaFormValues) => {
    if (selectedBusiness) {
      connectNovaPoshtaMutation.mutate({ apiKey: data.apiKey, businessId: selectedBusiness.id });
    }
  };

  const onPrroSubmit = (data: PrroFormValues) => {
    if (selectedBusiness) {
      connectPrroMutation.mutate({ token: data.token, businessId: selectedBusiness.id });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Your Businesses</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Public Name</TableHead>
              <TableHead>Legal Name</TableHead>
              <TableHead>Tax ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businesses?.map((b) => (
              <TableRow
                key={b.id}
                onClick={() => setSelectedBusiness(b)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">
                  {b.publicName || "-"}
                </TableCell>
                <TableCell>{b.legalName}</TableCell>
                <TableCell>{b.taxId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog
        open={!!selectedBusiness}
        onOpenChange={() => setSelectedBusiness(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Manage Integrations:{" "}
              {selectedBusiness?.publicName || selectedBusiness?.legalName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Default Carrier</Label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={selectedBusiness?.defaultCarrier || "nova_poshta"}
                onChange={(event) => {
                  if (!selectedBusiness) {
                    return;
                  }

                  const nextCarrier = event.target.value;
                  setSelectedBusiness({
                    ...selectedBusiness,
                    defaultCarrier: nextCarrier,
                  });
                  updateBusinessSettingsMutation.mutate({
                    businessId: selectedBusiness.id,
                    defaultCarrier: nextCarrier,
                  });
                }}
              >
                {carrierOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <form onSubmit={novaPoshtaForm.handleSubmit(onNovaPoshtaSubmit)} className="space-y-4">
              <Label>Nova Poshta API Key</Label>
              <Input {...novaPoshtaForm.register("apiKey")} placeholder="Enter API key" />
              <Button type="submit" disabled={connectNovaPoshtaMutation.isPending}>Save Nova Poshta</Button>
            </form>
            <form onSubmit={prroForm.handleSubmit(onPrroSubmit)} className="space-y-4">
              <Label>PRRO Token/Password</Label>
              <Input type="password" {...prroForm.register("token")} placeholder="Enter token or password" />
              <Button type="submit" disabled={connectPrroMutation.isPending}>Save PRRO</Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
