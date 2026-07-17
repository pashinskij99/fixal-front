import { z } from "zod";

export const createBusinessSchema = z.object({
  legalName: z.string().min(1, "Legal name is required"),
  taxId: z.string().regex(/^\d{8,10}$/, "Tax ID must be 8 or 10 digits"),
  legalAddress: z.string().min(1, "Legal address is required"),
  taxSystem: z.enum([
    "SINGLE_TAX_GROUP_2",
    "SINGLE_TAX_GROUP_3_5",
    "SINGLE_TAX_GROUP_3_3",
    "GENERAL_SYSTEM",
  ]),
  publicName: z.string().optional(),
});

export type CreateBusinessFormValues = z.infer<typeof createBusinessSchema>;
