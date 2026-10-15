// Sample product copy for the demo site. Edit it to match your real products and policies.
export const DELIVERY_TIME = "2 to 5 business days"; // matches the sample Shipping page
export const DELIVERY_FEE = "Free"; // matches checkout
export const RETURN_DAYS = 7; // matches the sample Returns page

export type TypeContent = {
  label: string;
  story: string;
  highlights: string[];
  care: string[];
};

const shoes: TypeContent = {
  label: "Shoes",
  story:
    "Designed for everyday wear, this pair is shaped around a comfortable fit and finished by hand, so it looks as good after months of wear as it does on day one.",
  highlights: [
    "Handcrafted and finished by local makers",
    "Designed for all-day comfort",
    "Durable sole built for everyday wear",
    "Clean, versatile style for casual and smart outfits",
    "Inspected by hand before it ships",
  ],
  care: [
    "Wipe off dust and dirt with a soft, damp cloth.",
    "If they get wet, let them dry naturally, away from direct heat or sunlight.",
    "Store them in a cool, dry place with paper or shoe trees inside to keep their shape.",
    "Use a polish or protector that suits the material of your pair.",
  ],
};

const sandals: TypeContent = {
  label: "Sandals",
  story:
    "A relaxed, easy-to-wear sandal made for warm days. Each pair is put together by hand with attention to the straps, the footbed, and the finish.",
  highlights: [
    "Handcrafted and finished by local makers",
    "Secure, comfortable straps",
    "Supportive footbed for walking",
    "Lightweight and easy to wear",
    "Inspected by hand before it ships",
  ],
  care: [
    "Brush off dust and wipe the straps with a soft, damp cloth.",
    "Let them dry naturally if they get wet, away from direct heat.",
    "Avoid soaking them in water for long periods.",
    "Store them in a cool, dry place when not in use.",
  ],
};

const slides: TypeContent = {
  label: "Slides",
  story:
    "Easy to slip on and comfortable from the first wear. These slides are made by hand for relaxed days at home or out and about.",
  highlights: [
    "Handcrafted and finished by local makers",
    "Slip-on style with no fuss",
    "Comfortable footbed",
    "Lightweight for all-day wear",
    "Inspected by hand before it ships",
  ],
  care: [
    "Wipe clean with a soft, damp cloth.",
    "Let them dry naturally if they get wet.",
    "Keep them away from direct heat and harsh cleaners.",
    "Store them in a cool, dry place.",
  ],
};

const belts: TypeContent = {
  label: "Belts",
  story:
    "A well-made belt finishes an outfit. Each one is cut and finished by hand, with a sturdy buckle and neat edges.",
  highlights: [
    "Handcrafted and finished by local makers",
    "Hand-finished edges",
    "Sturdy buckle",
    "Versatile style for work and casual wear",
    "Inspected by hand before it ships",
  ],
  care: [
    "Wipe clean with a soft, dry or slightly damp cloth.",
    "Keep it away from water and direct heat.",
    "Hang it or store it flat to avoid creasing.",
    "Use a conditioner that suits the material.",
  ],
};

const contentByType: Record<string, TypeContent> = { shoes, sandals, slides, belts };

export function getContent(type?: string): TypeContent {
  return (type && contentByType[type]) || shoes;
}