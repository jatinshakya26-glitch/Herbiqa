import { Link, useLocation } from "wouter";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import logo from "@assets/WhatsApp_Image_2026-04-23_at_7.59.15_AM_1777317297562.jpeg";

export function NavBar() {
  const { user, signout } = useAuth();
  const { count } = useCart();
  const [, setLocation] = useLocation();

  return (
    <header className="w-full py-6 px-8 flex items-center justify-between bg-transparent relative z-50">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden shrink-0 shadow-sm border border-border/50"
        >
          <img src={logo} alt="Herbiqa Logo" className="w-full h-full object-cover" />
        </Link>
        <span className="text-foreground/80 text-sm font-medium hidden sm:block">
          Ayurvedic wellness store
        </span>
      </div>

      <div className="flex items-center gap-6 md:gap-8">
        <Link
          href="/products"
          className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors"
        >
          Products
        </Link>
        <Link
          href="/cart"
          className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors inline-flex items-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" />
          Cart{count > 0 ? ` (${count})` : ""}
        </Link>
        {user?.role === "admin" && (
          <Link
            href="/admin"
            className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors hidden md:inline"
          >
            Admin
          </Link>
        )}
        {user ? (
          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors hidden sm:inline"
            >
              {user.name.split(" ")[0]}
            </Link>
            <Button
              variant="outline"
              onClick={async () => {
                await signout();
                setLocation("/");
              }}
              className="rounded-full px-5 h-10 text-sm border-primary/30 text-primary hover:bg-primary/5 bg-transparent"
            >
              Sign out
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 h-10 text-sm font-medium shadow-sm">
              Sign in
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
