import * as z from "zod";
export const objectIdSchema = z
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
    shortDesc: z.string().min(1, "Short description is Required!"),
    price: z.string().min(1, "Price is Required!"),

    discount: z.boolean().optional().default(false),
    discountPrice: z.string().optional(),

    // Thumbnail image
    image: z
      .any()
      .refine(
        (file: Express.Multer.File) => file !== undefined,
        "Image File Is Required!"
      ),

    star: z
      .number()
      .min(0, "Star minimum 0 allowed!")
      .max(5, "Star maximum 5 allowed!")
      .default(0),

    stock: z.string().min(1, "Product Stock is Required!"),
    remark: z.string().min(1, "Product remark is Required!"),

    categoryId: objectIdSchema,
    brandId: objectIdSchema,

    // ✅ New details field
    details: z
      .object({
        description: z.string().optional(),
        colors: z.array(z.string()).optional(),
        sizes: z.array(z.string()).optional(),

        // multiple images allowed
        gallery: z
          .array(z.any())
          .optional()
          .refine(
            (files) =>
              !files ||
              (Array.isArray(files) &&
                files.every(
                  (f) => typeof f === "string" || typeof f === "object"
                )),
            "Images must be an array of file paths or Multer files"
          ),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Discount logic
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
