import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Leaf } from "lucide-react";

export function Hero() {
  const { user } = useAuth();
  const adminPath = user?.role === "admin" ? "/admin" : "/sign-in";

  return (
    <section className="relative w-full pt-12 pb-24 px-8">
      <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-16">
        {/* Left Column */}
        <div className="w-full lg:w-1/2 flex flex-col items-start pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Natural wellness, modern commerce
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-serif text-primary leading-[1.1] uppercase mb-8"
          >
            Ayurveda-<br />inspired<br />essentials for<br />everyday<br />balance.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-foreground/80 font-sans max-w-md mb-10 leading-relaxed"
          >
            Herbiqa blends a calming green aesthetic with a secure full-stack
            ecommerce flow — from email sign-in to Razorpay checkout.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link href="/products">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-full shadow-sm text-sm font-medium"
              >
                Browse products
              </Button>
            </Link>
            <Link href={adminPath}>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5 h-12 px-8 rounded-full text-sm font-medium bg-transparent"
              >
                Admin panel
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md bg-card rounded-[2rem] p-8 shadow-lg border border-card-border flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-background rounded-full blur-3xl opacity-50"></div>
            <div className="relative z-10 w-full aspect-square rounded-2xl overflow-hidden mb-8 border border-border/50 shadow-sm bg-background flex items-center justify-center">
              <Leaf className="w-32 h-32 text-primary" />
            </div>
            <p className="relative z-10 text-center text-sm text-foreground/80 font-medium leading-relaxed max-w-xs">
              A clean, plant-forward identity inspired by traditional herbal
              wellness and modern premium packaging.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
