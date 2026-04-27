import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { api, formatINR, type Order } from "@/lib/api";

const STATUS_TONE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  shipped: "bg-blue-100 text-blue-800 border-blue-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
  refunded: "bg-slate-200 text-slate-700 border-slate-300",
};

export default function AccountPage() {
  const { user, loading, signout } = useAuth();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/sign-in");
    }
  }, [user, loading, setLocation]);

  useEffect(() => {
    if (!user) return;
    api
      .myOrders()
      .then(setOrders)
      .catch((e) => setError(e?.message ?? "Failed to load orders"));
  }, [user]);

  if (!user) return null;
  const params = new URLSearchParams(window.location.search);
  const justPaid = params.get("paid");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 px-6 md:px-8 py-12">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-medium tracking-widest uppercase text-primary/70 mb-3 block">
                My account
              </span>
              <h1 className="font-serif text-4xl text-primary">
                Hello, {user.name}
              </h1>
              <p className="text-foreground/70 mt-2 text-sm">{user.email}</p>
            </div>
            <div className="flex gap-3">
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    className="border-primary/30 text-primary rounded-full"
                  >
                    Open admin panel
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                onClick={async () => {
                  await signout();
                  setLocation("/");
                }}
                className="border-border rounded-full"
              >
                Sign out
              </Button>
            </div>
          </div>

          {justPaid && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl px-5 py-4 mb-8">
              Payment received — thank you! Your order{" "}
              <strong>#{justPaid.slice(-6).toUpperCase()}</strong> is confirmed.
            </div>
          )}

          <h2 className="font-serif text-2xl text-primary mb-6">Your orders</h2>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {!orders && !error && (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-card border border-card-border rounded-2xl animate-pulse"
                />
              ))}
            </div>
          )}

          {orders && orders.length === 0 && (
            <div className="bg-card border border-card-border rounded-2xl p-10 text-center">
              <p className="text-foreground/70 mb-6">
                You haven't placed any orders yet.
              </p>
              <Link href="/products">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-11">
                  Browse products
                </Button>
              </Link>
            </div>
          )}

          {orders && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="bg-card border border-card-border rounded-2xl p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <span className="font-mono text-xs text-foreground/60">
                        #{o.id.slice(-8).toUpperCase()}
                      </span>
                      <span className="ml-3 text-sm text-foreground/70">
                        {new Date(o.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded-full border ${
                          STATUS_TONE[o.status] ?? "bg-muted text-foreground"
                        }`}
                      >
                        {o.status}
                      </span>
                      <span className="font-medium">{formatINR(o.total)}</span>
                    </div>
                  </div>
                  <div className="text-sm text-foreground/70">
                    {o.items.map((i) => `${i.name} × ${i.quantity}`).join(" • ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
