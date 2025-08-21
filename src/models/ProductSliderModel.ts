import { Model, model, Schema, Types } from "mongoose";
export interface IProductSliderInterface extends Document {
  title: string;
  desc: string;
  price: string;
  image: string;
  productId: Types.ObjectId;
}
const ProductSliderSchema = new Schema<IProductSliderInterface>(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const ProductSlider: Model<IProductSliderInterface> =
  model<IProductSliderInterface>("product_sliders", ProductSliderSchema);

export default ProductSlider;
