import { z } from "zod";

export const novaPoshtaSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
});

export type NovaPoshtaFormValues = z.infer<typeof novaPoshtaSchema>;

export const prroSchema = z.object({
  token: z.string().min(1, "Token/Password is required"),
});

export type PrroFormValues = z.infer<typeof prroSchema>;
