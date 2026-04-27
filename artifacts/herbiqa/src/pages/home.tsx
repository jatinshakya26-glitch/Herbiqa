import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Products } from "@/components/Products";
import { IngredientStory } from "@/components/IngredientStory";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative selection:bg-primary/20 selection:text-primary">
      <NavBar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Products />
        <IngredientStory />
      </main>
      <Footer />
    </div>
  );
}
