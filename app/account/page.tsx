"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { IconType } from "react-icons";
import { deleteUser } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import { FaChevronDown, FaCircleUser, FaLock } from "react-icons/fa6";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import AccountTabs from "@/components/AccountTabs";

type Item = { label: string; href?: string };
type Section = { key: string; label: string; Icon: IconType; items: Item[] };

const sections: Section[] = [
  {
    key: "profile",
    label: "Profile Details",
    Icon: FaCircleUser,
    items: [
      { label: "Basic Details", href: "/account/profile" },
      { label: "Edit Phone Number", href: "/account/phone" },
    ],
  },
  {
    key: "security",
    label: "Security Settings",
    Icon: FaLock,
    items: [
      { label: "Change Password", href: "/account/security" },
      { label: "Delete Account" }, // no link: opens the confirm box
    ],
  },
];

export default function AccountPage() {
  const { user, loading, signIn, logOut } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState<Record<string, boolean>>({
    profile: false,
    security: false,
  });
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function deleteAccount() {
    if (!user) return;
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      router.push("/");
    } catch (e) {
      const code = (e as { code?: string })?.code;
      setDeleteError(
        code === "auth/requires-recent-login"
          ? "For your security, please sign out, sign in again, and then delete your account."
          : "Could not delete your account. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <main className="p-8 text-center">Loading...</main>;

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-serif text-3xl">My account</h1>
        <p className="mb-6 opacity-70">Sign in to see your orders and manage your account.</p>
        <button
          onClick={signIn}
          className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white"
        >
          Sign in
        </button>
      </main>
    );
  }

  const name = user.displayName || user.email?.split("@")[0] || "there";
  const rowClass =
    "block w-full rounded-lg border px-5 py-5 text-left text-lg transition-colors hover:bg-gray-500/10";

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-center font-serif text-4xl md:text-5xl">My account</h1>

      <AccountTabs active="settings" />

      <div className="mx-auto max-w-xl">
        {/* Picture and greeting */}
        <div className="flex flex-col items-center py-6">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              referrerPolicy="no-referrer"
              className="h-24 w-24 rounded-full"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-600 text-4xl font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <h2 className="mt-4 text-center text-2xl font-semibold">Hello {name}</h2>
        </div>

        {/* Expanding sections */}
        <div className="space-y-6">
          {sections.map(({ key, label, Icon, items }) => (
            <div key={key} className="space-y-2">
              <button
                onClick={() => setOpen((o) => ({ ...o, [key]: !o[key] }))}
                aria-expanded={!!open[key]}
                className="flex w-full items-center gap-5 rounded-lg border px-5 py-5 text-left shadow-sm transition-colors hover:bg-gray-500/10"
              >
                <Icon className="text-3xl" />
                <span className="flex-1 text-lg">{label}</span>
                <FaChevronDown
                  className={`text-orange-600 transition-transform ${open[key] ? "rotate-180" : ""}`}
                />
              </button>

              {open[key] &&
                items.map((item) =>
                  item.href ? (
                    <Link key={item.label} href={item.href} className={rowClass}>
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => {
                        setDeleteError("");
                        setConfirming(true);
                      }}
                      className={`${rowClass} text-red-500`}
                    >
                      {item.label}
                    </button>
                  )
                )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={async () => {
              await logOut();
              router.push("/");
            }}
            className="rounded-full border px-8 py-3 font-medium hover:bg-gray-500/20"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Delete account confirmation */}
      {confirming && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
          onClick={() => !deleting && setConfirming(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold">Delete your account?</h3>
            <p className="mt-2 text-sm opacity-80">
              This permanently deletes your account and your saved profile details. It cannot be undone.
            </p>
            {deleteError && <p className="mt-3 text-sm text-red-500">{deleteError}</p>}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className="flex-1 rounded-full border py-3 font-medium hover:bg-gray-500/20"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                disabled={deleting}
                className="flex-1 rounded-full bg-red-600 py-3 font-semibold text-white disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}