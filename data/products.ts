export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: "men" | "women";
  type?: string;
  hideOnHome?: boolean;
  oldPrice?: number;
  sizes?: string[];
  inStock?: boolean;
};

const items: Omit<Product, "id">[] = [
  {  name: "Brown Chelsea Boot", price: 50000, image: "/image1.jpg", description: "Comfortable everyday shoes.", category: "men", type: "shoes", oldPrice: 65000},
  {  name: "Classic Black Men's Sandals", price: 38000, image: "/image6.jpg", description: "Fits a 15-inch laptop.", category: "men", type: "sandals", oldPrice: 79.99  },
  {  name: "Black Penny Loafer", price: 55000, image: "/image3.jpg", description: "Simple and stylish.", category: "men", type: "shoes", oldPrice: 79.99  },
  {  name: "Women's Pam Slide", price: 20000, image: "/wsl10.jpg", description: "Simple and stylish.", category: "women", type: "slippers", oldPrice: 79.99  },
  {  name: "Ganni Feminine buckle mules", price: 30000, image: "/image8.jpg", description: "Simple and stylish.", category: "women", type: "slides", oldPrice: 79.99  },
  {  name: "Women's Boho Flat Sandals", price: 25000, image: "/wsl9.jpg", description: "Simple and stylish.", category: "women", type: "slippers", oldPrice: 79.99  },
  {  name: "Men's Suede Leather Slides", price: 39500, image: "/image10.jpg", description: "Simple and stylish.", category: "men", type: "slides", oldPrice: 79.99  },
  {  name: "Men's Birken Slides", price: 36000, image: "/image12.jpg", description: "Simple and stylish.", category: "men", type: "slides", oldPrice: 79.99  },

  // Best sellers
  {  name: "Men's Black Cross Slides", price: 35000, image: "/image11.jpg", description: "Simple and stylish.", category: "men", type: "slides", oldPrice: 79.99  },
  {  name: "Men's Suede Chelsea Boots", price: 55000, image: "/boot4.jpg", description: "Simple and stylish.", category: "men", type: "shoes", oldPrice: 79.99  },
  {  name: "Brown Suede Chelsea Boots", price: 53000, image: "/boot5.jpg", description: "Simple and stylish.", category: "men", type: "shoes", oldPrice: 79.99  },
  {  name: "Brown Chelsea Zipped Boot", price: 58000, image: "/boots3.jpg", description: "Simple and stylish.", category: "men", type: "shoes", oldPrice: 79.99  },
  {  name: "Women's Wine Pam Slide", price: 30000, image: "/wsl11.jpg", description: "Simple and stylish.", category: "women", type: "slippers", oldPrice: 79.99  },
  {  name: "Brown Chelsea Boot", price: 50000, image: "/oxford2.jpg", description: "Simple and stylish.", category: "men", type: "shoes", oldPrice: 79.99  },
  {  name: "Women's Pam Slippers", price: 25000, image: "/wsl2.jpg", description: "Simple and stylish.", category: "women", type: "slippers", oldPrice: 79.99  },
  {  name: "Black Suede Chelsea Boots", price: 52500, image: "/boot6.jpg", description: "Simple and stylish.", category: "men", type: "shoes", oldPrice: 79.99  },
  {  name: "Men's Black Oxford", price: 57000, image: "/oxford1.jpg", description: "Simple and stylish.", category: "men", type: "shoes", oldPrice: 79.99  },
  {  name: "Women's Pam Slide", price: 25000, image: "/wsl1.jpg", description: "Simple and stylish.", category: "women", type: "slippers", oldPrice: 79.99  },
  {  name: "Brown Chelsea Boot", price: 60000, image: "/boot7.jpg", description: "Simple and stylish.", category: "men", type: "shoes", oldPrice: 79.99  },
  {  name: "Classic Men's Black Oxford", price: 58000, image: "/oxford.jpg", description: "Simple and stylish.", category: "men", type: "shoes", oldPrice: 79.99  },
  {  name: "Men's Black Matte", price: 60500, image: "/boot10.jpg", description: "Simple and stylish.", category: "men", type: "shoes", oldPrice: 79.99  },
  {  name: "Women's Pam Slide", price: 28000, image: "/wsl3.jpg", description: "Simple and stylish.", category: "women", type: "slippers", oldPrice: 79.99  },
  {  name: "Men's Double Sole Oxford", price: 59000, image: "/boot9.jpg", description: "Simple and stylish.", category: "men", type: "shoes", oldPrice: 79.99  },
  {  name: "Herme's Chypre Sandals", price: 25000, image: "/wsl7.jpg", description: "Simple and stylish.", category: "women", type: "slippers", oldPrice: 79.99  },

  // General products
  { name: "Black and White Loafer", price: 50000, image: "/lo1.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Men's Black Matte", price: 60000, image: "/lo2.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Men's Black Loafer", price: 50000, image: "/lo3.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Black Classic Penny Loafer", price: 53000, image: "/lo4.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Brown Penny Loafer", price: 50000, image: "/lo5.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Black Classic Penny Loafer", price: 52000, image: "/lo6.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Black Penny Luxury Loafer", price: 55000, image: "/lo7.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Classic Black Loafer", price: 58000, image: "/lo8.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Vintage Penny Loafer", price: 53000, image: "/lo9.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Crocodile Penny Loafer", price: 52800, image: "/lo10.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Brown Vintage Loafer", price: 46000, image: "/lo11.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Classic Suede Loafer", price: 54000, image: "/lo12.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Men's Brown Oxford", price: 57000, image: "/image14.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Black Penny Loafer", price: 50000, image: "/lo3.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Church's Hove Sandals", price: 40000, image: "/sa1.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "Louis Cardy Sandals", price: 46000, image: "/sa2.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "Birken Buckled Sandals", price: 47000, image: "/sa3.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "Men's Electric Sandals", price: 45000, image: "/sa4.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "Canto Black Sandals", price: 44000, image: "/sa5.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "Comey Lark Sandals", price: 40000, image: "/sa6.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "Jarelli Tan Leather Sandals", price: 41500, image: "/sa7.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "Jarelli Black Leather Sandals", price: 43000, image: "/sa8.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "Alohas Harper Sandals", price: 40000, image: "/sa9.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "Brutus Green Sandals", price: 46000, image: "/sa10.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "Lucas Black Leather Sandals", price: 44000, image: "/sa11.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "Church's Hove Sandals", price: 40000, image: "/sa12.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "Ancient Greek Sandals", price: 42000, image: "/sa13.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "New Roman Black Sandals", price: 41000, image: "/sa14.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "Calvin Klein Leather Sandals", price: 56000, image: "/sa15.jpg", description: "Simple and stylish.", category: "men", type: "sandals", hideOnHome: true, oldPrice: 79.99 },
  { name: "Asos Cross Over slides", price: 30000, image: "/sl1.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99 },
  { name: "Brown Leather Cross Slide", price: 35000, image: "/sl2.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true , oldPrice: 79.99},
  { name: "Men's Toe Flat Slide", price: 34000, image: "/sl3.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99 },
  { name: "Tom Ford Leather Slide", price: 40000, image: "/sl4.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99 },
  { name: "Studio Nicholson leather Slide", price: 37000, image: "/sl5.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99 },
  { name: "Summer Outdoor Slide", price: 35000, image: "/sl6.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99 },
  { name: "Jil Sander Strap Slide", price: 40000, image: "/sl7.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99 },
  { name: "Brown Cross Slide", price: 37000, image: "/sl8.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99 },
  { name: "Fashion Men's Suede Slide", price: 40000, image: "/sl9.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99 },
  { name: "Fashion Men's Light Brown Suede Slide", price: 42000, image: "/sl10.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99 },
  { name: "Brown Basket Slides", price: 35000, image: "/sl11.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99 },
  { name: "Black Basket Slides", price: 37000, image: "/sl12.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99 },
  { name: "FitFlop Surfer Men's Slide", price: 36000, image: "/sl13.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99 },
  { name: "Loro Piana Sea-Pacific Leather Slides", price: 39000, image: "/sl14.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99},
  { name: "British Woven Tassel Loafer", price: 57000, image: "/image15.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Men's Black Oxford", price: 58000, image: "/image13.jpg", description: "Simple and stylish.", category: "men", type: "shoes", hideOnHome: true, oldPrice: 79.99 },
  { name: "Zara Double-Strap Slide", price: 41000, image: "/sl17.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99 },
  { name: "Black Double-Strap Slide", price: 44000, image: "/sl16.jpg", description: "Simple and stylish.", category: "men", type: "slides", hideOnHome: true, oldPrice: 79.99 },
];
export const products: Product[] = items.map((p, i) => ({ ...p, id: i + 1 }));