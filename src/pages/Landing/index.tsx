import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../api";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const navigate = useNavigate();

  const { data: businesses, isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      const response = await api.get("/onboarding/setup-business");
      return response.data;
    },
    enabled: !!localStorage.getItem("token"),
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8">Select a business</h1>
        
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
          <div className="p-8 border rounded-lg">
            <p className="mb-4 text-slate-500">No businesses found.</p>
            <Button asChild>
              <Link to="/onboarding/setup-business">Create your first business</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
