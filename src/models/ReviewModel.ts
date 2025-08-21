import { Model, model, Schema, Types } from "mongoose";
export interface IReviewInterface extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  desc: string;
  rating: string;
}
const ReviewSchema = new Schema<IReviewInterface>(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    productId: { type: Schema.Types.ObjectId, required: true },
    desc: { type: String, required: true },
    rating: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Review: Model<IReviewInterface> = model<IReviewInterface>(
  "reviews",
  ReviewSchema
);

export default Review;
