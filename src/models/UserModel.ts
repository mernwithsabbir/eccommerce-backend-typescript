import mongoose, { Model, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";
export interface IOtpInterface {
  otp: string;
  expiresAt: Date;
}
export interface IUserInterface extends Document {
  _id?: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  provider: "local" | "google" | "facebook";
  providerId: string;
  role: "user" | "admin";
  otp: IOtpInterface;
  isVerified: boolean;
  comparePassword(password: string): Promise<boolean>;
}
const OtpSchema = new Schema<IOtpInterface>(
  {
    otp: { type: String },
    expiresAt: { type: Date },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema<IUserInterface>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true, select: false },
    provider: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    providerId: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    otp: { type: OtpSchema, default: {} },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};
const UserModel: Model<IUserInterface> = mongoose.model("users", userSchema);

export default UserModel;
