import { z } from "zod";

const numberField = (message: string) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === undefined || value === null) {
        return undefined;
      }

      if (typeof value === "number") {
        return value;
      }

      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    },
    z.number().min(0, message),
  );

const optionalNumberField = (message: string) =>
  z.preprocess((value) => {
    if (value === "" || value === undefined || value === null) {
      return undefined;
    }

    if (typeof value === "number") {
      return value;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, z.number().min(0, message).optional());

const carrierMetadataSchema = z.object({
  cityRef: z.string().optional(),
  warehouseRef: z.string().optional(),
  serviceType: z.string().optional(),
  postcode: z.string().optional(),
  regionId: z.string().optional(),
  districtId: z.string().optional(),
  cityId: z.string().optional(),
  streetId: z.string().optional(),
  house: z.string().optional(),
  apartment: z.string().optional(),
  rozetkaPointId: z.string().optional(),
  cargoType: z.string().optional(),
  departureWarehouseId: z.string().optional(),
  arrivalWarehouseId: z.string().optional(),
  length: optionalNumberField("Length cannot be negative"),
  width: optionalNumberField("Width cannot be negative"),
  height: optionalNumberField("Height cannot be negative"),
});

export const createDeliverySchema = z
  .object({
    orderNumber: z.string().optional(),
    totalAmount: numberField("Total amount cannot be negative"),
    currency: z.string().length(3).default("UAH"),
    paymentType: z.enum(["cash", "card", "postpaid", "iban"]),
    recipientName: z.string().min(1, "Recipient name is required"),
    recipientPhone: z.string().min(1, "Recipient phone is required"),
    recipientEmail: z
      .union([z.string().email("Invalid email"), z.literal("")])
      .optional(),
    carrier: z.enum([
      "nova_poshta",
      "ukrposhta",
      "rozetka",
      "meest",
      "sat",
      "delivery_group",
    ]),
    deliveryMethod: z.enum(["warehouse", "postomat", "courier"]),
    weight: numberField("Weight cannot be negative"),
    volume: optionalNumberField("Volume cannot be negative"),
    seatsCount: z.preprocess(
      (value) => {
        if (value === "" || value === undefined || value === null) {
          return 1;
        }
        if (typeof value === "number") {
          return value;
        }
        const parsed = Number(value);
        return Number.isNaN(parsed) ? 1 : parsed;
      },
      z.number().int().min(1, "Seats count must be at least 1"),
    ),
    declaredValue: numberField("Declared value cannot be negative"),
    codAmount: optionalNumberField("COD amount cannot be negative"),
    payerType: z.enum(["sender", "recipient"]),
    shippingCost: optionalNumberField("Shipping cost cannot be negative"),
    formattedAddress: z.string().min(1, "Formatted address is required"),
    carrierMetadata: carrierMetadataSchema,
  })
  .superRefine((data, ctx) => {
    if (data.carrier === "nova_poshta") {
      if (!data.carrierMetadata.cityRef) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "City Ref is required",
          path: ["carrierMetadata", "cityRef"],
        });
      }
      if (!data.carrierMetadata.warehouseRef) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Warehouse Ref is required",
          path: ["carrierMetadata", "warehouseRef"],
        });
      }
      if (!data.carrierMetadata.serviceType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Service Type is required",
          path: ["carrierMetadata", "serviceType"],
        });
      }
    }

    if (data.carrier === "ukrposhta") {
      [
        "postcode",
        "regionId",
        "districtId",
        "cityId",
        "streetId",
        "house",
      ].forEach((field) => {
        if (!data.carrierMetadata[field as keyof typeof data.carrierMetadata]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${field} is required`,
            path: ["carrierMetadata", field],
          });
        }
      });
    }

    if (data.carrier === "rozetka") {
      ["rozetkaPointId", "cityId"].forEach((field) => {
        if (!data.carrierMetadata[field as keyof typeof data.carrierMetadata]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${field} is required`,
            path: ["carrierMetadata", field],
          });
        }
      });
    }

    if (data.carrier === "sat" || data.carrier === "delivery_group") {
      ["cargoType", "departureWarehouseId", "arrivalWarehouseId"].forEach(
        (field) => {
          if (
            !data.carrierMetadata[field as keyof typeof data.carrierMetadata]
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${field} is required`,
              path: ["carrierMetadata", field],
            });
          }
        },
      );
      ["length", "width", "height"].forEach((field) => {
        if (!data.carrierMetadata[field as keyof typeof data.carrierMetadata]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${field} is required`,
            path: ["carrierMetadata", field],
          });
        }
      });
    }
  });

export type CreateDeliveryFormInput = z.input<typeof createDeliverySchema>;
export type CreateDeliveryFormValues = z.output<typeof createDeliverySchema>;
