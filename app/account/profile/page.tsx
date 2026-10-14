"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { FaArrowLeft, FaUser } from "react-icons/fa6";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import ProfileAvatar from "@/components/ProfileAvatar";

type Form = {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  address: string;
};

const empty: Form = {
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  birthDate: "",
  address: "",
};

function splitName(full?: string | null): [string, string, string] {
  const p = (full ?? "").trim().split(/\s+/).filter(Boolean);
  if (p.length === 0) return ["", "", ""];
  if (p.length === 1) return [p[0], "", ""];
  if (p.length === 2) return [p[0], "", p[1]];
  return [p[0], p.slice(1, -1).join(" "), p[p.length - 1]];
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b py-4">
      <p className="text-sm opacity-60">{label}</p>
      <div className="mt-1 min-h-[2rem] text-lg">{children}</div>
    </div>
  );
}

export default function ProfileDetailsPage() {
  const { user, loading, signIn } = useAuth();
  const [form, setForm] = useState<Form>(empty);
  const [saved, setSaved] = useState<Form>(empty);
  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    const [first, middle, last] = splitName(user.displayName);
    getDoc(doc(db, "users", user.uid))
      .then((snap) => {
        const d = snap.data() ?? {};
        const loaded: Form = {
          firstName: d.firstName ?? first,
          middleName: d.middleName ?? middle,
          lastName: d.lastName ?? last,
          gender: d.gender ?? "",
          birthDate: d.birthDate ?? "",
          address: d.address ?? "",
        };
        setForm(loaded);
        setSaved(loaded);
        setPhone(d.phone ?? "");
      })
      .catch(console.error);
  }, [user]);

  const set =
    (k: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage("");
    try {
      const fullName = [form.firstName, form.middleName, form.lastName]
        .map((s) => s.trim())
        .filter(Boolean)
        .join(" ");
      if (fullName && fullName !== user.displayName) {
        await updateProfile(user, { displayName: fullName });
      }
      await setDoc(doc(db, "users", user.uid), { name: fullName, ...form }, { merge: true });
      setSaved(form);
      setEditing(false);
      setMessage("Your details have been saved.");
    } catch {
      setMessage("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const input = "w-full bg-transparent text-lg outline-none placeholder:opacity-40";
  const displayName = [saved.firstName, saved.lastName].filter(Boolean).join(" ") || user?.email || "Profile";

  return (
    <main className="mx-auto max-w-xl px-4 pb-16 pt-4">
      <Link href="/account" aria-label="Back to my account" className="inline-block p-2">
        <FaArrowLeft />
      </Link>

      {loading ? (
        <p className="p-8 text-center">Loading...</p>
      ) : !user ? (
        <div className="p-10 text-center">
          <p className="mb-4 opacity-80">Sign in to see your profile details.</p>
          <button onClick={signIn} className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white">
            Sign in
          </button>
        </div>
      ) : (
        <form onSubmit={save}>
          <div className="mt-2 text-center">
            <ProfileAvatar photoURL={user.photoURL} name={displayName} Badge={FaUser} />
            <h1 className="mt-5 text-3xl font-semibold">Profile Details</h1>
          </div>

          <div className="mt-8">
            <Row label="First Name">
              {editing ? <input className={input} value={form.firstName} onChange={set("firstName")} /> : form.firstName}
            </Row>
            <Row label="Middle Name">
              {editing ? <input className={input} value={form.middleName} onChange={set("middleName")} /> : form.middleName}
            </Row>
            <Row label="Last Name">
              {editing ? <input className={input} value={form.lastName} onChange={set("lastName")} /> : form.lastName}
            </Row>
            <Row label="Email">
              <span className="opacity-80">{user.email}</span>
            </Row>
            <Row label="Gender (optional)">
              {editing ? (
                <select className={`${input} [&>option]:text-black`} value={form.gender} onChange={set("gender")}>
                  <option value="">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                form.gender
              )}
            </Row>
            <Row label="Birth date (optional)">
              {editing ? (
                <input type="date" className={input} value={form.birthDate} onChange={set("birthDate")} />
              ) : (
                form.birthDate
              )}
            </Row>
            <Row label="Phone Number">
              <div className="flex items-center justify-between gap-4">
                <span>{phone || <span className="opacity-50">Not added yet</span>}</span>
                <Link href="/account/phone" className="text-sm font-semibold text-orange-600">
                  Change
                </Link>
              </div>
            </Row>
            <Row label="Delivery address">
              {editing ? (
                <textarea rows={2} className={input} value={form.address} onChange={set("address")} />
              ) : (
                <span className="whitespace-pre-line">{form.address}</span>
              )}
            </Row>
          </div>

          {message && <p className="mt-4 text-center text-sm text-green-500">{message}</p>}

          <div className="mt-8 text-center">
            {editing ? (
              <div className="space-y-3">
                <button
                  disabled={saving}
                  className="w-full rounded-lg bg-orange-600 py-4 font-semibold tracking-widest text-white shadow disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm(saved);
                    setEditing(false);
                    setMessage("");
                  }}
                  className="font-semibold opacity-70"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMessage("");
                  setEditing(true);
                }}
                className="font-semibold tracking-widest text-orange-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      )}
    </main>
  );
}