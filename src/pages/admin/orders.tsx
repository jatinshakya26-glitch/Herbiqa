import { useEffect, useState } from "react";
import { AdminLayout } from "./layout";
import { api, formatINR, type Order } from "@/lib/api";

const STATUSES: Order["status"][] = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  function load() {
    api
      .adminOrders()
      .then(setOrders)
      .catch((e) => setError(e?.message ?? "Failed to load orders"));
  }
  useEffect(load, []);

  async function changeStatus(o: Order, status: Order["status"]) {
    await api.adminUpdateOrder(o.id, { status });
    load();
  }

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl text-primary mb-2">Orders</h1>
      <p className="text-foreground/60 text-sm mb-8">
        All orders placed on the storefront.
      </p>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/60 text-foreground/60 text-xs uppercase tracking-widest">
            <tr>
              <th className="text-left px-5 py-3">Order</th>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Items</th>
              <th className="text-right px-5 py-3">Total</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">When</th>
            </tr>
          </thead>
          <tbody>
            {(orders ?? []).map((o) => (
              <Row
                key={o.id}
                o={o}
                expanded={open === o.id}
                onToggle={() => setOpen(open === o.id ? null : o.id)}
                onStatus={(s) => changeStatus(o, s)}
              />
            ))}
            {orders && orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-foreground/50">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

function Row({
  o,
  expanded,
  onToggle,
  onStatus,
}: {
  o: Order;
  expanded: boolean;
  onToggle: () => void;
  onStatus: (s: Order["status"]) => void;
}) {
  return (
    <>
      <tr
        className="border-t border-border/60 cursor-pointer hover:bg-background/40"
        onClick={onToggle}
      >
        <td className="px-5 py-3 font-mono text-xs">
          #{o.id.slice(-8).toUpperCase()}
        </td>
        <td className="px-5 py-3">{o.userEmail}</td>
        <td className="px-5 py-3">
          {o.items.reduce((s, i) => s + i.quantity, 0)} items
        </td>
        <td className="px-5 py-3 text-right">{formatINR(o.total)}</td>
        <td className="px-5 py-3">
          <select
            value={o.status}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onStatus(e.target.value as Order["status"])}
            className="bg-background border border-border rounded-lg px-2 py-1 text-xs"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </td>
        <td className="px-5 py-3 text-right text-foreground/60">
          {new Date(o.createdAt).toLocaleString()}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-background/40 border-t border-border/60">
          <td colSpan={6} className="px-5 py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs uppercase tracking-widest text-foreground/60 mb-2">
                  Items
                </h4>
                <ul className="space-y-1 text-sm">
                  {o.items.map((i, idx) => (
                    <li key={idx}>
                      {i.name} × {i.quantity} —{" "}
                      <span className="text-foreground/70">
                        {formatINR(i.price * i.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-foreground/60 mb-2">
                  Shipping address
                </h4>
                <p className="text-sm">
                  {o.shippingAddress.fullName}
                  <br />
                  {o.shippingAddress.line1}
                  {o.shippingAddress.line2
                    ? `, ${o.shippingAddress.line2}`
                    : ""}
                  <br />
                  {o.shippingAddress.city}, {o.shippingAddress.state}{" "}
                  {o.shippingAddress.postalCode}
                  <br />
                  {o.shippingAddress.country}
                  <br />
                  <span className="text-foreground/60">
                    Phone: {o.shippingAddress.phone}
                  </span>
                </p>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-xs uppercase tracking-widest text-foreground/60 mb-2">
                  Payment
                </h4>
                {o.payment.razorpayPaymentId ? (
                  <p className="text-sm font-mono">
                    {o.payment.razorpayPaymentId}{" "}
                    <span className="text-foreground/60">
                      ({o.payment.method || "razorpay"})
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-foreground/60">Not paid yet.</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
