import mongoose, { Model, Schema } from "mongoose";

export interface IOtpInterface {
  otp: string;
  expiresAt: Date;
}
export interface IUserInterface extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  otp: IOtpInterface;
}
const OtpSchema = new Schema<IOtpInterface>(
  {
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema<IUserInterface>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: OtpSchema, default: Object },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const User: Model<IUserInterface> = mongoose.model("users", UserSchema);

export default User;
