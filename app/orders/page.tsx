"use client";
import { useAuth } from "@/context/AuthContext";

export default function OrderPage() {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6">You have no orders yet.</p>;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Orders</h1>
      <p>{user.displayName}</p>
      <p className="opacity-70">{user.email}</p>
    </main>
  );
}