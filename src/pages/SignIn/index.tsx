import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  return <SignInForm />;
}
