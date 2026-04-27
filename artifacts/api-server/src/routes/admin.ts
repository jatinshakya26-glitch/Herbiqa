import { Router, type IRouter } from "express";
import mongoose from "mongoose";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { Product } from "../models/Product";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.use("/admin", requireAdmin);

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [userCount, productCount, orderStats] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          paidOrders: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
          },
          revenue: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$total", 0] },
          },
        },
      },
    ]),
  ]);

  const stats = orderStats[0] ?? { totalOrders: 0, paidOrders: 0, revenue: 0 };

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(8);

  res.json({
    userCount,
    productCount,
    totalOrders: stats.totalOrders,
    paidOrders: stats.paidOrders,
    revenue: stats.revenue,
    recentOrders: recentOrders.map((o) => ({
      id: o._id.toString(),
      userEmail: o.userEmail,
      total: o.total,
      status: o.status,
      createdAt: (o as unknown as { createdAt?: Date }).createdAt,
    })),
  });
});

router.get("/admin/users", async (_req, res): Promise<void> => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(
    users.map((u) => ({
      id: u._id.toString(),
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: (u as unknown as { createdAt?: Date }).createdAt,
    })),
  );
});

router.patch("/admin/users/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }
  const { role } = req.body ?? {};
  if (role !== "user" && role !== "admin") {
    res.status(400).json({ error: "role must be 'user' or 'admin'" });
    return;
  }
  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

router.get("/admin/orders", async (_req, res): Promise<void> => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(
    orders.map((o) => ({
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
    })),
  );
});

router.patch("/admin/orders/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid order id" });
    return;
  }
  const { status, notes } = req.body ?? {};
  const update: Record<string, unknown> = {};
  if (
    typeof status === "string" &&
    ["pending", "paid", "shipped", "delivered", "cancelled", "refunded"].includes(
      status,
    )
  ) {
    update["status"] = status;
  }
  if (typeof notes === "string") {
    update["notes"] = notes;
  }
  const order = await Order.findByIdAndUpdate(id, update, { new: true });
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json({
    id: order._id.toString(),
    status: order.status,
    notes: order.notes,
  });
});

router.get("/admin/payments", async (_req, res): Promise<void> => {
  const orders = await Order.find({ "payment.razorpayPaymentId": { $ne: "" } })
    .sort({ "payment.paidAt": -1 })
    .limit(200);
  res.json(
    orders.map((o) => ({
      orderId: o._id.toString(),
      userEmail: o.userEmail,
      amount: o.total,
      currency: o.currency,
      status: o.status,
      razorpayOrderId: o.payment.razorpayOrderId,
      razorpayPaymentId: o.payment.razorpayPaymentId,
      paidAt: o.payment.paidAt,
      method: o.payment.method,
    })),
  );
});

export default router;
