// The categories and types a product can have. Change them here and the admin form follows.
export const CATEGORIES = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
] as const;

export const PRODUCT_TYPES = [
  { value: "shoes", label: "Shoes" },
  { value: "sandals", label: "Sandals" },
  { value: "slides", label: "Slides" },
] as const;
