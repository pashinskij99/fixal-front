import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../api";
import { signInSchema, type SignInFormValues } from "./signin.schema";
import { signUpSchema, type SignUpFormValues } from "../SignUp/signup.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AlertState {
  type: "success" | "danger";
  message: string;
}

interface SignInFormProps {
  isSignUp: boolean;
}

export default function SignInForm({ isSignUp }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues | SignUpFormValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
  });

  const onSubmit = async (data: SignInFormValues | SignUpFormValues) => {
    setAlert(null);
    setIsLoading(true);

    try {
      const endpoint = isSignUp ? "/users/register" : "/users/login";
      const response = await api.post(endpoint, data);

      if (isSignUp) {
        setAlert({
          type: "success",
          message: "Successfully registered! Redirecting to sign in...",
        });
        setTimeout(() => navigate("/signin"), 1500);
      } else {
        localStorage.setItem("token", response.data.access_token);
        navigate("/");
      }
    } catch (err: any) {
      setAlert({
        type: "danger",
        message: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription>
            Please enter your details to {isSignUp ? "sign up" : "sign in"}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alert && (
            <Alert
              variant={alert.type === "danger" ? "destructive" : "default"}
              className="mb-4"
            >
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            {isSignUp && (
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+1234567890"
                  {...register("phone")}
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <a
              href={isSignUp ? "/signin" : "/signup"}
              className="ml-1 underline underline-offset-4 hover:text-primary"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
