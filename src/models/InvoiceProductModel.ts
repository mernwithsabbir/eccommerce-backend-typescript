import { Document, Model, model, Schema, Types } from "mongoose";

export interface IInvoiceProductInterface extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  invoiceId: Types.ObjectId;
  qty: string;
  price: string;
  color: string;
  size: string;
}

const invoiceProductSchema = new Schema<IInvoiceProductInterface>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
    invoiceId: { type: Schema.Types.ObjectId, required: true },
    qty: { type: String, required: true },
    price: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const InvoiceProductModel: Model<IInvoiceProductInterface> =
  model<IInvoiceProductInterface>("invoice_products", invoiceProductSchema);
export default InvoiceProductModel;
