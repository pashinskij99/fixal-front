import { useNavigate, useMatch } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { useBusinesses } from "@/entities/business";

export function BusinessSwitcher() {
  const navigate = useNavigate();
  const match = useMatch("/:businessId/*");
  const businessId = match?.params.businessId;

  const { data: businesses } = useBusinesses({});

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
