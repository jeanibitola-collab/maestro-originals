import AddToCartButton from "@/components/AddToCartButton";
import { notFound } from "next/navigation";
import { products } from "@/data/products";

export const instant = false;
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === Number(id));

  if (!product) notFound();

  return (
    <main className="p-8 max-w-xl">
      <img src={product.image} alt={product.name} className="w-full rounded" />
      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
      <p className="my-2">{product.description}</p>
      <p className="font-semibold mb-4">${product.price.toFixed(2)}</p>
      <AddToCartButton product={product} />
    </main>
  );
}