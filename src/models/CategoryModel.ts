import { Document, Model, model, Schema } from "mongoose";

export interface ICategoryInterface extends Document {
  categoryName: string;
  slug: string;
  categoryImage: string;
}

const categorySchema = new Schema<ICategoryInterface>(
  {
    categoryName: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    categoryImage: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CategoryModel: Model<ICategoryInterface> = model<ICategoryInterface>(
  "categories",
  categorySchema
);
export default CategoryModel;
