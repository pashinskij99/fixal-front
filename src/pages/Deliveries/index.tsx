import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../shared/api/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { AppPagination } from "@/shared/components/AppPagination";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type Delivery = {
  id: string;
  carrier: string;
  deliveryMethod: string;
  trackingNumber: string | null;
  status: string;
  formattedAddress: string;
  declaredValue: string;
  createdAt: string;
  order: {
    orderNumber: string;
    recipientName: string;
    recipientPhone: string;
    totalAmount: string;
  };
};

export default function DeliveriesPage() {
  const { businessId } = useParams<{ businessId: string }>();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const statusOptions = [
    { value: "all", label: t("deliveries.filters.allStatuses") },
    { value: "draft", label: t("deliveries.statuses.draft") },
    { value: "created", label: t("deliveries.statuses.created") },
    { value: "in_transit", label: t("deliveries.statuses.in_transit") },
    { value: "arrived", label: t("deliveries.statuses.arrived") },
    { value: "picked_up", label: t("deliveries.statuses.picked_up") },
    { value: "returned", label: t("deliveries.statuses.returned") },
    { value: "cancelled", label: t("deliveries.statuses.cancelled") },
  ];

  const { data: deliveries, isLoading } = useQuery<{
    data: Delivery[];
    totalCount: number;
  }>({
    queryKey: ["deliveries", businessId, appliedSearch, status, page],
    queryFn: async () => {
      const response = await api.get(`/deliveries/business/${businessId}`, {
        params: {
          search: appliedSearch || undefined,
          status: status === "all" ? undefined : status,
          page,
          limit: 10,
        },
      });
      return response.data;
    },
    enabled: !!businessId,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t("deliveries.title")}</h1>
        {businessId && (
          <Button asChild>
            <Link to={`/${businessId}/deliveries/create`}>
              {t("deliveries.createButton")}
            </Link>
          </Button>
        )}
      </div>

      <div className="rounded-lg border p-4 shadow-sm">
        <form
          className="grid md:grid-cols-[1fr_220px_auto] gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setPage(1);
            setAppliedSearch(search.trim());
          }}
        >
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t("deliveries.filters.searchPlaceholder")}
          />
          <Select
            value={status}
            onValueChange={(value) => {
              setPage(1);
              setStatus(value);
            }}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={t("deliveries.filters.statusPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit">{t("deliveries.filters.applyButton")}</Button>
        </form>
      </div>

      {isLoading ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("deliveries.table.order")}</TableHead>
              <TableHead>{t("deliveries.table.recipient")}</TableHead>
              <TableHead>{t("deliveries.table.carrier")}</TableHead>
              <TableHead>{t("deliveries.table.status")}</TableHead>
              <TableHead>{t("deliveries.table.address")}</TableHead>
              <TableHead>{t("deliveries.table.tracking")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-36" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-44" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-28" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : deliveries && deliveries.data ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("deliveries.table.order")}</TableHead>
                <TableHead>{t("deliveries.table.recipient")}</TableHead>
                <TableHead>{t("deliveries.table.carrier")}</TableHead>
                <TableHead>{t("deliveries.table.status")}</TableHead>
                <TableHead>{t("deliveries.table.address")}</TableHead>
                <TableHead>{t("deliveries.table.tracking")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.data.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell className="text-sm font-medium">
                    {delivery.order.orderNumber}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex flex-col">
                      <span>{delivery.order.recipientName}</span>
                      <span className="text-xs text-muted-foreground">
                        {delivery.order.recipientPhone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {t(
                      `deliveries.createPage.carrierMetadata.${delivery.carrier}.tab`,
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {t(`deliveries.statuses.${delivery.status}`)}
                  </TableCell>
                  <TableCell
                    className="max-w-72 text-sm truncate"
                    title={delivery.formattedAddress}
                  >
                    {delivery.formattedAddress}
                  </TableCell>
                  <TableCell className="text-sm">
                    {delivery.trackingNumber || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {deliveries?.totalCount ? (
            <AppPagination
              currentPage={page}
              totalCount={deliveries?.totalCount || 0}
              limit={10}
              onPageChange={handlePageChange}
            />
          ) : null}
        </>
      ) : (
        businessId && <p className="text-sm">{t("deliveries.list.empty")}</p>
      )}
    </div>
  );
}
