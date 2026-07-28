import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Table, TableBody, TableHeader } from "@/shared/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  novaPoshtaSchema,
  type NovaPoshtaFormValues,
  prroSchema,
  type PrroFormValues,
} from "../Integrations/integrations.schema";
import { Spinner } from "@/shared/ui/spinner";
import {
  BusinessHeaderRow,
  BusinessRow,
  useBusinesses,
  type Business,
} from "@/entities/business";
import { useBusinessIntegrations } from "@/features/manage-integrations";

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

  const { data: businesses, isLoading: isBusinessesLoading } = useBusinesses(
    {},
  );
  const novaPoshtaForm = useForm<NovaPoshtaFormValues>({
    resolver: zodResolver(novaPoshtaSchema),
  });

  const prroForm = useForm<PrroFormValues>({
    resolver: zodResolver(prroSchema),
  });

  const {
    integrations,
    connectNovaPoshta,
    connectPrro,
    updateBusinessSettings,
  } = useBusinessIntegrations(selectedBusiness?.id);

  const onNovaPoshtaSubmit = (data: NovaPoshtaFormValues) => {
    if (selectedBusiness) {
      connectNovaPoshta.mutate({
        apiKey: data.apiKey,
        businessId: selectedBusiness.id,
      });
    }
  };

  const onPrroSubmit = (data: PrroFormValues) => {
    if (selectedBusiness) {
      connectPrro.mutate({
        token: data.token,
        businessId: selectedBusiness.id,
      });
    }
  };

  useEffect(() => {
    if (selectedBusiness && integrations) {
      const np = integrations.find((i) => i.type === "nova-poshta");
      novaPoshtaForm.reset({ apiKey: np?.apiKey || "" });
      const prro = integrations.find((i) => i.type === "prro");
      prroForm.reset({ token: prro?.apiKey || "" });
    }
  }, [selectedBusiness, integrations, novaPoshtaForm, prroForm]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Your Businesses</h1>
      {isBusinessesLoading ? (
        <Spinner />
      ) : (
        <Table>
          <TableHeader>
            <BusinessHeaderRow rows={["Public Name", "Legal Name", "Tax ID"]} />
          </TableHeader>
          <TableBody>
            {businesses?.map((b) => (
              <BusinessRow
                key={b.id}
                business={b}
                onClick={() => setSelectedBusiness(b)}
              />
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
                  updateBusinessSettings.mutate({
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
