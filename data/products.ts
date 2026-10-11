export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: "men" | "women";
  type?: string;
  hideOnHome?: boolean;
};

const items: Omit<Product, "id">[] = [
  {  name: "Brown Chelsea Boot", price: 59.99, image: "/image1.jpg", description: "Comfortable everyday shoes.", category: "men", type: "shoes" },
  {  name: "Nude Birken Slides", price: 39.99, image: "/image6.jpg", description: "Fits a 15-inch laptop.", category: "men", type: "sandals"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/image3.jpg", description: "Simple and stylish.", category: "men", type: "shoes"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/wsl10.jpg", description: "Simple and stylish.", category: "women", type: "slippers"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/image8.jpg", description: "Simple and stylish.", category: "men", type: "slides"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/wsl9.jpg", description: "Simple and stylish.", category: "women", type: "slippers"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/image10.jpg", description: "Simple and stylish.", category: "men", type: "slides"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/image12.jpg", description: "Simple and stylish.", category: "men", type: "slides"  },

  // Best sellers
  {  name: "Black Penny Loafer", price: 89.99, image: "/image11.jpg", description: "Simple and stylish.", category: "men", type: "slides"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/boot4.jpg", description: "Simple and stylish.", category: "men", type: "shoes"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/boot5.jpg", description: "Simple and stylish.", category: "men", type: "shoes"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/boots3.jpg", description: "Simple and stylish.", category: "men", type: "shoes"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/wsl11.jpg", description: "Simple and stylish.", category: "women", type: "slippers"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/oxford2.jpg", description: "Simple and stylish.", category: "men", type: "shoes"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/wsl2.jpg", description: "Simple and stylish.", category: "women", type: "slippers"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/boot6.jpg", description: "Simple and stylish.", category: "men", type: "shoes"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/oxford1.jpg", description: "Simple and stylish.", category: "men", type: "shoes"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/wsl1.jpg", description: "Simple and stylish.", category: "women", type: "slippers"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/boot7.jpg", description: "Simple and stylish.", category: "men", type: "shoes"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/oxford.jpg", description: "Simple and stylish.", category: "men", type: "shoes"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/boot10.jpg", description: "Simple and stylish.", category: "men", type: "shoes"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/wsl3.jpg", description: "Simple and stylish.", category: "women", type: "slippers"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/boot9.jpg", description: "Simple and stylish.", category: "men", type: "shoes"  },
  {  name: "Black Penny Loafer", price: 89.99, image: "/wsl7.jpg", description: "Simple and stylish.", category: "women", type: "slippers"  },

  // General products
  { name: "Black Penny Loafer", price: 89.99, image: "/lo1.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/lo2.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/lo3.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/lo4.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/lo5.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/lo6.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/lo7.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/lo8.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/lo9.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/lo10.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/lo11.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/lo12.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/image14.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/lo3.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa1.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa2.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa3.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa4.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa5.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa6.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa7.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa8.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa9.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa10.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa11.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa12.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa13.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa14.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sa15.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl1.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl2.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl3.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl4.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl5.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl6.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl7.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl8.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl9.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl10.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl11.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl12.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl13.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl14.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/image15.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/image13.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl17.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
  { name: "Black Penny Loafer", price: 89.99, image: "/sl16.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true },
];
export const products: Product[] = items.map((p, i) => ({ ...p, id: i + 1 }));