import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../shared/api/api";
import {
  createBusinessSchema,
  type CreateBusinessFormValues,
} from "./create-business.schema";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/shared/ui/spinner";

interface Business {
  id: number;
  legalName: string;
  publicName?: string;
}

const taxSystems = [
  { value: "SINGLE_TAX_GROUP_2", label: "Єдиний податок (2 група)" },
  { value: "SINGLE_TAX_GROUP_3_5", label: "Єдиний податок (3 група — 5%)" },
  {
    value: "SINGLE_TAX_GROUP_3_3",
    label: "Єдиний податок (3 група — 3% + ПДВ)",
  },
  { value: "GENERAL_SYSTEM", label: "Загальна система оподаткування" },
];

export default function SetupBusinessPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: businesses, isLoading: isLoadingBusinesses } = useQuery<
    Business[]
  >({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await api.get("/onboarding/setup-business");
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateBusinessFormValues>({
    resolver: zodResolver(createBusinessSchema),
  });

  const createBusinessMutation = useMutation({
    mutationFn: (data: CreateBusinessFormValues) =>
      api.post("/onboarding/setup-business", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      reset();
      navigate("/onboarding/integrations");
    },
  });

  const onSubmit = (data: CreateBusinessFormValues) => {
    createBusinessMutation.mutate(data);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Business Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <Label>Legal Name</Label>
              <Input
                {...register("legalName")}
                placeholder="ТОВ 'Айти Рsolutions'"
              />
              {errors.legalName && (
                <p className="text-sm text-destructive">
                  {errors.legalName.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Tax ID (ІПН/ЄДРПОУ)</Label>
              <Input {...register("taxId")} placeholder="12345678" />
              {errors.taxId && (
                <p className="text-sm text-destructive">
                  {errors.taxId.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Legal Address</Label>
              <Input
                {...register("legalAddress")}
                placeholder="вул. Хрещатик, 1"
              />
              {errors.legalAddress && (
                <p className="text-sm text-destructive">
                  {errors.legalAddress.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Tax System</Label>
              <Controller
                control={control}
                name="taxSystem"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tax system" />
                    </SelectTrigger>
                    <SelectContent>
                      {taxSystems.map((ts) => (
                        <SelectItem key={ts.value} value={ts.value}>
                          {ts.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.taxSystem && (
                <p className="text-sm text-destructive">
                  {errors.taxSystem.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Public Name (Optional)</Label>
              <Input {...register("publicName")} placeholder="SuperGadget" />
            </div>
            <Button type="submit" disabled={createBusinessMutation.isPending}>
              {createBusinessMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Businesses</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingBusinesses ? (
            <Spinner />
          ) : (
            <ul className="list-disc pl-5">
              {businesses?.map((b) => (
                <li key={b.id}>{b.publicName || b.legalName}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
