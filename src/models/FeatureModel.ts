import { Document, Model, model, Schema } from "mongoose";

export interface IFeatureInterface extends Document {
  name: string;
  image: string;
  description: string;
}

const featureSchema = new Schema<IFeatureInterface>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const FeatureModel: Model<IFeatureInterface> = model<IFeatureInterface>(
  "features",
  featureSchema
);
export default FeatureModel;
