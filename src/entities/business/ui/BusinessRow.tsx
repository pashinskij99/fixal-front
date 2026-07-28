import { TableRow, TableCell, TableHead } from "@/shared/ui/table";
import type { Business } from "../model/types";

interface BusinessRowProps {
  business: Business;
  onClick?: () => void;
}

export const BusinessRow = ({ business, onClick }: BusinessRowProps) => {
  return (
    <TableRow onClick={onClick} className="cursor-pointer">
      <TableCell className="font-medium">
        {business.publicName || "-"}
      </TableCell>
      <TableCell>{business.legalName}</TableCell>
      <TableCell>{business.taxId}</TableCell>
    </TableRow>
  );
};

interface IBusinessHeaderRowProps {
  rows: string[];
}

export const BusinessHeaderRow = ({ rows }: IBusinessHeaderRowProps) => {
  return (
    <TableRow>
      {rows.map((row, index) => (
        <TableHead key={index}>{row}</TableHead>
      ))}
    </TableRow>
  );
};
