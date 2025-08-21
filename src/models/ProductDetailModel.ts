import { Document, Model, model, Schema, Types } from "mongoose";

export interface IProductDetailInterface extends Document {
  img1: string;
  img2: string;
  img3: string;
  img4: string;
  img5?: string;
  img6?: string;
  img7?: string;
  img8?: string;
  desc: string;
  color: string;
  size: string;
  productId: Types.ObjectId;
}

const productDetailsSchema = new Schema<IProductDetailInterface>(
  {
    img1: { type: String, required: true },
    img2: { type: String, required: true },
    img3: { type: String, required: true },
    img4: { type: String, required: true },
    img5: { type: String },
    img6: { type: String },
    img7: { type: String },
    img8: { type: String },
    desc: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProductDetailModel: Model<IProductDetailInterface> =
  model<IProductDetailInterface>("product_details", productDetailsSchema);
export default ProductDetailModel;
