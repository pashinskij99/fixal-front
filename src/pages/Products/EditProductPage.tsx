import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../../shared/api/api";
import {
  type CreateProductFormInput,
  createProductSchema,
  type CreateProductFormValues,
} from "./products.schema";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

type BackendProduct = {
  id: number;
  name: string;
  price: string | number;
  salePrice?: string | number | null;
  sku: string;
  photoUrl: string | null;
  dynamicParameters?: Array<{
    name: string;
    options: Array<{ value: string; price?: number }>;
  }>;
};

function EditProductSkeleton() {
  return (
    <div className="p-6">
      <Card className="max-w-4xl">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-full" />
          <div className="grid md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-8 w-28" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function EditProductPage() {
  const { businessId, productId } = useParams<{
    businessId: string;
    productId: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateProductFormInput, unknown, CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      price: 0,
      sku: "",
      dynamicParameters: [],
    },
  });

  const {
    fields: parameterFields,
    append: appendParameter,
    remove: removeParameter,
    replace: replaceParameters,
  } = useFieldArray({
    control,
    name: "dynamicParameters",
  });

  const { data: product, isLoading } = useQuery<BackendProduct>({
    queryKey: ["product", businessId, productId],
    queryFn: async () => {
      const response = await api.get(
        `/products/business/${businessId}/${productId}`,
      );
      return response.data;
    },
    enabled: !!businessId && !!productId,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const watchPhoto = watch("photo");

  useEffect(() => {
    if (watchPhoto instanceof File) {
      const objectUrl = URL.createObjectURL(watchPhoto);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (product?.photoUrl) {
      setPreviewUrl(`http://localhost:3000${product.photoUrl}`);
    } else {
      setPreviewUrl(null);
    }
  }, [watchPhoto, product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    let incomingParameters = [];
    if (product.dynamicParameters) {
      if (Array.isArray(product.dynamicParameters)) {
        incomingParameters = product.dynamicParameters;
      } else if (typeof product.dynamicParameters === "string") {
        try {
          incomingParameters = JSON.parse(product.dynamicParameters);
        } catch {
          incomingParameters = [];
        }
      }
    }

    reset({
      name: product.name,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : undefined,
      sku: product.sku,
      photo: undefined,
      dynamicParameters: incomingParameters,
    });
    replaceParameters(incomingParameters);
  }, [product, reset, replaceParameters]);

  const updateProductMutation = useMutation({
    mutationFn: async (data: CreateProductFormValues) => {
      if (!businessId || !productId) {
        throw new Error("Business id and product id are required");
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", String(data.price));
      if (data.salePrice !== undefined && data.salePrice !== null) {
        formData.append("salePrice", String(data.salePrice));
      } else {
        formData.append("salePrice", "");
      }
      formData.append("sku", data.sku);
      formData.append(
        "dynamicParameters",
        JSON.stringify(data.dynamicParameters),
      );

      if (data.photo) {
        formData.append("photo", data.photo);
      }

      const response = await api.patch(
        `/products/business/${businessId}/${productId}`,
        formData,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products", businessId] });
      queryClient.invalidateQueries({
        queryKey: ["product", businessId, productId],
      });
      navigate(`/${businessId}/products`);
    },
  });

  const onSubmit = (data: CreateProductFormValues) => {
    updateProductMutation.mutate(data);
  };

  if (isLoading) {
    return <EditProductSkeleton />;
  }

  return (
    <div className="p-6">
      <Card className="max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("products.editPage.title")}</CardTitle>
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
              <Label>{t("products.createPage.fields.image")}</Label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative h-32 w-32 rounded-lg border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-2 text-xs text-muted-foreground">
                      No photo
                    </div>
                  )}
                  {watchPhoto && (
                    <button
                      type="button"
                      onClick={() => setValue("photo", undefined)}
                      className="absolute top-1 right-1 bg-destructive/80 text-destructive-foreground hover:bg-destructive p-1 rounded-full text-xs shadow-md transition-colors flex items-center justify-center"
                      title="Remove local selection"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid gap-2 w-full">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      setValue("photo", file);
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    {watchPhoto
                      ? t("products.createPage.fields.imageSelected")
                      : product?.photoUrl
                        ? t("products.createPage.fields.imageShowing")
                        : t("products.createPage.fields.imageNone")}
                  </p>
                  {errors.photo && (
                    <p className="text-sm text-destructive font-medium">
                      {errors.photo.message}
                    </p>
                  )}
                </div>
              </div>
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

            <Button type="submit" disabled={updateProductMutation.isPending}>
              {updateProductMutation.isPending
                ? t("products.editPage.submittingButton")
                : t("products.editPage.submitButton")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
