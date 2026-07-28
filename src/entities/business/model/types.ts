import type { CreateDeliveryFormValues } from "@/pages/Deliveries/delivery.schema";

export interface Business {
  id: number;
  legalName: string;
  publicName?: string;
  taxId: string;
  defaultCarrier?: CreateDeliveryFormValues["carrier"] | null;
}
