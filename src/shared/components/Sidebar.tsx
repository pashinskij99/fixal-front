import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Sidebar() {
  const { businessId } = useParams();
  const { t } = useTranslation();

  return (
    <aside className="sticky top-12 w-48 border-r p-2 h-[calc(100vh-3rem)]">
      <ul className="space-y-0.5">
        <li>
          <Link
            to={`/${businessId}/business`}
            className="text-xs hover:underline"
          >
            {t("sidebar.business")}
          </Link>
        </li>
        <li>
          <Link
            to={`/${businessId}/deliveries`}
            className="text-xs hover:underline"
          >
            {t("sidebar.deliveries")}
          </Link>
        </li>
        <li>
          <Link
            to={`/${businessId}/products`}
            className="text-xs hover:underline"
          >
            {t("sidebar.products")}
          </Link>
        </li>
      </ul>
    </aside>
  );
}
