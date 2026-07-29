import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import type { Business } from "@/entities/business";
import { IntegrationsFormManager } from "@/features/manage-integrations";

interface IBusinessIntegrationsDialogProps {
  business: Business | null;
  onClose: () => void;
}

const BusinessIntegrationsDialog = ({
  business,
  onClose,
}: IBusinessIntegrationsDialogProps) => {
  return (
    <Dialog open={!!business} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Manage Integrations: {business?.publicName || business?.legalName}
          </DialogTitle>
        </DialogHeader>

        {business && <IntegrationsFormManager business={business} />}
      </DialogContent>
    </Dialog>
  );
};

export default BusinessIntegrationsDialog;
