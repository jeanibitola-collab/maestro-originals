"use client";

import { useEffect, useState } from "react";
import { FaGoogle, FaXmark } from "react-icons/fa6";
import { useAuth } from "@/context/AuthContext";

function friendlyError(e: unknown) {
  const code = (e as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function SignInModal() {
  const {
    user,
    signInOpen,
    closeSignIn,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  // Close the card once the customer is signed in
  useEffect(() => {
    if (user && signInOpen) closeSignIn();
  }, [user, signInOpen, closeSignIn]);

  // Clear the form when it closes, and close with the Escape key
  useEffect(() => {
    if (!signInOpen) {
      setPassword("");
      setError("");
      setInfo("");
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSignIn();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [signInOpen, closeSignIn]);

  if (!signInOpen) return null;

  async function run(action: () => Promise<void>) {
    setError("");
    setInfo("");
    setBusy(true);
    try {
      await action();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }

  const field =
    "w-full rounded-lg border bg-transparent px-4 py-3 outline-none placeholder:text-gray-500 focus:border-orange-600";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={closeSignIn}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-[var(--background)] p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeSignIn}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-500/20"
        >
          <FaXmark />
        </button>

        <h2 className="text-center font-serif text-3xl">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="mt-2 text-center text-sm opacity-80">
          {mode === "signin" ? "New to Maestro Originals?" : "Already have an account?"}{" "}
          <button
            className="underline"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
              setInfo("");
            }}
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>

        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            run(() =>
              mode === "signin"
                ? signInWithEmail(email, password)
                : signUpWithEmail(name, email, password)
            );
          }}
        >
          {mode === "signup" && (
            <input
              className={field}
              placeholder="Full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            className={field}
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={field}
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}
          {info && <p className="text-sm text-green-500">{info}</p>}

          <button
            disabled={busy}
            className="w-full rounded-full bg-orange-600 py-3 font-semibold text-white transition-colors hover:bg-orange-500 disabled:opacity-60"
          >
            {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>

          {mode === "signin" && (
            <button
              type="button"
              className="block w-full text-center text-sm underline"
              onClick={() =>
                email
                  ? run(async () => {
                      await resetPassword(email);
                      setInfo("Password reset email sent. Check your inbox.");
                    })
                  : setError("Enter your email above first.")
              }
            >
              Forgot your password?
            </button>
          )}
        </form>

        <div className="my-6 flex items-center gap-3 text-sm opacity-60">
          <span className="h-px flex-1 bg-current opacity-30" />
          or
          <span className="h-px flex-1 bg-current opacity-30" />
        </div>

        <button
          onClick={() => run(signInWithGoogle)}
          disabled={busy}
          className="flex w-full items-center justify-center gap-3 rounded-full border py-3 font-medium transition-colors hover:bg-gray-500/20 disabled:opacity-60"
        >
          <FaGoogle /> Continue with Google
        </button>
      </div>
    </div>
  );
}