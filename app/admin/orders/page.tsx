"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/format";
import { formatSize } from "@/data/sizes";
import AdminNav from "@/components/AdminNav";

type OrderItem = { name?: string; size?: string; quantity?: number };
type AdminOrder = {
  reference: string;
  status: string;
  createdAt: string | null;
  email: string;
  total: number;
  items: OrderItem[];
  delivery: { name?: string; phone?: string; address?: string };
};

const TABS = [
  { key: "new", label: "New", statuses: ["paid"] },
  { key: "processing", label: "Processing", statuses: ["processing"] },
  { key: "shipped", label: "Shipped", statuses: ["shipped"] },
  { key: "delivered", label: "Delivered", statuses: ["delivered"] },
  { key: "closed", label: "Canceled / Returned", statuses: ["cancelled", "canceled", "returned"] },
  { key: "unpaid", label: "Unpaid", statuses: ["awaiting_payment", "payment_mismatch"] },
];

const NEXT: Record<string, string> = { paid: "processing", processing: "shipped", shipped: "delivered" };
const ACTIONS = [
  { status: "processing", label: "Processing" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];
const CHANGEABLE = ["paid", "processing", "shipped", "delivered", "cancelled", "returned"];

const LABELS: Record<string, string> = {
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Canceled",
  returned: "Returned",
  awaiting_payment: "Awaiting payment",
  payment_mismatch: "Payment mismatch",
};

function badge(status: string) {
  if (status === "delivered") return "bg-green-500/15 text-green-500";
  if (status === "cancelled" || status === "returned") return "bg-gray-500/20 opacity-80";
  if (status === "payment_mismatch") return "bg-red-500/15 text-red-500";
  return "bg-orange-500/15 text-orange-500";
}

export default function AdminOrdersPage() {
  const { user, loading, signIn } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [fetching, setFetching] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("new");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setFetching(true);
    setError("");
    setForbidden(false);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 403) {
        setForbidden(true);
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Could not load orders.");
      setOrders(data.orders ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load orders.");
    } finally {
      setFetching(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(reference: string, status: string) {
    if (!user) return;
    if (
      (status === "cancelled" || status === "returned") &&
      !window.confirm(`Mark this order as ${status === "cancelled" ? "canceled" : "returned"}?`)
    ) {
      return;
    }
    setBusy(reference);
    setError("");
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/orders/${reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Could not update the order.");
      setOrders((list) => list.map((o) => (o.reference === reference ? { ...o, status } : o)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update the order.");
    } finally {
      setBusy(null);
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of TABS) c[t.key] = orders.filter((o) => t.statuses.includes(o.status)).length;
    return c;
  }, [orders]);

  const current = TABS.find((t) => t.key === tab) ?? TABS[0];
  const shown = orders.filter((o) => current.statuses.includes(o.status));

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl md:text-4xl">Manage orders</h1>
        {user && !forbidden && (
          <button
            onClick={load}
            disabled={fetching}
            className="rounded-full border px-5 py-2 text-sm font-semibold hover:bg-gray-500/20 disabled:opacity-60"
          >
            {fetching ? "Loading..." : "Refresh"}
          </button>
        )}
      </div>

      <AdminNav active="orders" />

      {loading ? (
        <p className="py-16 text-center">Loading...</p>
      ) : !user ? (
        <div className="py-16 text-center">
          <p className="mb-4 opacity-80">Sign in with your admin account to manage orders.</p>
          <button onClick={signIn} className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white">
            Sign in
          </button>
        </div>
      ) : forbidden ? (
        <div className="py-16 text-center">
          <h2 className="mb-2 text-xl font-semibold">You don&apos;t have access to this page</h2>
          <p className="opacity-70">You&apos;re signed in as {user.email}. Sign in with the admin account instead.</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === t.key ? "border-orange-600 bg-orange-600 text-white" : "hover:bg-gray-500/20"
                }`}
              >
                {t.label} ({counts[t.key] ?? 0})
              </button>
            ))}
          </div>

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          {fetching && orders.length === 0 ? (
            <p className="py-10 text-center opacity-70">Loading orders...</p>
          ) : shown.length === 0 ? (
            <p className="py-10 text-center opacity-70">No orders here.</p>
          ) : (
            <div className="space-y-4">
              {shown.map((o) => {
                const phone = o.delivery.phone ?? "";
                const digits = phone.replace(/\D/g, "");
                const whatsapp = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
                const date = o.createdAt
                  ? new Date(o.createdAt).toLocaleString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                return (
                  <div key={o.reference} className="rounded-xl border p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{o.reference}</p>
                        <p className="text-sm opacity-60">{date}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge(o.status)}`}>
                        {LABELS[o.status] ?? o.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-5 md:grid-cols-2">
                      <div>
                        <p className="text-sm opacity-60">Customer</p>
                        <p className="font-medium">{o.delivery.name || "No name"}</p>
                        <p className="text-sm opacity-80">{o.email}</p>
                        {phone && (
                          <div className="mt-1 flex flex-wrap gap-4 text-sm font-semibold text-orange-600">
                            <a href={`tel:${phone.replace(/\s+/g, "")}`}>Call {phone}</a>
                            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                              WhatsApp
                            </a>
                          </div>
                        )}
                        <p className="mt-2 whitespace-pre-line text-sm opacity-80">{o.delivery.address}</p>
                      </div>

                      <div>
                        <p className="text-sm opacity-60">Items</p>
                        <ul className="space-y-1 text-sm">
                          {o.items.map((i, n) => (
                            <li key={n}>
                              {i.quantity ?? 1} × {i.name}
                              {i.size ? ` · ${formatSize(i.size)}` : ""}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 text-lg font-bold">{formatPrice(o.total)}</p>
                      </div>
                    </div>

                    {o.status === "payment_mismatch" && (
                      <p className="mt-4 text-sm text-red-500">
                        The amount paid didn&apos;t match the order total. Check this payment in your Paystack dashboard.
                      </p>
                    )}
                    {o.status === "awaiting_payment" && (
                      <p className="mt-4 text-sm opacity-60">Not paid yet. This is an unfinished checkout.</p>
                    )}

                    {CHANGEABLE.includes(o.status) && (
                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
                        {ACTIONS.map((a) => (
                          <button
                            key={a.status}
                            disabled={busy === o.reference || o.status === a.status}
                            onClick={() => updateStatus(o.reference, a.status)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-40 ${
                              NEXT[o.status] === a.status
                                ? "bg-orange-600 text-white"
                                : "border hover:bg-gray-500/20"
                            }`}
                          >
                            {a.label}
                          </button>
                        ))}
                        <span className="grow" />
                        {o.status !== "cancelled" && o.status !== "returned" && (
                          <>
                            <button
                              disabled={busy === o.reference}
                              onClick={() => updateStatus(o.reference, "cancelled")}
                              className="rounded-full border border-red-500/60 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/10 disabled:opacity-40"
                            >
                              Cancel
                            </button>
                            <button
                              disabled={busy === o.reference}
                              onClick={() => updateStatus(o.reference, "returned")}
                              className="rounded-full border border-red-500/60 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/10 disabled:opacity-40"
                            >
                              Returned
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </main>
  );
}