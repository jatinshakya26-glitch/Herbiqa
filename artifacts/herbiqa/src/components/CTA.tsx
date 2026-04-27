import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative py-32 overflow-hidden bg-primary text-primary-foreground">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="leaf-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 0 C20 10 30 20 40 20 C30 20 20 30 20 40 C20 30 10 20 0 20 C10 20 20 10 20 0 Z" fill="currentColor"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leaf-pattern)"/>
        </svg>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
            Begin your botanical <span className="italic font-light">journey.</span>
          </h2>
          <p className="text-primary-foreground/80 font-light text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
            Experience the difference of truly clean, small-batch herbalism. 
            Your body knows what it needs.
          </p>
          <Button size="lg" className="bg-background text-primary hover:bg-background/90 h-14 px-10 text-lg rounded-full shadow-xl transition-all hover:scale-105">
            Shop the Apothecary
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
