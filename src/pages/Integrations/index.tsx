import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "../../api";
import { 
    novaPoshtaSchema, 
    type NovaPoshtaFormValues, 
    prroSchema, 
    type PrroFormValues 
} from "./integrations.schema";

interface Business {
  id: number;
  legalName: string;
  publicName?: string;
}

export default function IntegrationsPage() {
  const { data: businesses } = useQuery<Business[]>({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await api.get("/onboarding/setup-business");
      return response.data;
    },
  });

  const novaPoshtaForm = useForm<NovaPoshtaFormValues>({
    resolver: zodResolver(novaPoshtaSchema),
  });

  const prroForm = useForm<PrroFormValues>({
    resolver: zodResolver(prroSchema),
  });

  const connectNovaPoshtaMutation = useMutation({
    mutationFn: (data: { apiKey: string; businessId: number }) =>
      api.post("/onboarding/integrations/nova-poshta", data),
    onSuccess: () => {
      alert("Nova Poshta connected successfully!");
    },
  });

  const onNovaPoshtaSubmit = (data: NovaPoshtaFormValues) => {
    connectNovaPoshtaMutation.mutate({
      apiKey: data.apiKey,
      businessId: parseInt(data.businessId),
    });
  };

  const onPrroSubmit = (data: PrroFormValues) => {
    console.log("Connecting PRRO:", data);
    alert("PRRO connection not implemented yet");
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Connect your tools</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Nova Poshta</CardTitle>
            <CardDescription>Connect your Nova Poshta account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={novaPoshtaForm.handleSubmit(onNovaPoshtaSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label>Select Business</Label>
                <Controller
                  control={novaPoshtaForm.control}
                  name="businessId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business" />
                      </SelectTrigger>
                      <SelectContent>
                        {businesses?.map((b) => (
                          <SelectItem key={b.id} value={b.id.toString()}>
                            {b.publicName || b.legalName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {novaPoshtaForm.formState.errors.businessId && (
                    <p className="text-sm text-destructive">{novaPoshtaForm.formState.errors.businessId.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>API Key</Label>
                <Input {...novaPoshtaForm.register("apiKey")} placeholder="Enter API key" />
                {novaPoshtaForm.formState.errors.apiKey && (
                    <p className="text-sm text-destructive">{novaPoshtaForm.formState.errors.apiKey.message}</p>
                )}
              </div>
              <Button type="submit" disabled={connectNovaPoshtaMutation.isPending}>
                {connectNovaPoshtaMutation.isPending ? "Connecting..." : "Connect"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PRRO (Checkbox/Вчасно)</CardTitle>
            <CardDescription>Connect your PRRO account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={prroForm.handleSubmit(onPrroSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label>Select Business</Label>
                <Controller
                  control={prroForm.control}
                  name="businessId"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business" />
                      </SelectTrigger>
                      <SelectContent>
                        {businesses?.map((b) => (
                          <SelectItem key={b.id} value={b.id.toString()}>
                            {b.publicName || b.legalName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {prroForm.formState.errors.businessId && (
                    <p className="text-sm text-destructive">{prroForm.formState.errors.businessId.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Token/Password</Label>
                <Input type="password" {...prroForm.register("token")} placeholder="Enter token or password" />
                {prroForm.formState.errors.token && (
                    <p className="text-sm text-destructive">{prroForm.formState.errors.token.message}</p>
                )}
              </div>
              <Button type="submit">Connect</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
