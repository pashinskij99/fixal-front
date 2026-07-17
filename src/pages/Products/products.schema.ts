import { z } from "zod";

const requiredNumberSchema = z.preprocess(
  (value) => {
    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) {
        return Number.NaN;
      }
      return Number(trimmed);
    }

    return Number(value);
  },
  z.number().min(0, "Price cannot be negative"),
);

const optionalNumberSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "number") {
    return Number.isNaN(value) ? undefined : value;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return undefined;
    }
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}, z.number().min(0, "Option price cannot be negative").optional());

const optionSchema = z.object({
  value: z.string().min(1, "Option value is required"),
  price: optionalNumberSchema,
});

const dynamicParameterSchema = z.object({
  name: z.string().min(1, "Parameter name is required"),
  options: z.array(optionSchema).min(1, "At least one option is required"),
});

export const createProductSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    price: requiredNumberSchema,
    salePrice: z.preprocess((value) => {
      if (value === undefined || value === null || value === "") {
        return undefined;
      }
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    }, z.number().min(0, "Sale price cannot be negative").optional()),
    sku: z.string().min(1, "SKU is required"),
    photo: z
      .instanceof(File)
      .refine(
        (file) => file.type.startsWith("image/"),
        "Only image files are allowed",
      )
      .optional(),
    dynamicParameters: z.array(dynamicParameterSchema),
  })
  .refine(
    (data) => {
      if (data.salePrice !== undefined && data.salePrice >= data.price) {
        return false;
      }
      return true;
    },
    {
      message: "Sale price must be lower than original price",
      path: ["salePrice"],
    },
  );

export type CreateProductFormInput = z.input<typeof createProductSchema>;
export type CreateProductFormValues = z.output<typeof createProductSchema>;
