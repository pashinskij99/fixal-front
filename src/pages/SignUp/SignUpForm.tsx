import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../shared/api/api";
import { signUpSchema, type SignUpFormValues } from "./signup.schema";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import FormContainer from "@/shared/components/FormContainer";
import axios from "axios";

interface AlertState {
  type: "success" | "danger";
  message: string;
}

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setAlert(null);
    setIsLoading(true);

    try {
      await api.post("/users/register", data);
      setAlert({
        type: "success",
        message: "Successfully registered! Redirecting to sign in...",
      });
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err) {
      const errorMessage = "Something went wrong";
      if (axios.isAxiosError(err)) {
        setAlert({
          type: "danger",
          message: err.response?.data?.message || errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormContainer>
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-foreground">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please enter your details to sign up.
        </p>
      </div>

      {alert && (
        <Alert
          variant={alert.type === "danger" ? "destructive" : "default"}
          className="mb-6"
        >
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
            disabled={isLoading}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.75 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/10 disabled:opacity-50"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="phone"
            className="text-sm font-medium text-foreground"
          >
            Phone
          </Label>
          <Input
            id="phone"
            placeholder="+1234567890"
            {...register("phone")}
            disabled={isLoading}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.75 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/10 disabled:opacity-50"
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            disabled={isLoading}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.75 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/10 disabled:opacity-50"
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Sign Up"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?
        <a
          href="/signin"
          className="ml-1 font-semibold text-primary underline transition-opacity hover:opacity-80"
        >
          Sign in
        </a>
      </div>
    </FormContainer>
  );
}
