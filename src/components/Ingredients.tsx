import { motion } from "framer-motion";

export function Ingredients() {
  return (
    <section className="py-24 md:py-32 bg-background border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-8">
                Nothing to hide. <br /> Everything to heal.
              </h2>
              
              <div className="space-y-8">
                <div className="border-l-2 border-primary pl-6">
                  <h4 className="text-xl font-serif text-foreground mb-2">Wildcrafted & Organic</h4>
                  <p className="text-foreground/70 font-light leading-relaxed">We source directly from regenerative farms and ethical wildcrafters who respect the delicate balance of ecosystems.</p>
                </div>
                
                <div className="border-l-2 border-secondary pl-6">
                  <h4 className="text-xl font-serif text-foreground mb-2">Whole Plant Extracts</h4>
                  <p className="text-foreground/70 font-light leading-relaxed">We don't isolate active compounds. We use the whole plant, honoring the synergistic intelligence of nature's design.</p>
                </div>
                
                <div className="border-l-2 border-accent pl-6">
                  <h4 className="text-xl font-serif text-foreground mb-2">No Synthetics, Ever</h4>
                  <p className="text-foreground/70 font-light leading-relaxed">Zero artificial fragrances, parabens, or preservatives. If you can't find it in a garden, you won't find it in our jars.</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/ingredients.png" 
                alt="Dried botanical flat lay" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <motion.div 
              className="absolute -bottom-10 -left-10 bg-card p-8 rounded-xl shadow-xl max-w-xs border border-border hidden md:block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <p className="font-serif italic text-xl text-foreground mb-2">"Healing is not a destination, but a relationship with the earth."</p>
              <span className="text-xs uppercase tracking-widest text-primary font-medium">— Herbiqa Manifesto</span>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
