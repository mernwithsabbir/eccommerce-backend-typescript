import * as z from "zod";
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

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

export const profileValidate = z.object({
  userId: objectIdSchema,
  cus_add: z.string().min(1, "cus_add Is Required"),
  cus_city: z.string().min(1, "cus_city Is Required"),
  cus_country: z.string().min(1, "cus_country Is Required"),
  cus_fax: z.string().min(1, "cus_fax Is Required"),
  cus_name: z.string().min(1, "cus_name Is Required"),
  cus_phone: z.string().min(1, "cus_phone Is Required"),
  cus_postcode: z.string().min(1, "cus_postcode Is Required"),
  cus_state: z.string().min(1, "cus_state Is Required"),
  ship_add: z.string().min(1, "ship_add Is Required"),
  ship_city: z.string().min(1, "ship_city Is Required"),
  ship_country: z.string().min(1, "ship_country Is Required"),
  ship_fax: z.string().min(1, "ship_fax Is Required"),
  ship_name: z.string().min(1, "ship_name Is Required"),
  ship_phone: z.string().min(1, "ship_phone Is Required"),
  ship_postcode: z.string().min(1, "ship_postcode Is Required"),
});
export type ProfileDto = z.infer<typeof profileValidate>;
