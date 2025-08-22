import { Document, Model, model, Schema, Types } from "mongoose";

export interface IRefreshTokenInterface extends Document {
  userId: Types.ObjectId;
  jti: string;
  tokenHash: string;
  tokenType: "refresh";
  expiresAt: Date;
}

const tokenSchema = new Schema<IRefreshTokenInterface>({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  jti: { type: String, required: true },
  tokenHash: { type: String, required: true },
  tokenType: { type: String, enum: ["refresh"], default: "refresh" },
  expiresAt: { type: Date, required: true },
});

tokenSchema.pre("save", async function (next) {
  try {
    const data = this as IRefreshTokenInterface;
    const now = new Date();

    await TokenModel.deleteMany({
      userId: data.userId,
      expiresAt: { $lt: now },
    });
    next();
  } catch (error) {
    next(error as never);
  }
});

const TokenModel: Model<IRefreshTokenInterface> = model<IRefreshTokenInterface>(
  "tokens",
  tokenSchema
);

export default TokenModel;
