import { Router, type IRouter } from "express";
import mongoose from "mongoose";
import { Product } from "../models/Product";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

function toJSON(p: InstanceType<typeof Product>): Record<string, unknown> {
  return {
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    shortDescription: p.shortDescription,
    description: p.description,
    price: p.price,
    currency: p.currency,
    imageUrl: p.imageUrl,
    category: p.category,
    inStock: p.inStock,
    stockCount: p.stockCount,
    createdAt: p.get("createdAt"),
    updatedAt: p.get("updatedAt"),
  };
}

router.get("/products", async (_req, res): Promise<void> => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products.map((p) => toJSON(p)));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  let product;
  if (id && mongoose.isValidObjectId(id)) {
    product = await Product.findById(id);
  } else if (id) {
    product = await Product.findOne({ slug: id });
  }
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(toJSON(product));
});

router.post("/products", requireAdmin, async (req, res): Promise<void> => {
  const body = req.body ?? {};
  if (!body.name || !body.slug || typeof body.price !== "number") {
    res.status(400).json({ error: "name, slug, and price are required" });
    return;
  }
  const product = await Product.create(body);
  res.status(201).json(toJSON(product));
});

router.patch("/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }
  const product = await Product.findByIdAndUpdate(id, req.body ?? {}, {
    new: true,
  });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(toJSON(product));
});

router.delete("/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
