import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpForm";

export default function SignUpPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  return <SignUpForm />;
}
