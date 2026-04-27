import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import logo from "@assets/WhatsApp_Image_2026-04-23_at_7.59.15_AM_1777317297562.jpeg";

export default function SignIn() {
  const { signin } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await signin(email, password);
      setLocation(user.role === "admin" ? "/admin" : "/account");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-8 py-6">
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="w-10 h-10 rounded-full overflow-hidden border border-border/50 inline-flex items-center justify-center">
            <img src={logo} alt="Herbiqa" className="w-full h-full object-cover" />
          </span>
          <span className="font-serif text-xl text-primary">Herbiqa</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md bg-card border border-card-border rounded-3xl p-10 shadow-sm">
          <h1 className="font-serif text-3xl text-primary mb-2">Welcome back</h1>
          <p className="text-foreground/70 text-sm mb-8">
            Sign in to access your orders, cart, and saved rituals.
          </p>
          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-foreground/60 mb-2 block">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-foreground/60 mb-2 block">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </label>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-12 text-sm font-medium"
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="text-sm text-foreground/70 text-center mt-6">
            New to Herbiqa?{" "}
            <Link href="/sign-up" className="text-primary font-medium hover:underline">
              Create an account
            </Link>
          </p>
          <p className="text-xs text-foreground/50 text-center mt-4">
            Admin demo: <code>admin@herbiqa.com</code> / <code>Admin@123</code>
          </p>
        </div>
      </main>
    </div>
  );
}
