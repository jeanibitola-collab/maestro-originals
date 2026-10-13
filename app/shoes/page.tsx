import { Suspense } from "react";
import ShoesList from "@/components/ShoesList";

export default function ShoesPage() {
  return (
    <Suspense fallback={<p className="p-8">Loading...</p>}>
      <ShoesList />
    </Suspense>
  );
}