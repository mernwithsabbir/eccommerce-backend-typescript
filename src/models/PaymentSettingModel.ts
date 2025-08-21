import { Document, Model, model, Schema } from "mongoose";

export interface IPaymentSettingInterface extends Document {
  store_id: string;
  store_passwd: string;
  currency: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipl_url: string;
  init_url: string;
}

const paymentSettingSchema = new Schema<IPaymentSettingInterface>(
  {
    store_id: { type: String, required: true },
    store_passwd: { type: String, required: true },
    currency: { type: String, required: true },
    success_url: { type: String, required: true },
    fail_url: { type: String, required: true },
    cancel_url: { type: String, required: true },
    ipl_url: { type: String, required: true },
    init_url: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const PaymentSettingModel: Model<IPaymentSettingInterface> =
  model<IPaymentSettingInterface>("payment_settings", paymentSettingSchema);
export default PaymentSettingModel;
