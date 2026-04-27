import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    text: "The Golden Hour Serum completely transformed my skin. It feels like putting pure sunlight and nourishment on my face every morning. I've never used a product that feels so alive.",
    author: "Elena R.",
    role: "Long-time customer"
  },
  {
    id: 2,
    text: "I was struggling with sleep for months until I found the Deep Rest Blend. It's not just a tea, it's a nightly ritual that actually works. You can taste the quality of the herbs.",
    author: "Michael T.",
    role: "Holistic Practitioner"
  },
  {
    id: 3,
    text: "Herbiqa isn't just a brand, it's a return to traditional healing. The Forest Rescue Balm healed my dry hands in three days when synthetic creams failed for weeks.",
    author: "Sarah J.",
    role: "Verified Buyer"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-primary/5 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-secondary/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-medium tracking-widest uppercase text-secondary mb-4">Words from our community</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-foreground">
              Loved by those who <br className="hidden md:block" />
              <span className="italic">know the difference.</span>
            </h3>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-card p-8 rounded-2xl shadow-sm border border-border/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-foreground/80 font-light leading-relaxed mb-8 italic">
                  "{review.text}"
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">{review.author}</p>
                <p className="text-xs uppercase tracking-widest text-secondary mt-1">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
