import { CATEGORIES, PRODUCT_TYPES } from "@/data/catalog";
import { sizesByCategory } from "@/data/sizes";

export type ProductInput = {
  name: string;
  price: number;
  oldPrice: number | null;
  image: string;
  description: string;
  category: "men" | "women";
  type: string;
  sizes: string[];
  inStock: boolean;
  hideOnHome: boolean;
};

type Result = { ok: true; data: ProductInput } | { ok: false; error: string };

const fail = (error: string): Result => ({ ok: false, error });
const money = (n: number) => Math.round(n * 100) / 100;

// Checks and cleans what the admin form sends. Runs on the server.
export function parseProductInput(raw: unknown): Result {
  const b = (raw ?? {}) as Record<string, unknown>;

  const name = String(b.name ?? "").trim();
  if (!name || name.length > 120) return fail("Enter a product name (up to 120 characters).");

  const price = Number(b.price);
  if (!Number.isFinite(price) || price <= 0 || price > 100_000_000) {
    return fail("Enter a valid price.");
  }

  let oldPrice: number | null = null;
  if (b.oldPrice !== undefined && b.oldPrice !== null && b.oldPrice !== "") {
    const op = Number(b.oldPrice);
    if (!Number.isFinite(op) || op <= price) {
      return fail("The old price must be higher than the price, or leave it empty.");
    }
    oldPrice = money(op);
  }

  const image = String(b.image ?? "").trim();
  if (image.length > 500 || !/^(\/[^\s]+|https:\/\/[^\s]+)$/.test(image)) {
    return fail("Enter an image path starting with / (for example /image1.jpg) or a full https:// link.");
  }

  const description = String(b.description ?? "").trim().slice(0, 1000);

  const category = String(b.category ?? "");
  if (!CATEGORIES.some((c) => c.value === category)) return fail("Choose a category.");

  const type = String(b.type ?? "");
  if (!PRODUCT_TYPES.some((t) => t.value === type)) return fail("Choose a type.");

  const allowed = sizesByCategory[category as "men" | "women"];
  const chosen = Array.isArray(b.sizes) ? b.sizes.map(String) : [];
  if (chosen.some((s) => !allowed.includes(s))) return fail("One of the sizes isn't valid for this category.");

  return {
    ok: true,
    data: {
      name,
      price: money(price),
      oldPrice,
      image,
      description,
      category: category as "men" | "women",
      type,
      sizes: allowed.filter((s) => chosen.includes(s)), // empty means "all sizes for the category"
      inStock: b.inStock !== false,
      hideOnHome: b.hideOnHome === true,
    },
  };
}