import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, formatINR, type Product } from "@/lib/api";
import { useCart } from "@/lib/cart";

export function Products() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const { add } = useCart();
  const [added, setAdded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api
      .listProducts()
      .then((items) => setProducts(items.slice(0, 3)))
      .catch(() => setProducts([]));
  }, []);

  function handleAdd(p: Product, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add(p, 1);
    setAdded((s) => ({ ...s, [p.id]: true }));
    setTimeout(() => setAdded((s) => ({ ...s, [p.id]: false })), 1200);
  }

  return (
    <section className="py-24 px-8 bg-card border-t border-border/40">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              Apothecary Staples
            </h2>
            <p className="text-foreground/70 text-lg font-sans">
              Hand-blended in small batches to ensure absolute freshness and
              potency.
            </p>
          </div>
          <Link href="/products">
            <Button
              variant="link"
              className="text-primary hover:text-primary/80 font-medium text-base p-0 h-auto group"
            >
              Shop all products{" "}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {!products && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-background border border-border/40 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                className="group"
              >
                <Link
                  href="/products"
                  className="block relative aspect-[3/4] mb-6 overflow-hidden rounded-2xl bg-background border border-border/50"
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <Button
                      onClick={(e) => handleAdd(product, e)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-md translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                      {added[product.id] ? "Added" : "Add to Cart"}{" "}
                      <ShoppingBag className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </Link>
                <div className="flex justify-between items-start px-2">
                  <div>
                    <span className="text-xs font-medium tracking-widest uppercase text-primary/70 mb-1 block">
                      {product.category}
                    </span>
                    <h3 className="text-xl font-serif text-foreground mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-foreground/70 font-sans">
                      {product.shortDescription}
                    </p>
                  </div>
                  <span className="text-lg font-medium text-foreground">
                    {formatINR(product.price)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
