import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, default: "" },
  },
  { _id: false },
);

const shippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "India" },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    shippingAddress: { type: shippingAddressSchema, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
    },
    payment: {
      razorpayOrderId: { type: String, default: "" },
      razorpayPaymentId: { type: String, default: "" },
      razorpaySignature: { type: String, default: "" },
      paidAt: { type: Date },
      method: { type: String, default: "" },
      amount: { type: Number, default: 0 },
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export type OrderDoc = InferSchemaType<typeof orderSchema> & { _id: mongoose.Types.ObjectId };

export const Order: Model<OrderDoc> =
  (mongoose.models["Order"] as Model<OrderDoc>) ||
  mongoose.model<OrderDoc>("Order", orderSchema);
