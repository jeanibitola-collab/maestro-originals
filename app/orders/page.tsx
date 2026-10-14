"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FaArrowLeft, FaChevronRight } from "react-icons/fa6";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

type OrderItem = { name?: string; image?: string; price?: number; quantity?: number };
type Order = {
  id: string;
  reference?: string;
  status?: string;
  total?: number;
  createdAt?: unknown;
  items?: OrderItem[];
};

const CLOSED = ["cancelled", "canceled", "returned", "refunded"];

function toDate(v: unknown): Date | null {
  if (!v) return null;
  const t = v as { toDate?: () => Date };
  if (typeof t.toDate === "function") return t.toDate();
  if (typeof v === "number" || typeof v === "string") return new Date(v);
  return null;
}

function statusInfo(status?: string) {
  const s = (status ?? "pending").toLowerCase();
  const label =
    s === "cancelled" || s === "canceled" ? "Canceled" : s.charAt(0).toUpperCase() + s.slice(1);
  const style =
    s === "delivered" || s === "paid"
      ? "bg-green-500/15 text-green-500"
      : CLOSED.includes(s)
      ? "bg-gray-500/20 opacity-80"
      : "bg-orange-500/15 text-orange-500";
  return { label, style };
}

export default function OrdersPage() {
  const { user, loading, signIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"ongoing" | "closed">("ongoing");

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setFetching(false);
      return;
    }
    setFetching(true);
    setError("");
    getDocs(query(collection(db, "orders"), where("uid", "==", user.uid)))
      .then((snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) }));
        list.sort(
          (a, b) =>
            (toDate(b.createdAt)?.getTime() ?? 0) - (toDate(a.createdAt)?.getTime() ?? 0)
        );
        setOrders(list);
      })
      .catch((e) => {
        console.error(e);
        setError("We couldn't load your orders. Please try again.");
      })
      .finally(() => setFetching(false));
  }, [user]);

  const shown = orders.filter((o) => {
    const closed = CLOSED.includes((o.status ?? "").toLowerCase());
    return tab === "closed" ? closed : !closed;
  });

  const tabClass = (active: boolean) =>
    `border-b-4 py-4 text-center text-sm font-semibold uppercase transition-colors ${
      active ? "border-orange-600 text-orange-600" : "border-transparent opacity-70"
    }`;

  return (
    <main className="mx-auto max-w-2xl pb-16">
      {/* Title row */}
      <div className="flex items-center gap-4 border-b px-4 py-4">
        <Link href="/account" aria-label="Back to my account">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 border-b">
        <button onClick={() => setTab("ongoing")} className={tabClass(tab === "ongoing")}>
          Ongoing / Delivered
        </button>
        <button onClick={() => setTab("closed")} className={tabClass(tab === "closed")}>
          Canceled / Returned
        </button>
      </div>

      <div className="space-y-3 bg-gray-500/10 p-3">
        {/* Help card */}
        <Link
          href="/contact"
          className="flex items-center justify-between gap-4 rounded-xl bg-[var(--background)] p-4"
        >
          <div>
            <p className="font-semibold">Need help with an order?</p>
            <p className="text-sm opacity-70">Contact us and we will gladly help.</p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-500/30">
            <FaChevronRight />
          </span>
        </Link>

        {/* Not signed in */}
        {!loading && !user && (
          <div className="rounded-xl bg-[var(--background)] p-8 text-center">
            <p className="mb-4 opacity-80">Sign in to see your orders.</p>
            <button
              onClick={signIn}
              className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white"
            >
              Sign in
            </button>
          </div>
        )}

        {/* Loading blocks */}
        {(loading || (user && fetching)) &&
          [0, 1, 2].map((i) => (
            <div key={i} className="flex animate-pulse gap-4 rounded-xl bg-[var(--background)] p-4">
              <div className="h-28 w-28 shrink-0 rounded-lg bg-gray-500/30" />
              <div className="flex-1 space-y-3 pt-1">
                <div className="h-4 w-4/5 rounded bg-gray-500/30" />
                <div className="h-4 w-1/2 rounded bg-gray-500/30" />
                <div className="h-4 w-1/3 rounded bg-gray-500/30" />
                <div className="h-4 w-2/3 rounded bg-gray-500/30" />
              </div>
            </div>
          ))}

        {error && <p className="p-4 text-center text-sm text-red-500">{error}</p>}

        {/* Empty */}
        {user && !fetching && !error && shown.length === 0 && (
          <div className="rounded-xl bg-[var(--background)] p-10 text-center">
            <p className="mb-4 opacity-80">
              {tab === "ongoing"
                ? "You have no ongoing or delivered orders yet."
                : "You have no canceled or returned orders."}
            </p>
            {tab === "ongoing" && (
              <Link
                href="/shoes"
                className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white"
              >
                Start shopping
              </Link>
            )}
          </div>
        )}

        {/* Orders */}
        {user &&
          !fetching &&
          shown.map((o) => {
            const first = o.items?.[0];
            const extra = (o.items?.length ?? 0) - 1;
            const { label, style } = statusInfo(o.status);
            const date = toDate(o.createdAt);
            const total =
              o.total ??
              (o.items ?? []).reduce((n, i) => n + (i.price ?? 0) * (i.quantity ?? 1), 0);

            return (
              <div key={o.id} className="flex gap-4 rounded-xl bg-[var(--background)] p-4">
                {first?.image ? (
                  <img
                    src={first.image}
                    alt={first.name ?? "Order item"}
                    className="h-28 w-28 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-28 w-28 shrink-0 rounded-lg bg-gray-500/20" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {first?.name ?? "Your order"}
                    {extra > 0 && ` + ${extra} more`}
                  </p>
                  <p className="text-sm opacity-70">
                    Order {o.reference ?? o.id.slice(0, 8).toUpperCase()}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${style}`}
                  >
                    {label}
                  </span>
                  {date && (
                    <p className="mt-2 text-sm opacity-70">
                      Placed on {date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  )}
                  <p className="mt-1 font-bold">${total.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
}