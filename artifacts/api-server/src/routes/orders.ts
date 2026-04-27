import { Router, type IRouter } from "express";
import mongoose from "mongoose";
import { Order, type OrderDoc } from "../models/Order";
import { Product } from "../models/Product";
import { requireAuth } from "../middlewares/auth";
import {
  getRazorpay,
  getRazorpayKeyId,
  verifyPaymentSignature,
} from "../lib/razorpay";

const router: IRouter = Router();

function toJSON(o: OrderDoc & { _id: mongoose.Types.ObjectId }): Record<string, unknown> {
  return {
    id: o._id.toString(),
    userId: o.userId.toString(),
    userEmail: o.userEmail,
    items: o.items,
    subtotal: o.subtotal,
    shipping: o.shipping,
    total: o.total,
    currency: o.currency,
    shippingAddress: o.shippingAddress,
    status: o.status,
    payment: o.payment,
    notes: o.notes,
    createdAt: (o as unknown as { createdAt?: Date }).createdAt,
    updatedAt: (o as unknown as { updatedAt?: Date }).updatedAt,
  };
}

interface IncomingItem {
  productId: string;
  quantity: number;
}

router.post("/orders", requireAuth, async (req, res): Promise<void> => {
  const { items, shippingAddress, notes } = req.body ?? {};
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Order must have at least one item" });
    return;
  }
  if (!shippingAddress || typeof shippingAddress !== "object") {
    res.status(400).json({ error: "Shipping address is required" });
    return;
  }

  const productIds = (items as IncomingItem[]).map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const orderItems = (items as IncomingItem[]).map((i) => {
    const p = productMap.get(i.productId);
    if (!p) throw new Error(`Product not found: ${i.productId}`);
    const quantity = Math.max(1, Math.floor(i.quantity || 1));
    return {
      productId: p._id,
      name: p.name,
      price: p.price,
      quantity,
      imageUrl: p.imageUrl,
    };
  });

  const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shipping;

  const razorpay = getRazorpay();
  const rzpOrder = await razorpay.orders.create({
    amount: Math.round(total * 100),
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  });

  const order = await Order.create({
    userId: new mongoose.Types.ObjectId(req.user!.sub),
    userEmail: req.user!.email,
    items: orderItems,
    subtotal,
    shipping,
    total,
    currency: "INR",
    shippingAddress,
    status: "pending",
    payment: {
      razorpayOrderId: rzpOrder.id,
      amount: total,
    },
    notes: typeof notes === "string" ? notes : "",
  });

  res.status(201).json({
    order: toJSON(order),
    razorpay: {
      keyId: getRazorpayKeyId(),
      orderId: rzpOrder.id,
      amount: Math.round(total * 100),
      currency: "INR",
    },
  });
});

router.post("/orders/:id/verify", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid order id" });
    return;
  }

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body ?? {};
  if (
    typeof razorpayOrderId !== "string" ||
    typeof razorpayPaymentId !== "string" ||
    typeof razorpaySignature !== "string"
  ) {
    res.status(400).json({ error: "Missing payment verification fields" });
    return;
  }

  const valid = verifyPaymentSignature({
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
    signature: razorpaySignature,
  });
  if (!valid) {
    res.status(400).json({ error: "Invalid payment signature" });
    return;
  }

  const order = await Order.findById(id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  if (order.userId.toString() !== req.user!.sub) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  order.status = "paid";
  order.payment.razorpayOrderId = razorpayOrderId;
  order.payment.razorpayPaymentId = razorpayPaymentId;
  order.payment.razorpaySignature = razorpaySignature;
  order.payment.paidAt = new Date();
  order.payment.method = "razorpay";
  await order.save();

  res.json({ order: toJSON(order) });
});

router.get("/orders/mine", requireAuth, async (req, res): Promise<void> => {
  const orders = await Order.find({
    userId: new mongoose.Types.ObjectId(req.user!.sub),
  }).sort({ createdAt: -1 });
  res.json(orders.map((o) => toJSON(o)));
});

router.get("/orders/:id", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid order id" });
    return;
  }
  const order = await Order.findById(id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  if (order.userId.toString() !== req.user!.sub && req.user!.role !== "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  res.json(toJSON(order));
});

export default router;
