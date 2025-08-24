import * as z from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const cartValidate = z.object({
  userId: objectIdSchema,
  productId: objectIdSchema,
  color: z.string().min(1, "Product Color Is Required."),
  price: z.string().min(1, "Product Price Is Required."),
  qty: z.string().min(1, "Product Qty Is Required."),
  size: z.string().min(1, "Product Size Is Required."),
});

export type CartDto = z.infer<typeof cartValidate>;
