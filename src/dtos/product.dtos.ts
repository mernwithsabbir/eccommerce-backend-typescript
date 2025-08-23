import * as z from "zod";

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
