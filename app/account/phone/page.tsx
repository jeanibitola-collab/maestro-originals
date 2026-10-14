"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FaArrowLeft, FaLock } from "react-icons/fa6";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import ProfileAvatar from "@/components/ProfileAvatar";

const CODES = ["+234", "+233", "+254", "+27", "+44", "+1"];
const LOGO = "/maestro-logo-gold.svg"; // the gold logo file in your public folder

function splitPhone(p: string) {
  const compact = p.replace(/\s+/g, "");
  const code = [...CODES].sort((a, b) => b.length - a.length).find((c) => compact.startsWith(c));
  if (code) return { code, number: compact.slice(code.length) };
  return { code: "+234", number: compact.replace(/^0/, "") };
}

export default function EditPhonePage() {
  const { user, loading, signIn } = useAuth();
  const [code, setCode] = useState("+234");
  const [number, setNumber] = useState("");
  const [savedPhone, setSavedPhone] = useState("");
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid))
      .then((snap) => {
        const phone: string = snap.data()?.phone ?? "";
        setSavedPhone(phone);
        if (phone) {
          const s = splitPhone(phone);
          setCode(s.code);
          setNumber(s.number);
        } else {
          setEditing(true); // nothing saved yet, so go straight to entering one
        }
        setReady(true);
      })
      .catch((e) => {
        console.error(e);
        setReady(true);
      });
  }, [user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setMessage("");
    setError("");
    const digits = number.replace(/\D/g, "").replace(/^0+/, "");
    if (digits.length < 7 || digits.length > 12) {
      setError("Please enter a valid phone number.");
      return;
    }
    setSaving(true);
    try {
      const phone = `${code} ${digits}`;
      await setDoc(doc(db, "users", user.uid), { phone }, { merge: true });
      setSavedPhone(phone);
      setNumber(digits);
      setEditing(false);
      setMessage("Your phone number has been saved.");
    } catch {
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const box = "rounded-lg bg-gray-500/10 px-4 py-4 text-lg outline-none disabled:opacity-60";
  const name = user?.displayName || user?.email || "Profile";

  return (
    <main className="mx-auto max-w-xl px-4 pb-16 pt-4">
      <Link href="/account" aria-label="Back to my account" className="inline-block p-2">
        <FaArrowLeft />
      </Link>

      {loading || (user && !ready) ? (
        <p className="p-8 text-center">Loading...</p>
      ) : !user ? (
        <div className="p-10 text-center">
          <p className="mb-4 opacity-80">Sign in to edit your phone number.</p>
          <button onClick={signIn} className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white">
            Sign in
          </button>
        </div>
      ) : (
        <form onSubmit={save} className="mt-4 text-center">
          <ProfileAvatar photoURL={user.photoURL} name={name} Badge={FaLock} />

          <h1 className="mt-6 text-3xl font-semibold">Current phone number</h1>
          <span className="mt-3 inline-block rounded-full bg-orange-500/15 px-4 py-1 text-sm font-semibold tracking-widest text-orange-500">
            {savedPhone ? "SAVED" : "NOT SET"}
          </span>

          <p className="mx-auto mt-4 max-w-md opacity-80">
            This is the phone number saved on your profile. You can change it by clicking the
            button below. We use it to reach you about your orders.
          </p>

          <div className="mt-8 grid grid-cols-[110px_1fr] gap-3 text-left">
            <select
              className={`${box} [&>option]:text-black`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={!editing}
              aria-label="Country code"
            >
              {CODES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              className={box}
              type="tel"
              inputMode="numeric"
              placeholder="Phone number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              disabled={!editing}
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          {message && <p className="mt-3 text-sm text-green-500">{message}</p>}

          <div className="mt-8 space-y-3">
            {editing ? (
              <>
                <button
                  disabled={saving}
                  className="w-full rounded-lg bg-orange-600 py-4 font-semibold tracking-widest text-white shadow disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save number"}
                </button>
                {savedPhone && (
                  <button
                    type="button"
                    onClick={() => {
                      const s = splitPhone(savedPhone);
                      setCode(s.code);
                      setNumber(s.number);
                      setError("");
                      setEditing(false);
                    }}
                    className="font-semibold opacity-70"
                  >
                    Cancel
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMessage("");
                  setEditing(true);
                }}
                className="w-full rounded-lg bg-orange-600 py-4 font-semibold tracking-widest text-white shadow"
              >
                Edit Phone Number
              </button>
            )}
          </div>

          <img src={LOGO} alt="Maestro Originals" className="mx-auto mt-16 h-14 w-auto" />
        </form>
      )}
    </main>
  );
}