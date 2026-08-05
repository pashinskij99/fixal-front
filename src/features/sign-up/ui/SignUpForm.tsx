import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Alert, AlertDescription } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import FormContainer from "@/shared/components/FormContainer";

import { useSignUp, getErrorMessage } from "../api/useSignUp";
import { signUpSchema, type SignUpFormValues } from "../model/signup.schema";

export default function SignUpForm() {
  const { mutate, isPending, isSuccess, isError, error } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpFormValues) => {
    mutate(data);
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

      {isSuccess && (
        <Alert className="mb-6 border-emerald-500 text-emerald-600">
          <AlertDescription>
            Successfully registered! Redirecting to sign in...
          </AlertDescription>
        </Alert>
      )}

      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{getErrorMessage(error)}</AlertDescription>
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
            disabled={isPending}
            {...register("email")}
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
            disabled={isPending}
            {...register("phone")}
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
            disabled={isPending}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? "Processing..." : "Sign Up"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?
        <Link
          to="/signin"
          className="ml-1 font-semibold text-primary underline transition-opacity hover:opacity-80"
        >
          Sign in
        </Link>
      </div>
    </FormContainer>
  );
}
