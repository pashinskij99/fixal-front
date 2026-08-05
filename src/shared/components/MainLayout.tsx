import { Header } from "@/widgets/header";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
