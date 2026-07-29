import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../shared/api/api";
import { Button } from "@/shared/ui/button";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/shared/ui/spinner";
import { sessionModel } from "@/entities/session";

export default function LandingPage() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const { data: businesses, isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await api.get("/onboarding/setup-business");
      return response.data;
    },
    enabled: sessionModel.isAuthenticated(),
  });

  useEffect(() => {
    const token = sessionModel.getToken();
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  if (isLoading) return <Spinner />;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8">{t("selectBusiness.title")}</h1>

        {businesses && businesses.length > 0 ? (
          <div className="grid gap-4">
            {businesses.map((b: any) => (
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
        ) : (
          <div className="p-4 border rounded-lg">
            <p className="mb-3! text-slate-500">
              {t("selectBusiness.noBusinesses")}
            </p>
            <Button asChild>
              <Link className="inline-block" to="/onboarding/setup-business">
                {t("selectBusiness.createButton")}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
