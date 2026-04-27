import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { api, formatINR, ApiError, type ShippingAddress } from "@/lib/api";
import { openRazorpayCheckout } from "@/lib/razorpay";

const EMPTY_ADDRESS: ShippingAddress = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export default function CartPage() {
  const { items, subtotal, setQuantity, remove, clear } = useCart();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = subtotal === 0 ? 0 : subtotal >= 999 ? 0 : 79;
  const total = subtotal + shipping;

  function update<K extends keyof ShippingAddress>(
    k: K,
    v: ShippingAddress[K],
  ) {
    setAddress((a) => ({ ...a, [k]: v }));
  }

  async function checkout() {
    setError(null);
    if (!user) {
      setLocation("/sign-in");
      return;
    }
    if (items.length === 0) return;
    if (
      !address.fullName ||
      !address.phone ||
      !address.line1 ||
      !address.city ||
      !address.state ||
      !address.postalCode
    ) {
      setError("Please fill in all required address fields.");
      return;
    }
    setBusy(true);
    try {
      const { order, razorpay } = await api.createOrder({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        shippingAddress: address,
      });

      await openRazorpayCheckout({
        key: razorpay.keyId,
        amount: razorpay.amount,
        currency: razorpay.currency,
        order_id: razorpay.orderId,
        name: "Herbiqa",
        description: `Order ${order.id.slice(-6).toUpperCase()}`,
        prefill: {
          name: user.name,
          email: user.email,
          contact: address.phone,
        },
        theme: { color: "#243d29" },
        handler: async (response) => {
          try {
            await api.verifyOrder(order.id, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            clear();
            setLocation(`/account?paid=${order.id}`);
          } catch (err) {
            setError(
              err instanceof ApiError
                ? err.message
                : "Payment verification failed",
            );
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => setBusy(false),
        },
      });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not start checkout",
      );
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 px-6 md:px-8 py-12">
        <div className="container mx-auto max-w-6xl">
          <h1 className="font-serif text-4xl text-primary mb-10">Your cart</h1>

          {items.length === 0 ? (
            <div className="bg-card border border-card-border rounded-3xl p-16 text-center">
              <p className="text-foreground/70 mb-6">Your cart is empty.</p>
              <Link href="/products">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-11">
                  Browse products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="bg-card border border-card-border rounded-2xl p-4 flex items-center gap-4"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-background shrink-0">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg text-foreground truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-foreground/70">
                        {formatINR(item.price)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setQuantity(item.productId, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full border border-border hover:bg-background inline-flex items-center justify-center"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(item.productId, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full border border-border hover:bg-background inline-flex items-center justify-center"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="w-24 text-right font-medium">
                      {formatINR(item.price * item.quantity)}
                    </div>
                    <button
                      onClick={() => remove(item.productId)}
                      className="text-foreground/50 hover:text-destructive p-2"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="bg-card border border-card-border rounded-2xl p-6">
                  <h2 className="font-serif text-xl text-primary mb-4">
                    Shipping address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Full name *"
                      value={address.fullName}
                      onChange={(v) => update("fullName", v)}
                    />
                    <Field
                      label="Phone *"
                      value={address.phone}
                      onChange={(v) => update("phone", v)}
                    />
                    <Field
                      label="Address line 1 *"
                      value={address.line1}
                      onChange={(v) => update("line1", v)}
                      className="md:col-span-2"
                    />
                    <Field
                      label="Address line 2"
                      value={address.line2 ?? ""}
                      onChange={(v) => update("line2", v)}
                      className="md:col-span-2"
                    />
                    <Field
                      label="City *"
                      value={address.city}
                      onChange={(v) => update("city", v)}
                    />
                    <Field
                      label="State *"
                      value={address.state}
                      onChange={(v) => update("state", v)}
                    />
                    <Field
                      label="Postal code *"
                      value={address.postalCode}
                      onChange={(v) => update("postalCode", v)}
                    />
                    <Field
                      label="Country"
                      value={address.country ?? "India"}
                      onChange={(v) => update("country", v)}
                    />
                  </div>
                </div>
              </div>

              <aside className="bg-card border border-card-border rounded-2xl p-6 h-fit lg:sticky lg:top-6">
                <h2 className="font-serif text-xl text-primary mb-6">Summary</h2>
                <div className="space-y-3 text-sm">
                  <Row label="Subtotal" value={formatINR(subtotal)} />
                  <Row
                    label="Shipping"
                    value={shipping === 0 ? "Free" : formatINR(shipping)}
                  />
                  <div className="border-t border-border my-3" />
                  <Row
                    label={<span className="font-medium">Total</span>}
                    value={
                      <span className="font-medium">{formatINR(total)}</span>
                    }
                  />
                </div>
                {error && (
                  <div className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}
                {!user && (
                  <p className="mt-4 text-sm text-foreground/70">
                    You'll be asked to{" "}
                    <Link href="/sign-in" className="text-primary underline">
                      sign in
                    </Link>{" "}
                    before paying.
                  </p>
                )}
                <Button
                  onClick={checkout}
                  disabled={busy || items.length === 0}
                  className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 text-sm font-medium"
                >
                  {busy ? "Processing…" : "Checkout with Razorpay"}
                </Button>
                <p className="text-xs text-foreground/50 mt-3 text-center">
                  Test mode — use card{" "}
                  <code className="text-foreground/70">4111 1111 1111 1111</code>
                  , any future expiry, any CVV.
                </p>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-widest text-foreground/60 mb-1.5 block">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
      />
    </label>
  );
}

function Row({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-foreground/80">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
