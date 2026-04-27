import { useEffect, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";

const NAV = [
  { path: "/admin", label: "Overview" },
  { path: "/admin/products", label: "Products" },
  { path: "/admin/orders", label: "Orders" },
  { path: "/admin/payments", label: "Payments" },
  { path: "/admin/users", label: "Users" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, signout } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setLocation("/sign-in");
    } else if (user.role !== "admin") {
      setLocation("/account");
    }
  }, [user, loading, setLocation]);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col py-8 px-6 sticky top-0 h-screen">
        <Link href="/" className="flex items-center gap-3 mb-10">
          <span className="w-10 h-10 rounded-full overflow-hidden border border-primary-foreground/20 inline-flex items-center justify-center">
            <img src="/images/herbiqa-logo.jpeg" alt="Herbiqa Logo" className="w-full h-full object-cover" />
          </span>
          <span className="font-serif text-lg">Herbiqa</span>
        </Link>
        <nav className="flex-1 space-y-1">
          {NAV.map((n) => {
            const active =
              location === n.path ||
              (n.path !== "/admin" && location.startsWith(n.path));
            return (
              <Link
                key={n.path}
                href={n.path}
                className={`block px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  active
                    ? "bg-primary-foreground text-primary font-medium"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="pt-6 border-t border-primary-foreground/15 text-xs text-primary-foreground/70">
          <div className="mb-3">
            <div className="font-medium text-primary-foreground">
              {user.name}
            </div>
            <div className="truncate">{user.email}</div>
          </div>
          <button
            onClick={async () => {
              await signout();
              setLocation("/");
            }}
            className="text-primary-foreground/80 hover:text-primary-foreground underline"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-8 md:p-10 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
