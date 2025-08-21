import { Document, Model, model, Schema, Types } from "mongoose";

export interface IInvoiceInterface extends Document {
  userId: Types.ObjectId;
  payable: string;
  cus_details: string;
  ship_details: string;
  tran_id: string;
  val_id: string;
  delivery_status: string;
  payment_status: string;
  total: string;
  vat: string;
}

const invoiceSchema = new Schema<IInvoiceInterface>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    payable: { type: String, required: true },
    cus_details: { type: String, required: true },
    ship_details: { type: String, required: true },
    tran_id: { type: String, required: true },
    val_id: { type: String, required: true },
    delivery_status: { type: String, required: true },
    payment_status: { type: String, required: true },
    total: { type: String, required: true },
    vat: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const InvoiceModel: Model<IInvoiceInterface> = model<IInvoiceInterface>(
  "invoices",
  invoiceSchema
);
export default InvoiceModel;
