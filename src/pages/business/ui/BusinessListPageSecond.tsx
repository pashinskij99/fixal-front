import { useState } from "react";
import { Table, TableBody, TableHeader } from "@/shared/ui/table";
import { Spinner } from "@/shared/ui/spinner";
import {
  BusinessHeaderRow,
  BusinessRow,
  useBusinesses,
  type Business,
} from "@/entities/business";
import { BusinessIntegrationsDialog } from "@/widgets/business-integrations-dialog";

export default function BusinessListPageSecond() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null,
  );

  const { data: businesses, isLoading: isBusinessesLoading } = useBusinesses();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Your Businesses</h1>
      {isBusinessesLoading ? (
        <Spinner />
      ) : (
        <Table>
          <TableHeader>
            <BusinessHeaderRow rows={["Public Name", "Legal Name", "Tax ID"]} />
          </TableHeader>
          <TableBody>
            {businesses?.map((b) => (
              <BusinessRow
                key={b.id}
                business={b}
                onClick={() => setSelectedBusiness(b)}
              />
            ))}
          </TableBody>
        </Table>
      )}

      <BusinessIntegrationsDialog
        business={selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
      />
    </div>
  );
}
