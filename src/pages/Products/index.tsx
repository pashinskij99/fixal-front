import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../../shared/api/api";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { AppPagination } from "@/shared/components/AppPagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

interface Product {
  id: number;
  name: string;
  price: string;
  salePrice: string | null;
  sku: string;
  photoUrl: string | null;
  dynamicParameters: Array<{
    name: string;
    options: Array<{ value: string; price?: number }>;
  }>;
}

export default function ProductsPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [previewImage, setPreviewImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const defaultProductImage =
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%23f3f4f6'/%3E%3Cpath d='M20 24h24v16H20z' fill='none' stroke='%239ca3af' stroke-width='3'/%3E%3Ccircle cx='26' cy='30' r='2.5' fill='%239ca3af'/%3E%3Cpath d='M22 38l8-8 6 6 4-4 2 2' fill='none' stroke='%239ca3af' stroke-width='3'/%3E%3C/svg%3E";

  const { data: paginationData, isLoading } = useQuery<{
    data: Product[];
    totalCount: number;
  }>({
    queryKey: ["products", businessId, appliedFilter, page],
    queryFn: async () => {
      const response = await api.get(`/products/business/${businessId}`, {
        params: {
          name: appliedFilter || undefined,
          page,
          limit: 10,
        },
      });
      return response.data;
    },
    enabled: !!businessId,
  });

  const products = paginationData?.data;

  const removeProductMutation = useMutation({
    mutationFn: async (productId: number) => {
      if (!businessId) {
        throw new Error("Business id is required");
      }

      await api.delete(`/products/business/${businessId}/${productId}`);
    },
    onSuccess: () => {
      setProductToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["products", businessId] });
    },
  });

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("products.title")}</CardTitle>
          {businessId && (
            <Button asChild>
              <Link to={`/${businessId}/products/create`}>
                {t("products.createButton")}
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setAppliedFilter(nameFilter.trim());
            }}
          >
            <Input
              value={nameFilter}
              onChange={(event) => setNameFilter(event.target.value)}
              placeholder={t("products.filterPlaceholder")}
            />
            <Button type="submit">{t("products.searchButton")}</Button>
          </form>

          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("products.table.image")}</TableHead>
                  <TableHead>{t("products.table.name")}</TableHead>
                  <TableHead>{t("products.table.sku")}</TableHead>
                  <TableHead>{t("products.table.price")}</TableHead>
                  <TableHead>{t("products.table.parameters")}</TableHead>
                  <TableHead className="text-right">
                    {t("products.table.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-12 w-12 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex justify-end gap-2 w-full">
                        <Skeleton className="h-7 w-7 rounded-md" />
                        <Skeleton className="h-7 w-7 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : products && products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("products.table.image")}</TableHead>
                  <TableHead>{t("products.table.name")}</TableHead>
                  <TableHead>{t("products.table.sku")}</TableHead>
                  <TableHead>{t("products.table.price")}</TableHead>
                  <TableHead>{t("products.table.parameters")}</TableHead>
                  <TableHead className="text-right">
                    {t("products.table.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => {
                          const imageSrc = product.photoUrl
                            ? `http://localhost:3000${product.photoUrl}`
                            : defaultProductImage;
                          setPreviewImage({ src: imageSrc, alt: product.name });
                        }}
                        className="rounded-md"
                      >
                        <img
                          src={
                            product.photoUrl
                              ? `http://localhost:3000${product.photoUrl}`
                              : defaultProductImage
                          }
                          alt={product.name}
                          className="h-12 w-12 rounded-md object-cover border"
                          onError={(event) => {
                            event.currentTarget.src = defaultProductImage;
                          }}
                        />
                      </button>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        {product.salePrice && (
                          <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full w-fit mt-1">
                            SALE
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>
                      {product.salePrice ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-destructive">
                            {product.salePrice}
                          </span>
                          <span className="text-xs text-muted-foreground line-through">
                            {product.price}
                          </span>
                        </div>
                      ) : (
                        <span>{product.price}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <p
                        className="max-w-64 truncate text-sm"
                        title={(() => {
                          const params =
                            typeof product.dynamicParameters === "string"
                              ? (() => {
                                  try {
                                    return JSON.parse(
                                      product.dynamicParameters,
                                    );
                                  } catch {
                                    return [];
                                  }
                                })()
                              : product.dynamicParameters;
                          return Array.isArray(params)
                            ? params
                                .flatMap(
                                  (parameter) =>
                                    parameter.options?.map(
                                      (option: { value: string }) =>
                                        option.value,
                                    ) || [],
                                )
                                .join(", ")
                            : "";
                        })()}
                      >
                        {(() => {
                          const params =
                            typeof product.dynamicParameters === "string"
                              ? (() => {
                                  try {
                                    return JSON.parse(
                                      product.dynamicParameters,
                                    );
                                  } catch {
                                    return [];
                                  }
                                })()
                              : product.dynamicParameters;
                          return (
                            (Array.isArray(params) &&
                              params
                                .flatMap(
                                  (parameter) =>
                                    parameter.options?.map(
                                      (option: { value: string }) =>
                                        option.value,
                                    ) || [],
                                )
                                .join(", ")) ||
                            "-"
                          );
                        })()}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        {businessId && (
                          <Button variant="ghost" size="icon-sm" asChild>
                            <Link to={`/${businessId}/products/${product.id}`}>
                              <Edit3 />
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setProductToDelete(product)}
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>{t("products.noProducts")}</p>
          )}

          {paginationData && paginationData.totalCount > 10 && (
            <div className="pt-4">
              <AppPagination
                currentPage={page}
                totalCount={paginationData.totalCount}
                limit={10}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!productToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setProductToDelete(null);
          }
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("products.deleteDialog.title")}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {t("products.deleteDialog.description", {
              name: productToDelete?.name,
            })}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setProductToDelete(null)}
              disabled={removeProductMutation.isPending}
            >
              {t("products.deleteDialog.close")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (productToDelete) {
                  removeProductMutation.mutate(productToDelete.id);
                }
              }}
              disabled={removeProductMutation.isPending}
            >
              {removeProductMutation.isPending
                ? t("products.deleteDialog.deleting")
                : t("products.deleteDialog.delete")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!previewImage}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewImage(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {previewImage?.alt || t("products.previewTitle")}
            </DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img
              src={previewImage.src}
              alt={previewImage.alt}
              className="w-full max-h-[70vh] rounded-md object-contain"
              onError={(event) => {
                event.currentTarget.src = defaultProductImage;
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
