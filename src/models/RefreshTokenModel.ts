import { Document, Model, model, Schema, Types } from "mongoose";

export interface IRefreshTokenInterface extends Document {
  userId: Types.ObjectId;
  tokenHash: string;
  tokenType: "refresh";
  expiresAt: Date;
}

const tokenSchema = new Schema<IRefreshTokenInterface>({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  tokenHash: { type: String, required: true },
  tokenType: { type: String, enum: ["refresh"], default: "refresh" },
  expiresAt: { type: Date, required: true },
});

const TokenModel: Model<IRefreshTokenInterface> = model<IRefreshTokenInterface>(
  "tokens",
  tokenSchema
);

export default TokenModel;
