import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { MainLayout } from "@/shared/components/MainLayout";
import LandingPage from "./pages/Landing";
import SignUpPage from "./pages/SignUp";
import DashboardPage from "./pages/Dashboard";
import SetupBusinessPage from "./pages/SetupBusiness";
import IntegrationsPage from "./pages/Integrations";
import BusinessPage from "./pages/business";
import DeliveriesPage from "./pages/Deliveries";
import CreateDeliveryPage from "./pages/Deliveries/CreateDeliveryPage";
import ProductsPage from "./pages/Products";
import CreateProductPage from "./pages/Products/CreateProductPage";
import EditProductPage from "./pages/Products/EditProductPage";
import { DashboardLayout } from "@/shared/components/DashboardLayout";
import { SignInPage } from "./pages/sign-in";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />

          <Route path="/:businessId" element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="business" element={<BusinessPage />} />
            <Route path="deliveries" element={<DeliveriesPage />} />
            <Route path="deliveries/create" element={<CreateDeliveryPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/create" element={<CreateProductPage />} />
            <Route path="products/:productId" element={<EditProductPage />} />
          </Route>

          <Route
            path="/onboarding/setup-business"
            element={<SetupBusinessPage />}
          />
          <Route
            path="/onboarding/integrations"
            element={<IntegrationsPage />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
