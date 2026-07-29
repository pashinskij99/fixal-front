import { sessionModel } from "@/entities/session";
import { SignInForm } from "@/features/sign-in";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionModel.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  return <SignInForm />;
};

export default SignInPage;
