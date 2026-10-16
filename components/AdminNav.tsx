import Link from "next/link";

const links = [
  { key: "orders", href: "/admin/orders", label: "Orders" },
  { key: "products", href: "/admin/products", label: "Products" },
];

export default function AdminNav({ active }: { active: "orders" | "products" }) {
  return (
    <nav className="mb-8 flex gap-2 border-b">
      {links.map((l) => (
        <Link
          key={l.key}
          href={l.href}
          className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            active === l.key
              ? "border-orange-600 text-orange-600"
              : "border-transparent opacity-70 hover:opacity-100"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}