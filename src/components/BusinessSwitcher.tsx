import { useQuery } from "@tanstack/react-query";
import { useNavigate, useMatch } from "react-router-dom";
import api from "../api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Business {
  id: number;
  legalName: string;
  publicName?: string;
}

export function BusinessSwitcher() {
  const navigate = useNavigate();
  const match = useMatch("/:businessId/*");
  const businessId = match?.params.businessId;

  const { data: businesses } = useQuery<Business[]>({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await api.get("/onboarding/setup-business");
      return response.data;
    },
  });

  const activeBusiness = businesses?.find(
    (b) => b.id.toString() === businessId,
  );

  const handleBusinessChange = (value: string) => {
    navigate(`/${value}/dashboard`);
  };

  console.log({ businessId });

  return (
    <Select
      key={businessId}
      onValueChange={handleBusinessChange}
      value={businessId || ""}
    >
      <SelectTrigger className="w-[160px] h-8 text-xs">
        <SelectValue
          placeholder={
            activeBusiness
              ? activeBusiness.publicName || activeBusiness.legalName
              : "Select business"
          }
        />
      </SelectTrigger>
      <SelectContent>
        {businesses?.map((b) => (
          <SelectItem key={b.id} value={b.id.toString()} className="text-xs">
            {b.publicName || b.legalName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
