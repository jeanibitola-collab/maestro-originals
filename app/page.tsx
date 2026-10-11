import Hero from "@/components/Hero";
import StyleTiles from "@/components/StyleTiles";
import ProductGrid from "@/components/ProductGrid";
import BenefitsStrip from "@/components/BenefitsStrip";
import Craftsmanship from "@/components/Craftsmanship";
import ProcessSteps from "@/components/ProcessSteps";
import Reviews from "@/components/Reviews";
import { products } from "@/data/products";

export default function Home() {
  const homeProducts = products.filter((p) => !p.hideOnHome);
  return (
    <>
      <Hero />
      <StyleTiles />
      <ProductGrid title="Featured shoes" items={homeProducts.slice(0, 8)} />
      {/* ...the other sections stay the same... */}
      <ProductGrid title="Best sellers" items={homeProducts.slice(8)} />
      <Reviews />
    </>
  );
}