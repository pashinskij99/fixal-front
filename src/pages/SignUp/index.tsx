import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpForm";
import { sessionModel } from "@/entities/session";

export default function SignUpPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionModel.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  return <SignUpForm />;
}
