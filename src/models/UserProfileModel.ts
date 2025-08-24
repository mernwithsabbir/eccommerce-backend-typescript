import { Schema, Document, Model, Types, model } from "mongoose";

export interface IUserProfile extends Document {
  userId: Types.ObjectId;
  cus_add?: string;
  cus_city?: string;
  cus_country?: string;
  cus_fax?: string;
  cus_name?: string;
  cus_phone?: string;
  cus_postcode?: string;
  cus_state?: string;
  ship_add?: string;
  ship_city?: string;
  ship_country?: string;
  ship_fax?: string;
  ship_name?: string;
  ship_phone?: string;
  ship_postcode?: string;
  ship_state?: string;
}

const UserProfileSchema: Schema<IUserProfile> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    cus_add: { type: String },
    cus_city: { type: String },
    cus_country: { type: String },
    cus_fax: { type: String },
    cus_name: { type: String },
    cus_phone: { type: String },
    cus_postcode: { type: String },
    cus_state: { type: String },
    ship_add: { type: String },
    ship_city: { type: String },
    ship_country: { type: String },
    ship_fax: { type: String },
    ship_name: { type: String },
    ship_phone: { type: String },
    ship_postcode: { type: String },
    ship_state: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserProfile: Model<IUserProfile> = model<IUserProfile>(
  "profiles",
  UserProfileSchema
);

export default UserProfile;
