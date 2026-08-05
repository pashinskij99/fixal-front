import { useParams } from "react-router-dom";
import { useSessionStore } from "@/entities/session";

export default function DashboardPage() {
  const { businessId } = useParams<{ businessId: string }>();

  const user = useSessionStore((store) => store.user);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard (Business: {businessId})</h1>
      <p>Welcome, {user?.email}!</p>
    </div>
  );
}
