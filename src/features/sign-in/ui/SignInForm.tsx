import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInFormValues } from "../model/signin.schema";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import FormContainer from "@/shared/components/FormContainer";
import axios from "axios";
import { useSignIn } from "../api/useSignIn";

export default function SignInForm() {
  const { mutate, isPending, error } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFormValues) => {
    mutate(data);
  };

  const errorMessage = axios.isAxiosError(error)
    ? error.response?.data?.message || "Something went wrong"
    : null;

  return (
    <FormContainer>
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-foreground">Welcome Back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please enter your details to sign in.
        </p>
      </div>

      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{errorMessage}</AlertDescription>
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
            disabled={isPending}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.75 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/10 disabled:opacity-50"
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
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
            disabled={isPending}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.75 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-3 focus:ring-primary/10 disabled:opacity-50"
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? "Processing..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?
        <Link
          to="/signup"
          className="ml-1 font-semibold text-primary underline transition-opacity hover:opacity-80"
        >
          Sign up
        </Link>
      </div>
    </FormContainer>
  );
}
