import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../api";
import {
  type CreateProductFormInput,
  createProductSchema,
  type CreateProductFormValues,
} from "./products.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateProductPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductFormInput, unknown, CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      price: 0,
      salePrice: undefined,
      sku: "",
      dynamicParameters: [],
    },
  });

  const {
    fields: parameterFields,
    append: appendParameter,
    remove: removeParameter,
  } = useFieldArray({
    control,
    name: "dynamicParameters",
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: CreateProductFormValues) => {
      if (!businessId) {
        throw new Error("Business id is required");
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", String(data.price));
      if (data.salePrice !== undefined && data.salePrice !== null) {
        formData.append("salePrice", String(data.salePrice));
      }
      formData.append("sku", data.sku);
      formData.append(
        "dynamicParameters",
        JSON.stringify(data.dynamicParameters),
      );

      if (data.photo) {
        formData.append("photo", data.photo);
      }

      const response = await api.post(
        `/products/business/${businessId}`,
        formData,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", businessId] });
      navigate(`/${businessId}/products`);
    },
  });

  const onSubmit = (data: CreateProductFormValues) => {
    createProductMutation.mutate(data);
  };

  return (
    <div className="p-6">
      <Card className="max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("products.createPage.title")}</CardTitle>
          {businessId && (
            <Button variant="outline" asChild>
              <Link to={`/${businessId}/products`}>
                {t("products.createPage.backButton")}
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">
                {t("products.createPage.fields.name")}
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder={t("products.createPage.fields.namePlaceholder")}
              />
              {errors.name && (
                <p className="text-sm text-destructive font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">
                  {t("products.createPage.fields.priceOriginal")}
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="salePrice">
                  {t("products.createPage.fields.priceSale")}
                </Label>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  {...register("salePrice", {
                    valueAsNumber: true,
                    setValueAs: (v) =>
                      v === "" || v === undefined ? undefined : Number(v),
                  })}
                />
                {errors.salePrice && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.salePrice.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sku">
                  {t("products.createPage.fields.sku")}
                </Label>
                <Input
                  id="sku"
                  {...register("sku")}
                  placeholder={t("products.createPage.fields.skuPlaceholder")}
                />
                {errors.sku && (
                  <p className="text-sm text-destructive font-medium">
                    {errors.sku.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="photo">
                {t("products.createPage.fields.imageOptional")}
              </Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setValue("photo", file);
                }}
              />
              {errors.photo && (
                <p className="text-sm text-destructive font-medium">
                  {errors.photo.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {t("products.createPage.parameters.title")}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendParameter({
                      name: "",
                      options: [{ value: "", price: undefined }],
                    })
                  }
                >
                  {t("products.createPage.parameters.addButton")}
                </Button>
              </div>

              {parameterFields.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("products.createPage.parameters.none")}
                </p>
              ) : (
                <div className="space-y-4">
                  {parameterFields.map((parameter, parameterIndex) => {
                    const optionsPath =
                      `dynamicParameters.${parameterIndex}.options` as const;
                    const options = watch(optionsPath) || [];

                    return (
                      <Card key={parameter.id}>
                        <CardContent className="pt-6 space-y-4">
                          <div className="flex items-end gap-3">
                            <div className="grid gap-2 flex-1">
                              <Label>
                                {t("products.createPage.parameters.nameLabel")}
                              </Label>
                              <Input
                                {...register(
                                  `dynamicParameters.${parameterIndex}.name`,
                                )}
                                placeholder={t(
                                  "products.createPage.parameters.namePlaceholder",
                                )}
                              />
                              {errors.dynamicParameters?.[parameterIndex]
                                ?.name && (
                                <p className="text-sm text-destructive font-medium">
                                  {
                                    errors.dynamicParameters[parameterIndex]
                                      ?.name?.message
                                  }
                                </p>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => removeParameter(parameterIndex)}
                            >
                              {t(
                                "products.createPage.parameters.removeParameter",
                              )}
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Label>
                              {t("products.createPage.parameters.optionsLabel")}
                            </Label>
                            {options.map((_, optionIndex) => (
                              <div
                                key={`${parameter.id}-${optionIndex}`}
                                className="grid md:grid-cols-3 gap-2"
                              >
                                <Input
                                  {...register(
                                    `dynamicParameters.${parameterIndex}.options.${optionIndex}.value`,
                                  )}
                                  placeholder={t(
                                    "products.createPage.parameters.optionValuePlaceholder",
                                  )}
                                />
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder={t(
                                    "products.createPage.parameters.optionPricePlaceholder",
                                  )}
                                  {...register(
                                    `dynamicParameters.${parameterIndex}.options.${optionIndex}.price`,
                                    { valueAsNumber: true },
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    const next = options.filter(
                                      (__, idx) => idx !== optionIndex,
                                    );
                                    setValue(optionsPath, next);
                                  }}
                                >
                                  {t(
                                    "products.createPage.parameters.removeOption",
                                  )}
                                </Button>
                              </div>
                            ))}

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setValue(optionsPath, [
                                  ...options,
                                  { value: "", price: undefined },
                                ]);
                              }}
                            >
                              {t("products.createPage.parameters.addOption")}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            <Button type="submit" disabled={createProductMutation.isPending}>
              {createProductMutation.isPending
                ? t("products.createPage.submittingButton")
                : t("products.createPage.submitButton")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
