import { Sidebar } from "@/widgets/sidebar";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-2">
        <Outlet />
      </main>
    </div>
  );
}
