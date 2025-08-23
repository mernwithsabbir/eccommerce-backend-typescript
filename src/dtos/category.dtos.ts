import * as z from "zod";

export const categoryValidate = z.object({
  categoryName: z.string().min(1, "Category Name Is Required."),
  categoryImage: z.custom<Express.Multer.File>(
    (file) => file !== undefined,
    "Category Image Is Required."
  ),
});

export type CategoryDto = z.infer<typeof categoryValidate>;
