import Link from "next/link";

const tabs = [
  { key: "orders", href: "/orders", label: "Orders" },
  { key: "settings", href: "/account", label: "Account settings" },
];

export default function AccountTabs({ active }: { active: "orders" | "settings" }) {
  return (
    <nav className="mb-8 flex justify-center gap-10 border-b">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            active === t.key
              ? "border-orange-600 text-orange-600"
              : "border-transparent opacity-70 hover:opacity-100"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}