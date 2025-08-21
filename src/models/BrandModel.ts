import { Document, Model, model, Schema } from "mongoose";

export interface IBrandInterface extends Document {
  brandName: string;
  slug: string;
  brandImage: string;
}

const brandSchema = new Schema<IBrandInterface>(
  {
    brandName: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    brandImage: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const BrandModel: Model<IBrandInterface> = model<IBrandInterface>(
  "brands",
  brandSchema
);
export default BrandModel;
