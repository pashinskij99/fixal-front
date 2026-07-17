import * as z from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;
