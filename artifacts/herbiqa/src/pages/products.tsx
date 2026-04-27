import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { api, formatINR, type Product } from "@/lib/api";
import { useCart } from "@/lib/cart";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { add } = useCart();
  const [added, setAdded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api
      .listProducts()
      .then(setProducts)
      .catch((err) => setError(err?.message ?? "Failed to load products"));
  }, []);

  function handleAdd(p: Product) {
    add(p, 1);
    setAdded((s) => ({ ...s, [p.id]: true }));
    setTimeout(() => setAdded((s) => ({ ...s, [p.id]: false })), 1200);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <main className="flex-1 px-8 pt-8 pb-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <span className="text-xs font-medium tracking-widest uppercase text-primary/70 mb-4 block">
              Apothecary
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-primary mb-4">
              All Products
            </h1>
            <p className="text-foreground/70 text-lg">
              Hand-blended Ayurvedic essentials — sourced from small farms,
              traditionally prepared, gently priced.
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {!products && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-card border border-card-border rounded-2xl animate-pulse"
                />
              ))}
            </div>
          )}

          {products && products.length === 0 && (
            <p className="text-foreground/60">No products yet.</p>
          )}

          {products && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-card border border-card-border rounded-2xl overflow-hidden flex flex-col group"
                >
                  <Link
                    href={`/products/${p.slug}`}
                    className="block aspect-[4/3] overflow-hidden bg-background relative"
                  >
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs font-medium tracking-widest uppercase text-primary/70 mb-2 block">
                      {p.category}
                    </span>
                    <Link href={`/products/${p.slug}`}>
                      <h3 className="font-serif text-xl text-foreground mb-2 hover:text-primary transition-colors">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-foreground/70 mb-6 flex-1">
                      {p.shortDescription || p.description.slice(0, 90) + "…"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-foreground">
                        {formatINR(p.price)}
                      </span>
                      <Button
                        onClick={() => handleAdd(p)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-10 px-5 text-sm"
                      >
                        {added[p.id] ? "Added" : "Add"}
                        <ShoppingBag className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
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
