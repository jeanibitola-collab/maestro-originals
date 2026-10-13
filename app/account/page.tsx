"use client";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-6">Loading...</p>;
  if (!user) return <p className="p-6">Please sign in to view your account.</p>;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">My account</h1>
      <p>{user.displayName}</p>
      <p className="opacity-70">{user.email}</p>
    </main>
  );
}