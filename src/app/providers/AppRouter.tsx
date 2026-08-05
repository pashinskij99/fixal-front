import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "@/pages/Dashboard";
import DeliveriesPage from "@/pages/Deliveries";
import CreateDeliveryPage from "@/pages/Deliveries/CreateDeliveryPage";
import IntegrationsPage from "@/pages/Integrations";
import ProductsPage from "@/pages/Products";
import CreateProductPage from "@/pages/Products/CreateProductPage";
import EditProductPage from "@/pages/Products/EditProductPage";
import SetupBusinessPage from "@/pages/SetupBusiness";
import { SignInPage } from "@/pages/sign-in";
import { DashboardLayout } from "@/shared/components/DashboardLayout";
import { MainLayout } from "@/shared/components/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import AuthProvider from "./AuthProvider";
import { SignUpPage } from "@/pages/sign-up";
import { BusinessListPage } from "@/pages/business";
import GuestRoute from "./GuestRoute";

export const AppRouterProvider = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/business" replace />} />

            <Route element={<MainLayout />}>
              <Route path="/business" element={<BusinessListPage />} />

              <Route path="/:businessId" element={<DashboardLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="deliveries" element={<DeliveriesPage />} />
                <Route
                  path="deliveries/create"
                  element={<CreateDeliveryPage />}
                />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/create" element={<CreateProductPage />} />
                <Route
                  path="products/:productId"
                  element={<EditProductPage />}
                />
                <Route
                  path="onboarding/setup-business"
                  element={<SetupBusinessPage />}
                />
                <Route
                  path="onboarding/integrations"
                  element={<IntegrationsPage />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
