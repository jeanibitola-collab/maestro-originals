"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/format";
import { formatSize, sizesByCategory } from "@/data/sizes";
import { CATEGORIES, PRODUCT_TYPES } from "@/data/catalog";
import AdminNav from "@/components/AdminNav";

type Category = "men" | "women";

type AdminProduct = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  category: Category;
  type: string;
  sizes: string[];
  inStock: boolean;
  hideOnHome: boolean;
};

type FormState = {
  name: string;
  price: string;
  oldPrice: string;
  image: string;
  description: string;
  category: Category;
  type: string;
  sizes: string[];
  inStock: boolean;
  hideOnHome: boolean;
};

const blank: FormState = {
  name: "",
  price: "",
  oldPrice: "",
  image: "",
  description: "",
  category: "men",
  type: "shoes",
  sizes: [...sizesByCategory.men],
  inStock: true,
  hideOnHome: false,
};

function toForm(p: AdminProduct): FormState {
  return {
    name: p.name,
    price: String(p.price),
    oldPrice: p.oldPrice ? String(p.oldPrice) : "",
    image: p.image,
    description: p.description,
    category: p.category,
    type: p.type,
    sizes: p.sizes.length > 0 ? p.sizes : [...sizesByCategory[p.category]],
    inStock: p.inStock,
    hideOnHome: p.hideOnHome,
  };
}

const field =
  "w-full rounded-lg border bg-transparent px-4 py-3 outline-none placeholder:text-gray-500 focus:border-orange-600";

