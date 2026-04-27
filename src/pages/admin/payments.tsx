import { useEffect, useState } from "react";
import { AdminLayout } from "./layout";
import { api, formatINR } from "@/lib/api";

interface Payment {
  orderId: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  paidAt?: string;
  method: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .adminPayments()
      .then(setPayments)
      .catch((e) => setError(e?.message ?? "Failed to load payments"));
  }, []);

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl text-primary mb-2">Payments</h1>
      <p className="text-foreground/60 text-sm mb-8">
        Successful Razorpay charges associated with orders.
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
              <th className="text-left px-5 py-3">Razorpay Payment</th>
              <th className="text-left px-5 py-3">Order</th>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-right px-5 py-3">Amount</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Paid at</th>
            </tr>
          </thead>
          <tbody>
            {(payments ?? []).map((p) => (
              <tr key={p.razorpayPaymentId} className="border-t border-border/60">
                <td className="px-5 py-3 font-mono text-xs">
                  {p.razorpayPaymentId}
                </td>
                <td className="px-5 py-3 font-mono text-xs">
                  #{p.orderId.slice(-8).toUpperCase()}
                </td>
                <td className="px-5 py-3">{p.userEmail}</td>
                <td className="px-5 py-3 text-right">{formatINR(p.amount)}</td>
                <td className="px-5 py-3 capitalize">{p.status}</td>
                <td className="px-5 py-3 text-right text-foreground/60">
                  {p.paidAt ? new Date(p.paidAt).toLocaleString() : "—"}
                </td>
              </tr>
            ))}
            {payments && payments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-foreground/50">
                  No payments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
