import * as z from "zod";
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");
export const categoryValidate = z.object({
  categoryName: z.string().min(1, "Category Name Is Required."),
  categoryImage: z.custom<Express.Multer.File>(
    (file) => file !== undefined,
    "Category Image Is Required."
  ),
});

export type CategoryDto = z.infer<typeof categoryValidate>;

export const brandValidate = z.object({
  brandName: z.string().min(1, "Brand Name Is Required"),
  brandImage: z.custom<Express.Multer.File>(
    (file) => file !== undefined,
    "Brand Image Is Required."
  ),
});

export type BrandDto = z.infer<typeof brandValidate>;

export const productValidate = z
  .object({
    title: z.string().min(1, "Title is Required!"),
    shortDesc: z.string().min(1, "Title is Required!"),
    price: z.string().min(1, "Title is Required!"),
    discount: z.boolean().optional().default(false),
    discountPrice: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, "Discount price must be a valid number")
      .optional(),
    image: z
      .any()
      .refine(
        (file: Express.Multer.File) => file !== undefined,
        "Image File Is Required!"
      ),
    star: z
      .number("Star Is Required Number!")
      .min(0, "star is Minimum 0 Allowed!")
      .max(5, "star is Maximum 5 Allowed!")
      .default(0),
    stock: z.string().min(1, "Product Stock is Required!"),
    remark: z.string().min(1, "Product remark is Required!"),
    categoryId: objectIdSchema,
    brandId: objectIdSchema,
  })
  .superRefine((data, ctx) => {
    if (data.discount && !data.discountPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Discount price is required when discount is enabled.",
        path: ["discountPrice"],
      });
    }
    if (data.discount && data.discountPrice && data.price) {
      if (parseFloat(data.discountPrice) >= parseFloat(data.price)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Discount Price Must Be Less Then Regular Price",
          path: ["discountPrice"],
        });
      }
    }
  });

export type ProductDto = z.infer<typeof productValidate>;
