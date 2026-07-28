import { useEffect } from "react";

import { useBusinessIntegrations } from "../model/useBusinessIntegrations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  novaPoshtaSchema,
  prroSchema,
  type NovaPoshtaFormValues,
  type PrroFormValues,
} from "@/pages/Integrations/integrations.schema";
import { Spinner } from "@/shared/ui/spinner";
import type { Business } from "@/entities/business";

interface IIntegrationsFormManagerProps {
  business: Business;
}

const carrierOptions = [
  { value: "nova_poshta", label: "Nova Poshta" },
  { value: "ukrposhta", label: "Ukrposhta" },
  { value: "meest", label: "Meest" },
  { value: "rozetka", label: "Rozetka" },
  { value: "sat", label: "SAT" },
  { value: "delivery_group", label: "Delivery Group" },
];

const IntegrationsFormManager = ({
  business,
}: IIntegrationsFormManagerProps) => {
  const {
    connectNovaPoshta,
    connectPrro,
    updateBusinessSettings,
    integrations,
    isLoading,
  } = useBusinessIntegrations(business.id);

  const novaPoshtaForm = useForm<NovaPoshtaFormValues>({
    resolver: zodResolver(novaPoshtaSchema),
  });

  const prroForm = useForm<PrroFormValues>({
    resolver: zodResolver(prroSchema),
  });

  const onNovaPoshtaSubmit = (data: NovaPoshtaFormValues) => {
    connectNovaPoshta.mutate({
      apiKey: data.apiKey,
      businessId: business.id,
    });
  };

  const onPrroSubmit = (data: PrroFormValues) => {
    connectPrro.mutate({
      token: data.token,
      businessId: business.id,
    });
  };

  useEffect(() => {
    if (integrations) {
      const np = integrations.find((i) => i.type === "nova-poshta");
      novaPoshtaForm.reset({ apiKey: np?.apiKey || "" });
      const prro = integrations.find((i) => i.type === "prro");
      prroForm.reset({ token: prro?.apiKey || "" });
    }
  }, [integrations, novaPoshtaForm, prroForm]);

  if (isLoading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Default Carrier</Label>
        <select
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={business.defaultCarrier || "nova_poshta"}
          onChange={(event) => {
            const nextCarrier = event.target.value;
            updateBusinessSettings.mutate({
              businessId: business.id,
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
      <form
        onSubmit={novaPoshtaForm.handleSubmit(onNovaPoshtaSubmit)}
        className="space-y-4"
      >
        <Label>Nova Poshta API Key</Label>
        <Input
          {...novaPoshtaForm.register("apiKey")}
          placeholder="Enter API key"
        />
        <Button type="submit" disabled={connectNovaPoshta.isPending}>
          Save Nova Poshta
        </Button>
      </form>
      <form
        onSubmit={prroForm.handleSubmit(onPrroSubmit)}
        className="space-y-4"
      >
        <Label>PRRO Token/Password</Label>
        <Input
          type="password"
          {...prroForm.register("token")}
          placeholder="Enter token or password"
        />
        <Button type="submit" disabled={connectPrro.isPending}>
          Save PRRO
        </Button>
      </form>
    </div>
  );
};

export default IntegrationsFormManager;
