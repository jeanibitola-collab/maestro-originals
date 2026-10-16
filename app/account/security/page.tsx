"use client";

import { useState } from "react";
import Link from "next/link";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import { FaArrowLeft, FaEye, FaEyeSlash, FaLock } from "react-icons/fa6";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import ProfileAvatar from "@/components/ProfileAvatar";

const LOGO = "/maestro-logo-gold.svg"; // the gold logo file in your public folder

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        autoComplete={autoComplete}
        className="peer w-full rounded-lg border bg-transparent px-4 py-5 pr-14 text-lg outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600"
      />
      <label className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 bg-background px-1 text-lg opacity-60 transition-all peer-focus:top-0 peer-focus:text-sm peer-focus:text-orange-600 peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-sm">
        {label} *
      </label>
      <button
        type="button"
        onClick={() => setShow(!show)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-70"
      >
        {show ? <FaEye /> : <FaEyeSlash />}
      </button>
    </div>
  );
}

export default function PasswordSettingsPage() {
  const { user, loading, signIn } = useAuth();
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const usesPassword = user?.providerData.some((p) => p.providerId === "password");
  const name = user?.displayName || user?.email || "Profile";

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !user.email) return;
    setError("");
    setMessage("");

    if (!current) return setError("Please enter your current password.");
    if (newPw.length < 6) return setError("Your new password must be at least 6 characters.");
    if (newPw !== confirmPw) return setError("The new passwords don't match.");
    if (newPw === current) return setError("Your new password must be different from your current one.");

    setSaving(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, current);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPw);
      setCurrent("");
      setNewPw("");
      setConfirmPw("");
      setMessage("Your password has been updated.");
    } catch (err) {
      const code = (err as { code?: string })?.code ?? "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("Your current password is incorrect.");
      } else if (code === "auth/weak-password") {
        setError("That password is too weak. Try a longer one.");
      } else if (code === "auth/requires-recent-login") {
        setError("Please sign out, sign in again, and then change your password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Could not update your password. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function sendReset() {
    if (!user?.email) return;
    setError("");
    setMessage("");
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage("Password reset email sent. Check your inbox.");
    } catch {
      setError("Could not send the email. Please try again.");
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 pb-16 pt-4">
      <Link href="/account" aria-label="Back to my account" className="inline-block p-2">
        <FaArrowLeft />
      </Link>

      {loading ? (
        <p className="p-8 text-center">Loading...</p>
      ) : !user ? (
        <div className="p-10 text-center">
          <p className="mb-4 opacity-80">Sign in to change your password.</p>
          <button onClick={signIn} className="rounded-full bg-orange-600 px-6 py-3 font-semibold text-white">
            Sign in
          </button>
        </div>
      ) : (
        <div className="mt-4 text-center">
          <ProfileAvatar photoURL={user.photoURL} name={name} Badge={FaLock} />
          <h1 className="mt-6 text-3xl font-semibold">Password Settings</h1>

          {usesPassword ? (
            <form onSubmit={save} className="mt-10 space-y-6 text-left">
              <PasswordField label="Current Password" value={current} onChange={setCurrent} autoComplete="current-password" />
              <PasswordField label="New Password" value={newPw} onChange={setNewPw} autoComplete="new-password" />
              <PasswordField label="Confirm Password" value={confirmPw} onChange={setConfirmPw} autoComplete="new-password" />

              {error && <p className="text-center text-sm text-red-500">{error}</p>}
              {message && <p className="text-center text-sm text-green-500">{message}</p>}

              <button
                disabled={saving}
                className="w-full rounded-lg bg-orange-600 py-4 font-semibold tracking-widest text-white shadow disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>

              <button
                type="button"
                onClick={sendReset}
                className="block w-full text-center text-sm underline opacity-80"
              >
                Forgot your current password? Send a reset email
              </button>
            </form>
          ) : (
            <p className="mx-auto mt-8 max-w-md opacity-80">
              You sign in with Google, so your password is managed in your Google account.
              There is no separate password to change here.
            </p>
          )}

          <img src={LOGO} alt="Maestro Originals" className="mx-auto mt-16 h-14 w-auto" />
        </div>
      )}
    </main>
  );
}