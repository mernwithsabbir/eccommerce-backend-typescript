import { Model, model, Schema, Types } from "mongoose";
export interface IProductDetails {
  description?: string;
  colors?: string[];
  sizes?: string[];
  gallery?: string[]; // multiple gallery array
}

export interface IProductInterface extends Document {
  title: string;
  slug: string;
  shortDesc: string;
  price: string;
  discount?: boolean;
  discountPrice?: string;
  image: string;
  star?: number;
  stock: string;
  remark: string;
  categoryId: Types.ObjectId;
  brandId: Types.ObjectId;
  details: IProductDetails;
}

const ProductSchema = new Schema<IProductInterface>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDesc: { type: String, required: true },
    price: { type: String, required: true },
    discount: { type: Boolean, default: false },
    discountPrice: { type: String },
    image: { type: String, required: true },
    star: { type: Number, default: 0 },
    stock: { type: String, required: true },
    remark: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, required: true },
    brandId: { type: Schema.Types.ObjectId, required: true },
    details: {
      description: String,
      colors: [{ type: String }],
      sizes: [{ type: String }],
      gallery: [{ type: String }],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const ProductModel: Model<IProductInterface> = model<IProductInterface>(
  "products",
  ProductSchema
);

export default ProductModel;
