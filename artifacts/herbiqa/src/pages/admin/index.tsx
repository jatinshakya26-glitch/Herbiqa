import { useEffect, useState } from "react";
import { AdminLayout } from "./layout";
import { api, formatINR } from "@/lib/api";

interface Stats {
  userCount: number;
  productCount: number;
  totalOrders: number;
  paidOrders: number;
  revenue: number;
  recentOrders: {
    id: string;
    userEmail: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .adminStats()
      .then(setStats)
      .catch((e) => setError(e?.message ?? "Failed to load stats"));
  }, []);

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl text-primary mb-2">Overview</h1>
      <p className="text-foreground/60 text-sm mb-8">
        Snapshot of your storefront activity.
      </p>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Stat
          label="Revenue"
          value={stats ? formatINR(stats.revenue) : "—"}
          tone="primary"
        />
        <Stat label="Paid orders" value={stats ? stats.paidOrders : "—"} />
        <Stat label="Total orders" value={stats ? stats.totalOrders : "—"} />
        <Stat label="Customers" value={stats ? stats.userCount : "—"} />
      </div>

      <h2 className="font-serif text-xl text-primary mb-4">Recent orders</h2>
      <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/60 text-foreground/60 text-xs uppercase tracking-widest">
            <tr>
              <th className="text-left px-5 py-3">Order</th>
              <th className="text-left px-5 py-3">Customer</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-right px-5 py-3">Total</th>
              <th className="text-right px-5 py-3">When</th>
            </tr>
          </thead>
          <tbody>
            {(stats?.recentOrders ?? []).map((o) => (
              <tr key={o.id} className="border-t border-border/60">
                <td className="px-5 py-3 font-mono text-xs">
                  #{o.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-5 py-3">{o.userEmail}</td>
                <td className="px-5 py-3 capitalize">{o.status}</td>
                <td className="px-5 py-3 text-right">{formatINR(o.total)}</td>
                <td className="px-5 py-3 text-right text-foreground/60">
                  {new Date(o.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {stats && stats.recentOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-foreground/50">
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

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "primary";
}) {
  return (
    <div
      className={`rounded-2xl p-5 border ${
        tone === "primary"
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card border-card-border"
      }`}
    >
      <div
        className={`text-xs uppercase tracking-widest mb-2 ${
          tone === "primary" ? "text-primary-foreground/70" : "text-foreground/60"
        }`}
      >
        {label}
      </div>
      <div className="font-serif text-2xl">{value}</div>
    </div>
  );
}
