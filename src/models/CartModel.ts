import { Document, Model, model, Schema, Types } from "mongoose";

export interface ICartInterface extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  color: string;
  price: string;
  qty: string;
  size: string;
}

const cartSchema = new Schema<ICartInterface>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    color: { type: String, required: true },
    price: { type: String, required: true },
    qty: { type: String, required: true },
    size: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CartModel: Model<ICartInterface> = model<ICartInterface>(
  "carts",
  cartSchema
);
export default CartModel;
