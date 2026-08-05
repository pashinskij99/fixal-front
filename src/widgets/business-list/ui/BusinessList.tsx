import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { useBusinesses, type Business } from "@/entities/business";

export const BusinessList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: businesses, isLoading } = useBusinesses();

  if (isLoading) return <Spinner />;

  if (businesses && businesses.length > 0) {
    return (
      <div className="grid gap-4">
        {businesses.map((b: Business) => (
          <Button
            key={b.id}
            variant="outline"
            onClick={() => navigate(`/${b.id}/dashboard`)}
            className="w-full justify-start p-6 text-lg"
          >
            {b.publicName || b.legalName}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <p className="mb-3! text-slate-500">{t("selectBusiness.noBusinesses")}</p>
      <Button asChild>
        <Link className="inline-block" to="/onboarding/setup-business">
          {t("selectBusiness.createButton")}
        </Link>
      </Button>
    </div>
  );
};
