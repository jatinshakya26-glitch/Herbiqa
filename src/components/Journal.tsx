import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const articles = [
  {
    id: 1,
    title: "The Art of Slow Botanical Infusions",
    category: "Apothecary Notes",
    image: "/journal-1.png",
    excerpt: "Why we choose solar infusion over heat extraction to preserve the delicate volatile oils of our herbs.",
    date: "Oct 12"
  },
  {
    id: 2,
    title: "A Nightly Ritual for Deep Rest",
    category: "Wellness",
    image: "/journal-2.png",
    excerpt: "Creating boundaries between the busyness of the day and the quiet restoration of the night.",
    date: "Oct 05"
  }
];

export function Journal() {
  return (
    <section className="py-24 md:py-32 bg-background border-t border-border/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-medium tracking-widest uppercase text-secondary mb-4">The Journal</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-foreground">Stories from the Apothecary</h3>
          </div>
          <Link href="/journal" className="text-primary hover:text-primary/80 font-medium text-base p-0 h-auto group flex items-center transition-colors">
            Read all entries <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-xl mb-6 relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium tracking-widest uppercase text-primary">{article.category}</span>
                <span className="text-xs text-foreground/50">{article.date}</span>
              </div>
              <h4 className="text-2xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors">{article.title}</h4>
              <p className="text-foreground/70 font-light leading-relaxed">{article.excerpt}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
