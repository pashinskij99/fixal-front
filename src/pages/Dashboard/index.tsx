import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../shared/api/api";
import { Spinner } from "@/shared/ui/spinner";
import { sessionModel } from "@/entities/session";

interface User {
  username: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { businessId } = useParams<{ businessId: string }>();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User, Error>({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get("/users/me");
      return response.data;
    },
    retry: false,
  });

  if (isLoading) return <Spinner />;
  if (error) {
    sessionModel.clearToken();
    navigate("/signin");
    return null;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard (Business: {businessId})</h1>
      <p>Welcome, {user?.username}!</p>
      <button
        onClick={() => {
          sessionModel.clearToken();
          navigate("/signin");
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
