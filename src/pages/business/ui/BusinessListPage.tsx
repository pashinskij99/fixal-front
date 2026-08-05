import { useTranslation } from "react-i18next";
import { BusinessList } from "@/widgets/business-list";

export const BusinessListPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8">{t("selectBusiness.title")}</h1>
        <BusinessList />
      </div>
    </div>
  );
};
