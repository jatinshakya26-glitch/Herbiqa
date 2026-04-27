import { useEffect, useState } from "react";
import { AdminLayout } from "./layout";
import { Button } from "@/components/ui/button";
import { api, formatINR, type Product } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);

  function load() {
    api
      .listProducts()
      .then(setProducts)
      .catch((e) => setError(e?.message ?? "Failed to load products"));
  }
  useEffect(load, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    await api.deleteProduct(id);
    load();
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-serif text-3xl text-primary">Products</h1>
        <Button
          onClick={() => setCreating(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
        >
          New product
        </Button>
      </div>
      <p className="text-foreground/60 text-sm mb-8">
        Manage the catalog shown on the storefront.
      </p>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/60 text-foreground/60 text-xs uppercase tracking-widest">
            <tr>
              <th className="text-left px-5 py-3">Product</th>
              <th className="text-left px-5 py-3">Category</th>
              <th className="text-right px-5 py-3">Price</th>
              <th className="text-right px-5 py-3">Stock</th>
              <th className="text-right px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p) => (
              <tr key={p.id} className="border-t border-border/60">
                <td className="px-5 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-background shrink-0 border border-border">
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-foreground/60">{p.slug}</div>
                  </div>
                </td>
                <td className="px-5 py-3">{p.category}</td>
                <td className="px-5 py-3 text-right">{formatINR(p.price)}</td>
                <td className="px-5 py-3 text-right">{p.stockCount}</td>
                <td className="px-5 py-3 text-right space-x-3">
                  <button
                    onClick={() => setEditing(p)}
                    className="text-xs text-primary hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <ProductDialog
          initial={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={() => {
            setEditing(null);
            setCreating(false);
            load();
          }}
        />
      )}
    </AdminLayout>
  );
}

function ProductDialog({
  initial,
  onClose,
  onSaved,
}: {
  initial: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<Partial<Product>>(
    initial ?? {
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      price: 0,
      currency: "INR",
      imageUrl: "",
      category: "general",
      inStock: true,
      stockCount: 50,
    },
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function set<K extends keyof Product>(k: K, v: Product[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      if (initial) {
        await api.updateProduct(initial.id, form);
      } else {
        await api.createProduct(form);
      }
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-3xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        <h2 className="font-serif text-2xl text-primary mb-6">
          {initial ? "Edit product" : "New product"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name" value={form.name ?? ""} onChange={(v) => set("name", v)} />
          <Field label="Slug" value={form.slug ?? ""} onChange={(v) => set("slug", v)} />
          <Field
            label="Category"
            value={form.category ?? ""}
            onChange={(v) => set("category", v)}
          />
          <Field
            label="Price (INR)"
            type="number"
            value={String(form.price ?? 0)}
            onChange={(v) => set("price", Number(v))}
          />
          <Field
            label="Stock count"
            type="number"
            value={String(form.stockCount ?? 0)}
            onChange={(v) => set("stockCount", Number(v))}
          />
          <Field
            label="Image URL"
            value={form.imageUrl ?? ""}
            onChange={(v) => set("imageUrl", v)}
            className="md:col-span-2"
          />
          <Field
            label="Short description"
            value={form.shortDescription ?? ""}
            onChange={(v) => set("shortDescription", v)}
            className="md:col-span-2"
          />
          <label className="md:col-span-2 block">
            <span className="text-xs uppercase tracking-widest text-foreground/60 mb-1.5 block">
              Description
            </span>
            <textarea
              rows={4}
              value={form.description ?? ""}
              onChange={(e) => set("description", e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
          </label>
        </div>
        {err && (
          <div className="mt-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {err}
          </div>
        )}
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={onClose} className="rounded-full">
            Cancel
          </Button>
          <Button
            disabled={busy}
            onClick={save}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
          >
            {busy ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-widest text-foreground/60 mb-1.5 block">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-card border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
      />
    </label>
  );
}
