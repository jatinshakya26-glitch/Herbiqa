import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { Product } from "../models/Product";
import { logger } from "./logger";

const SEED_PRODUCTS = [
  {
    name: "Ashwagandha Root Powder",
    slug: "ashwagandha-root-powder",
    shortDescription: "Adaptogenic root for calm strength",
    description:
      "Single-origin organic ashwagandha root, sun-dried and stone-milled into a fine powder. Stir into warm milk or smoothies to support steady energy and a settled mind.",
    price: 549,
    imageUrl:
      "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=900&q=80",
    category: "Herbal Powders",
    stockCount: 80,
  },
  {
    name: "Tulsi Green Tea",
    slug: "tulsi-green-tea",
    shortDescription: "Holy basil with first-flush green tea",
    description:
      "A bright, soothing daily blend of three varieties of tulsi (holy basil) with high-grown Darjeeling green tea. Floral, peppery, and gently uplifting.",
    price: 399,
    imageUrl:
      "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=900&q=80",
    category: "Teas",
    stockCount: 120,
  },
  {
    name: "Triphala Wellness Capsules",
    slug: "triphala-wellness-capsules",
    shortDescription: "Three-fruit blend for daily balance",
    description:
      "Time-honored triphala — amla, haritaki, and bibhitaki — in vegetarian capsules. Supports gentle digestion and natural rhythm.",
    price: 699,
    imageUrl:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=900&q=80",
    category: "Capsules",
    stockCount: 60,
  },
  {
    name: "Brahmi Hair Oil",
    slug: "brahmi-hair-oil",
    shortDescription: "Cooling scalp ritual",
    description:
      "Cold-pressed coconut oil infused with brahmi, bhringraj, and amla. Massage into the scalp the night before washing for nourished roots and a calmer head.",
    price: 849,
    imageUrl:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80",
    category: "Hair & Body",
    stockCount: 45,
  },
  {
    name: "Rose & Saffron Face Mist",
    slug: "rose-saffron-face-mist",
    shortDescription: "Hydrosol with hand-picked saffron",
    description:
      "Steam-distilled rose hydrosol with Kashmiri saffron threads. A daily mist that softens, brightens, and smells like a garden after rain.",
    price: 1199,
    imageUrl:
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=900&q=80",
    category: "Skincare",
    stockCount: 35,
  },
  {
    name: "Chyawanprash Wellness Jar",
    slug: "chyawanprash-wellness-jar",
    shortDescription: "40+ herbs in honeyed amla preserve",
    description:
      "A traditional Ayurvedic preserve of amla, ghee, honey, and forty-plus herbs, slow-cooked in small batches. One spoon a day for a steady immune ritual.",
    price: 999,
    imageUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80",
    category: "Wellness",
    stockCount: 50,
  },
];

export async function ensureSeedData(): Promise<void> {
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(SEED_PRODUCTS);
    logger.info({ count: SEED_PRODUCTS.length }, "Seeded products");
  }

  const adminEmail = "admin@herbiqa.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Admin@123", 10);
    await User.create({
      email: adminEmail,
      passwordHash,
      name: "Herbiqa Admin",
      role: "admin",
    });
    logger.info({ email: adminEmail }, "Seeded admin user (password: Admin@123)");
  }
}
