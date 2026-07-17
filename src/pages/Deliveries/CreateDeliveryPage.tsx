import { Controller, type Control, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../api";
import {
  type CreateDeliveryFormInput,
  createDeliverySchema,
  type CreateDeliveryFormValues,
} from "./delivery.schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const carrierOptions = [
  { value: "nova_poshta", label: "Nova Poshta" },
  { value: "ukrposhta", label: "Ukrposhta" },
  { value: "rozetka", label: "Rozetka" },
  { value: "meest", label: "Meest" },
  { value: "sat", label: "SAT" },
  { value: "delivery_group", label: "Delivery Group" },
];

const deliveryMethodOptions = [
  { value: "warehouse", label: "Warehouse" },
  { value: "postomat", label: "Postomat" },
  { value: "courier", label: "Courier" },
];

const paymentTypeOptions = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "postpaid", label: "Postpaid" },
  { value: "iban", label: "IBAN" },
];

const payerTypeOptions = [
  { value: "sender", label: "Sender" },
  { value: "recipient", label: "Recipient" },
];

type Business = {
  id: number;
  defaultCarrier?: CreateDeliveryFormValues["carrier"] | null;
};

export default function CreateDeliveryPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateDeliveryFormInput, unknown, CreateDeliveryFormValues>({
    resolver: zodResolver(createDeliverySchema),
    defaultValues: {
      currency: "UAH",
      paymentType: "cash",
      carrier: "nova_poshta",
      deliveryMethod: "warehouse",
      seatsCount: 1,
      payerType: "recipient",
      carrierMetadata: {},
    },
  });

  const carrier = useWatch({ control, name: "carrier" });

  const { data: businesses } = useQuery<Business[]>({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await api.get("/onboarding/setup-business");
      return response.data;
    },
    enabled: !!businessId,
  });

  const currentBusiness = businesses?.find(
    (business) => String(business.id) === businessId,
  );

  useEffect(() => {
    if (currentBusiness?.defaultCarrier) {
      setValue("carrier", currentBusiness.defaultCarrier);
    }
  }, [currentBusiness?.defaultCarrier, setValue]);

  const createDeliveryMutation = useMutation({
    mutationFn: async (data: CreateDeliveryFormValues) => {
      if (!businessId) {
        throw new Error("Business id is required");
      }

      const response = await api.post(
        `/deliveries/business/${businessId}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries", businessId] });
      navigate(`/${businessId}/deliveries`);
    },
  });

  const onSubmit = (data: CreateDeliveryFormValues) => {
    createDeliveryMutation.mutate({
      ...data,
      recipientEmail: data.recipientEmail || undefined,
    });
  };

  return (
    <div className="p-6">
      <Card className="max-w-5xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("deliveries.createPage.title")}</CardTitle>
          {businessId && (
            <Button variant="outline" asChild>
              <Link to={`/${businessId}/deliveries`}>
                {t("deliveries.backButton")}
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Field
                label={t("deliveries.createPage.fields.orderNumber")}
                error={errors.orderNumber?.message}
              >
                <Input {...register("orderNumber")} placeholder={t("deliveries.createPage.placeholders.orderNumber")} />
              </Field>
              <Field label={t("deliveries.createPage.fields.totalAmount")} error={errors.totalAmount?.message}>
                <Input type="number" step="0.01" {...register("totalAmount")} />
              </Field>
              <Field label={t("deliveries.createPage.fields.currency")} error={errors.currency?.message}>
                <Input {...register("currency")} placeholder="UAH" />
              </Field>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Field
                label={t("deliveries.createPage.fields.recipientName")}
                error={errors.recipientName?.message}
              >
                <Input {...register("recipientName")} placeholder={t("deliveries.createPage.placeholders.recipientName")} />
              </Field>
              <Field
                label={t("deliveries.createPage.fields.recipientPhone")}
                error={errors.recipientPhone?.message}
              >
                <Input {...register("recipientPhone")} placeholder={t("deliveries.createPage.placeholders.recipientPhone")} />
              </Field>
              <Field
                label={t("deliveries.createPage.fields.recipientEmail")}
                error={errors.recipientEmail?.message}
              >
                <Input
                  {...register("recipientEmail")}
                  placeholder={t("deliveries.createPage.placeholders.recipientEmail")}
                />
              </Field>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <SelectField
                control={control}
                name="paymentType"
                label={t("deliveries.createPage.fields.paymentType")}
                options={paymentTypeOptions}
                error={errors.paymentType?.message}
              />
              <SelectField
                control={control}
                name="payerType"
                label={t("deliveries.createPage.fields.payerType")}
                options={payerTypeOptions}
                error={errors.payerType?.message}
              />
              <SelectField
                control={control}
                name="deliveryMethod"
                label={t("deliveries.createPage.fields.deliveryMethod")}
                options={deliveryMethodOptions}
                error={errors.deliveryMethod?.message}
              />
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <Field label={t("deliveries.createPage.fields.weight")} error={errors.weight?.message}>
                <Input type="number" step="0.01" {...register("weight")} />
              </Field>
              <Field label={t("deliveries.createPage.fields.volume")} error={errors.volume?.message}>
                <Input type="number" step="0.0001" {...register("volume")} />
              </Field>
              <Field label={t("deliveries.createPage.fields.seatsCount")} error={errors.seatsCount?.message}>
                <Input type="number" {...register("seatsCount")} />
              </Field>
              <Field
                label={t("deliveries.createPage.fields.declaredValue")}
                error={errors.declaredValue?.message}
              >
                <Input
                  type="number"
                  step="0.01"
                  {...register("declaredValue")}
                />
              </Field>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Field label={t("deliveries.createPage.fields.codAmount")} error={errors.codAmount?.message}>
                <Input type="number" step="0.01" {...register("codAmount")} />
              </Field>
              <Field label={t("deliveries.createPage.fields.shippingCost")} error={errors.shippingCost?.message}>
                <Input
                  type="number"
                  step="0.01"
                  {...register("shippingCost")}
                />
              </Field>
              <Field
                label={t("deliveries.createPage.fields.formattedAddress")}
                error={errors.formattedAddress?.message}
              >
                <Input
                  {...register("formattedAddress")}
                  placeholder={t("deliveries.createPage.placeholders.formattedAddress")}
                />
              </Field>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("deliveries.createPage.sections.carrierMetadata")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={carrier}
                  onValueChange={(value) =>
                    setValue(
                      "carrier",
                      value as CreateDeliveryFormValues["carrier"],
                    )
                  }
                >
                  <TabsList>
                    {carrierOptions.map((option) => (
                      <TabsTrigger key={option.value} value={option.value}>
                        {t(`deliveries.createPage.carrierMetadata.${option.value}.tab`)}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="nova_poshta">
                    <div className="grid md:grid-cols-3 gap-4">
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.nova_poshta.cityRef")}
                      error={errors.carrierMetadata?.cityRef?.message}
                    >
                      <Input {...register("carrierMetadata.cityRef")} />
                    </Field>
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.nova_poshta.warehouseRef")}
                      error={errors.carrierMetadata?.warehouseRef?.message}
                    >
                      <Input {...register("carrierMetadata.warehouseRef")} />
                    </Field>
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.nova_poshta.serviceType")}
                      error={errors.carrierMetadata?.serviceType?.message}
                    >
                      <Input
                        {...register("carrierMetadata.serviceType")}
                        placeholder={t("deliveries.createPage.placeholders.serviceType")}
                      />
                    </Field>
                    </div>
                  </TabsContent>

                  <TabsContent value="ukrposhta">
                    <div className="grid md:grid-cols-4 gap-4">
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.ukrposhta.postcode")}
                      error={errors.carrierMetadata?.postcode?.message}
                    >
                      <Input {...register("carrierMetadata.postcode")} />
                    </Field>
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.ukrposhta.regionId")}
                      error={errors.carrierMetadata?.regionId?.message}
                    >
                      <Input {...register("carrierMetadata.regionId")} />
                    </Field>
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.ukrposhta.districtId")}
                      error={errors.carrierMetadata?.districtId?.message}
                    >
                      <Input {...register("carrierMetadata.districtId")} />
                    </Field>
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.ukrposhta.cityId")}
                      error={errors.carrierMetadata?.cityId?.message}
                    >
                      <Input {...register("carrierMetadata.cityId")} />
                    </Field>
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.ukrposhta.streetId")}
                      error={errors.carrierMetadata?.streetId?.message}
                    >
                      <Input {...register("carrierMetadata.streetId")} />
                    </Field>
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.ukrposhta.house")}
                      error={errors.carrierMetadata?.house?.message}
                    >
                      <Input {...register("carrierMetadata.house")} />
                    </Field>
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.ukrposhta.apartment")}
                      error={errors.carrierMetadata?.apartment?.message}
                    >
                      <Input {...register("carrierMetadata.apartment")} />
                    </Field>
                    </div>
                  </TabsContent>

                  <TabsContent value="rozetka">
                    <div className="grid md:grid-cols-2 gap-4">
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.rozetka.rozetkaPointId")}
                      error={errors.carrierMetadata?.rozetkaPointId?.message}
                    >
                      <Input {...register("carrierMetadata.rozetkaPointId")} />
                    </Field>
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.rozetka.cityId")}
                      error={errors.carrierMetadata?.cityId?.message}
                    >
                      <Input {...register("carrierMetadata.cityId")} />
                    </Field>
                    </div>
                  </TabsContent>

                  <TabsContent value="sat">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Field
                        label={t("deliveries.createPage.carrierMetadata.sat.cargoType")}
                        error={errors.carrierMetadata?.cargoType?.message}
                      >
                        <Input
                          {...register("carrierMetadata.cargoType")}
                          placeholder={t("deliveries.createPage.placeholders.cargoType")}
                        />
                      </Field>
                      <Field
                        label={t("deliveries.createPage.carrierMetadata.sat.departureWarehouseId")}
                        error={
                          errors.carrierMetadata?.departureWarehouseId?.message
                        }
                      >
                        <Input
                          {...register("carrierMetadata.departureWarehouseId")}
                        />
                      </Field>
                      <Field
                        label={t("deliveries.createPage.carrierMetadata.sat.arrivalWarehouseId")}
                        error={
                          errors.carrierMetadata?.arrivalWarehouseId?.message
                        }
                      >
                        <Input
                          {...register("carrierMetadata.arrivalWarehouseId")}
                        />
                      </Field>
                      <Field
                        label={t("deliveries.createPage.carrierMetadata.sat.length")}
                        error={errors.carrierMetadata?.length?.message}
                      >
                        <Input
                          type="number"
                          step="0.01"
                          {...register("carrierMetadata.length")}
                        />
                      </Field>
                      <Field
                        label={t("deliveries.createPage.carrierMetadata.sat.width")}
                        error={errors.carrierMetadata?.width?.message}
                      >
                        <Input
                          type="number"
                          step="0.01"
                          {...register("carrierMetadata.width")}
                        />
                      </Field>
                      <Field
                        label={t("deliveries.createPage.carrierMetadata.sat.height")}
                        error={errors.carrierMetadata?.height?.message}
                      >
                        <Input
                          type="number"
                          step="0.01"
                          {...register("carrierMetadata.height")}
                        />
                      </Field>
                    </div>
                  </TabsContent>

                  <TabsContent value="delivery_group">
                    <div className="grid md:grid-cols-3 gap-4">
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.delivery_group.cargoType")}
                      error={errors.carrierMetadata?.cargoType?.message}
                    >
                      <Input
                        {...register("carrierMetadata.cargoType")}
                        placeholder={t("deliveries.createPage.placeholders.cargoType")}
                      />
                    </Field>
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.delivery_group.departureWarehouseId")}
                      error={
                        errors.carrierMetadata?.departureWarehouseId?.message
                      }
                    >
                      <Input
                        {...register("carrierMetadata.departureWarehouseId")}
                      />
                    </Field>
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.delivery_group.arrivalWarehouseId")}
                      error={
                        errors.carrierMetadata?.arrivalWarehouseId?.message
                      }
                    >
                      <Input
                        {...register("carrierMetadata.arrivalWarehouseId")}
                      />
                    </Field>
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.delivery_group.length")}
                      error={errors.carrierMetadata?.length?.message}
                    >
                      <Input
                        type="number"
                        step="0.01"
                        {...register("carrierMetadata.length")}
                      />
                    </Field>
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.delivery_group.width")}
                      error={errors.carrierMetadata?.width?.message}
                    >
                      <Input
                        type="number"
                        step="0.01"
                        {...register("carrierMetadata.width")}
                      />
                    </Field>
                    <Field
                      label={t("deliveries.createPage.carrierMetadata.delivery_group.height")}
                      error={errors.carrierMetadata?.height?.message}
                    >
                      <Input
                        type="number"
                        step="0.01"
                        {...register("carrierMetadata.height")}
                      />
                    </Field>
                    </div>
                  </TabsContent>

                  <TabsContent value="meest">
                    <p className="text-sm text-muted-foreground">
                      {t("deliveries.createPage.carrierMetadata.meest.hint")}
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Button type="submit" disabled={createDeliveryMutation.isPending}>
              {createDeliveryMutation.isPending
                ? t("deliveries.createPage.submittingButton")
                : t("deliveries.createPage.submitButton")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

type SelectFieldProps = {
  control: Control<CreateDeliveryFormInput, unknown, CreateDeliveryFormValues>;
  name: keyof CreateDeliveryFormValues;
  label: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
};

function SelectField({
  control,
  name,
  label,
  options,
  error,
}: SelectFieldProps) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Controller
        control={control}
        name={name as never}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
