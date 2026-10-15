// The sizes you sell. Change the lists here and the whole site follows.
export const SIZE_LABEL = "EU";

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

export const sizesByCategory = {
  men: range(39, 49), // EU 39 to 49
  women: range(38, 46), // EU 38 to 46
};

// A product can list its own sizes with a `sizes: [...]` field in data/products.ts.
// Otherwise it uses the list for its category (men if no category is set).
export function getSizes(product: { category?: "men" | "women"; sizes?: string[] }): string[] {
  if (product.sizes && product.sizes.length > 0) return product.sizes;
  return sizesByCategory[product.category ?? "men"];
}

// How a size is shown to customers, for example "EU 42"
export function formatSize(size: string) {
  return `${SIZE_LABEL} ${size}`;
}