export default function AdminProductsPage() {
  const { user, loading, signIn } = useAuth();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [fetching, setFetching] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<{ id: number | null; form: FormState } | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [seeding, setSeeding] = useState(false);

  const call = useCallback(
    async (path: string, method = "GET", body?: unknown) => {
      if (!user) throw new Error("Please sign in.");
      const token = await user.getIdToken();
      const res = await fetch(path, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      return { res, data };
    },
    [user]
  );

  const load = useCallback(async () => {
    if (!user) return;
    setFetching(true);
    setError("");
    setForbidden(false);
    try {
      const { res, data } = await call("/api/admin/products");
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Could not load products.");
      setProducts(data.products ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load products.");
    } finally {
      setFetching(false);
    }
  }, [user, call]);

  useEffect(() => {
    load();
  }, [load]);

  function setForm(patch: Partial<FormState>) {
    setEditing((e) => (e ? { ...e, form: { ...e.form, ...patch } } : e));
  }

  async function save() {
    if (!editing) return;
    const f = editing.form;
    const all = sizesByCategory[f.category];
    if (f.sizes.length === 0) {
      setFormError("Select at least one size.");
      return;
    }
    const payload = {
      name: f.name,
      price: f.price,
      oldPrice: f.oldPrice,
      image: f.image,
      description: f.description,
      category: f.category,
      type: f.type,
      sizes: f.sizes.length === all.length ? [] : f.sizes, // all sizes selected means "use the default list"
      inStock: f.inStock,
      hideOnHome: f.hideOnHome,
    };
    setSaving(true);
    setFormError("");
    try {
      const isNew = editing.id === null;
      const { res, data } = await call(
        isNew ? "/api/admin/products" : `/api/admin/products/${editing.id}`,
        isNew ? "POST" : "PATCH",
        payload
      );
      if (!res.ok) throw new Error(data.error ?? "Could not save the product.");
      setEditing(null);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not save the product.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStock(p: AdminProduct) {
    setBusyId(p.id);
    setError("");
    try {
      const { res, data } = await call(`/api/admin/products/${p.id}`, "PATCH", { inStock: !p.inStock });
      if (!res.ok) throw new Error(data.error ?? "Could not update the product.");
      setProducts((list) => list.map((x) => (x.id === p.id ? { ...x, inStock: !p.inStock } : x)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update the product.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(p: AdminProduct) {
    if (!window.confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    setBusyId(p.id);
    setError("");
    try {
      const { res, data } = await call(`/api/admin/products/${p.id}`, "DELETE");
      if (!res.ok) throw new Error(data.error ?? "Could not delete the product.");
      setProducts((list) => list.filter((x) => x.id !== p.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete the product.");
    } finally {
      setBusyId(null);
    }
  }

  async function seed() {
    setSeeding(true);
    setError("");
    try {
      const { res, data } = await call("/api/admin/products/seed", "POST");
      if (!res.ok) throw new Error(data.error ?? "Could not import the products.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not import the products.");
    } finally {
      setSeeding(false);
    }
  }

  const shown = products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));
  const form = editing?.form;
  const typeLabel = (v: string) => PRODUCT_TYPES.find((t) => t.value === v)?.label ?? v;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl md:text-4xl">Manage products</h1>
        {user && !forbidden && (
          <button
            onClick={() => {
              setFormError("");
              setEditing({ id: null, form: { ...blank, sizes: [...sizesByCategory.men] } });
            }}
            className="rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-500"
          >
            Add product
          </button>
        )}
      </div>

      <AdminNav active="products" />

      {loading ? (
        <p className="py-16 text-center">Loading...</p>
      ) : !user ? (
        <div className="py-16 text-center">
          <p className="mb-4 opacity-80">Sign in with your admin account to manage products.</p>
          <button onClick={signIn} className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white">
            Sign in
          </button>
        </div>
      ) : forbidden ? (
        <div className="py-16 text-center">
          <h2 className="mb-2 text-xl font-semibold">You don&apos;t have access to this page</h2>
          <p className="opacity-70">You&apos;re signed in as {user.email}. Sign in with the admin account instead.</p>
        </div>
      ) : (
        <>
          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          {fetching && products.length === 0 ? (
            <p className="py-10 text-center opacity-70">Loading products...</p>
          ) : products.length === 0 ? (
            <div className="rounded-xl border p-10 text-center">
              <h2 className="mb-2 text-xl font-semibold">No products in the database yet</h2>
              <p className="mx-auto mb-6 max-w-md opacity-70">
                Import the shoes from your code file to get started. You can edit, add, or delete them afterwards.
              </p>
              <button
                onClick={seed}
                disabled={seeding}
                className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white disabled:opacity-60"
              >
                {seeding ? "Importing..." : "Import my products"}
              </button>
            </div>
          ) : (
            <>
              <input
                className={`${field} mb-4`}
                placeholder="Search products"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <p className="mb-3 text-sm opacity-60">
                {shown.length} of {products.length} products
              </p>

              <div className="space-y-3">
                {shown.map((p) => (
                  <div key={p.id} className="flex flex-wrap items-center gap-4 rounded-xl border p-4">
                    <img src={p.image} alt="" className="h-16 w-16 shrink-0 rounded-lg bg-gray-500/20 object-cover" />
                    <div className="min-w-0 flex-1 basis-48">
                      <p className="truncate font-semibold">{p.name}</p>
                      <p className="text-sm opacity-60">
                        #{p.id} · {p.category === "women" ? "Women" : "Men"} · {typeLabel(p.type)}
                        {p.hideOnHome ? " · Hidden on homepage" : ""}
                      </p>
                      <p className="mt-1 font-bold">
                        {formatPrice(p.price)}
                        {p.oldPrice ? (
                          <span className="ml-2 text-sm font-normal line-through opacity-60">{formatPrice(p.oldPrice)}</span>
                        ) : null}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleStock(p)}
                      disabled={busyId === p.id}
                      className={`rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-50 ${
                        p.inStock ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500"
                      }`}
                    >
                      {p.inStock ? "In stock" : "Sold out"}
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setFormError("");
                          setEditing({ id: p.id, form: toForm(p) });
                        }}
                        className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-gray-500/20"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(p)}
                        disabled={busyId === p.id}
                        className="rounded-full border border-red-500/60 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Add / edit form */}
      {editing && form && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 p-4">
          <div className="mx-auto my-8 w-full max-w-xl rounded-2xl bg-[var(--background)] p-6 shadow-xl">
            <h2 className="mb-5 text-2xl font-semibold">
              {editing.id === null ? "Add a product" : `Edit product #${editing.id}`}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm opacity-70">Name</label>
                <input className={field} value={form.name} onChange={(e) => setForm({ name: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm opacity-70">Price (₦)</label>
                  <input className={field} inputMode="decimal" value={form.price} onChange={(e) => setForm({ price: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm opacity-70">Old price (optional)</label>
                  <input className={field} inputMode="decimal" value={form.oldPrice} onChange={(e) => setForm({ oldPrice: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm opacity-70">Image path or link</label>
                <input
                  className={field}
                  placeholder="/image1.jpg or https://..."
                  value={form.image}
                  onChange={(e) => setForm({ image: e.target.value })}
                />
                {form.image && (
                  <img src={form.image} alt="" className="mt-2 h-24 w-24 rounded-lg bg-gray-500/20 object-cover" />
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm opacity-70">Description</label>
                <textarea className={field} rows={3} value={form.description} onChange={(e) => setForm({ description: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm opacity-70">Category</label>
                  <select
                    className={`${field} [&>option]:text-black`}
                    value={form.category}
                    onChange={(e) => {
                      const category = e.target.value as Category;
                      setForm({ category, sizes: [...sizesByCategory[category]] });
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm opacity-70">Type</label>
                  <select
                    className={`${field} [&>option]:text-black`}
                    value={form.type}
                    onChange={(e) => setForm({ type: e.target.value })}
                  >
                    {PRODUCT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm opacity-70">Sizes you offer</p>
                <div className="flex flex-wrap gap-2">
                  {sizesByCategory[form.category].map((s) => {
                    const on = form.sizes.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setForm({ sizes: on ? form.sizes.filter((x) => x !== s) : [...form.sizes, s] })
                        }
                        className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                          on ? "border-orange-600 bg-orange-600 text-white" : "opacity-60 hover:bg-gray-500/20"
                        }`}
                      >
                        {formatSize(s)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ inStock: e.target.checked })} />
                <span>In stock</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.hideOnHome} onChange={(e) => setForm({ hideOnHome: e.target.checked })} />
                <span>Hide on the homepage (still shows on the Men and Women pages)</span>
              </label>

              {formError && <p className="text-sm text-red-500">{formError}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditing(null)}
                  disabled={saving}
                  className="flex-1 rounded-full border py-3 font-semibold hover:bg-gray-500/20"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex-1 rounded-full bg-orange-600 py-3 font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}