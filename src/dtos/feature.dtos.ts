import * as z from "zod";

export const featureValidate = z.object({
  name: z.string().min(1, "Feature Name Is Required."),
  image: z.custom<Express.Multer.File>(
    (file) => file !== undefined,
    "Featured Image Is Required."
  ),
  description: z.string().min(1, "Feature Description Is Required."),
});

export type FeatureDto = z.infer<typeof featureValidate>;
