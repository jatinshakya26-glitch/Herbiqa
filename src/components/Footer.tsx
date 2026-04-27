import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-24 pb-12 px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          <div className="lg:col-span-1">
            <span className="font-serif text-3xl font-medium tracking-tight mb-6 block">HERBIQA</span>
            <p className="text-primary-foreground/70 font-sans text-sm leading-relaxed max-w-xs">
              Modern herbal wellness crafting plant-powered remedies, teas, and skincare from sustainably foraged botanicals.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Shop</h4>
            <ul className="space-y-4 font-sans">
              <li><Link href="/products" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">All Products</Link></li>
              <li><Link href="/shop/skincare" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Skincare</Link></li>
              <li><Link href="/shop/teas" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Herbal Teas</Link></li>
              <li><Link href="/shop/remedies" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Remedies & Tinctures</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">About</h4>
            <ul className="space-y-4 font-sans">
              <li><Link href="/about" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Our Story</Link></li>
              <li><Link href="/sourcing" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Sourcing & Ingredients</Link></li>
              <li><Link href="/contact" className="text-primary-foreground/70 hover:text-white transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Join the Apothecary</h4>
            <p className="text-primary-foreground/70 font-sans text-sm mb-4">
              Subscribe to receive herbal wisdom, exclusive product drops, and 10% off your first order.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-transparent border-b border-primary-foreground/30 px-0 py-2 text-sm text-white placeholder:text-primary-foreground/50 focus:outline-none focus:border-white w-full transition-colors font-sans"
              />
              <button type="submit" className="text-sm font-medium uppercase tracking-widest hover:text-primary-foreground/80 transition-colors font-sans">
                Join
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-xs font-sans">
            © {new Date().getFullYear()} Herbiqa Botanical Wellness. All rights reserved.
          </p>
          <div className="flex gap-6 font-sans">
            <Link href="/privacy" className="text-primary-foreground/50 hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-primary-foreground/50 hover:text-white text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
