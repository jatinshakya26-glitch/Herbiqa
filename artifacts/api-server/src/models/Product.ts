import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    imageUrl: { type: String, default: "" },
    category: { type: String, default: "general" },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 100 },
  },
  { timestamps: true },
);

export type ProductDoc = InferSchemaType<typeof productSchema> & { _id: mongoose.Types.ObjectId };

export const Product: Model<ProductDoc> =
  (mongoose.models["Product"] as Model<ProductDoc>) ||
  mongoose.model<ProductDoc>("Product", productSchema);
