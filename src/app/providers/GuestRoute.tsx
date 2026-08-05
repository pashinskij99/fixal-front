import { useSessionStore } from "@/entities/session";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const GuestRoute = () => {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const isInitializing = useSessionStore((state) => state.isInitializing);
  const location = useLocation();

  if (isInitializing) {
    return <div>Завантаження сесії...</div>;
  }

  if (isAuthenticated) {
    const from =
      (location.state as { from?: Location })?.from?.pathname ?? "/business";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
