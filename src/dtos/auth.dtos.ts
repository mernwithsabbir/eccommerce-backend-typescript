import * as z from "zod";

export const registerValidate = z.object({
  firstName: z.string().min(1, "First Name Is Required"),
  lastName: z.string().min(1, "First Name Is Required"),
  email: z.string().email(),
  provider: z.enum(["local", "google", "facebook"]),
  role: z.enum(["user", "admin"]),
  password: z
    .string()
    .min(8, "Pssword Minimum * Character Required")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!-/:-@[-`{-~]/,
      "Password must contain at least one special character (!@#$%^&* etc.)"
    ),
});
export type RegisterDto = z.infer<typeof registerValidate>;

export const loginValidate = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Pssword Minimum * Character Required")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!-/:-@[-`{-~]/,
      "Password must contain at least one special character (!@#$%^&* etc.)"
    ),
});

export type LoginDto = z.infer<typeof loginValidate>;
