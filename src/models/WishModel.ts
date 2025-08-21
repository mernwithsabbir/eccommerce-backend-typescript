import { Document, Model, model, Schema, Types } from "mongoose";
export interface IWishInterface extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
}
const WishSchema = new Schema<IWishInterface>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const WishModel: Model<IWishInterface> = model<IWishInterface>(
  "wishes",
  WishSchema
);

export default WishModel;
