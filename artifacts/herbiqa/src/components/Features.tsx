import { motion } from "framer-motion";
import { ShieldCheck, CreditCard, ShoppingBag } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
    title: "Secure auth",
    description: "Google login and role-based access"
  },
  {
    icon: <CreditCard className="w-5 h-5 text-primary" />,
    title: "Fast checkout",
    description: "Razorpay payment integration"
  },
  {
    icon: <ShoppingBag className="w-5 h-5 text-primary" />,
    title: "Persistent cart",
    description: "Saved locally with Zustand"
  }
];

export function Features() {
  return (
    <section className="w-full py-12 px-8 border-t border-border/40 bg-background/50">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-card-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-foreground/70 font-sans">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
