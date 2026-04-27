import { motion } from "framer-motion";

export function IngredientStory() {
  return (
    <section className="py-24 px-8 bg-background relative overflow-hidden border-t border-border/40">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-[2rem] border border-border/50 shadow-sm bg-card">
              <img 
                src="/ingredient-story.png" 
                alt="Fresh ayurvedic herbs" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          </motion.div>

          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-xs font-medium tracking-widest uppercase text-primary/70 mb-4">Our Philosophy</h2>
              <h3 className="text-4xl md:text-5xl font-serif text-foreground leading-tight mb-8">
                We believe in the slow, <span className="italic font-light">intentional</span> art of herbalism.
              </h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="space-y-6 text-foreground/80 font-sans text-lg leading-relaxed"
            >
              <p>
                In a world of mass-produced synthetics, we return to the root. Every Herbiqa formulation begins in the soil, honoring the ancient traditions of botanical medicine while applying modern scientific rigor.
              </p>
              <p>
                We sustainably forage and cultivate our ingredients, drying them slowly to preserve their volatile oils, and infusing them into potent remedies that nourish the body from the inside out. 
              </p>
              <p className="font-medium text-foreground">
                No shortcuts. No fillers. Just pure, unadulterated nature.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
