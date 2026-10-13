"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: () => void; // opens the sign-in card
  logOut: () => Promise<void>;
  signInOpen: boolean;
  closeSignIn: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Save the customer's details to Firestore
async function saveUser(u: User, name?: string) {
  const displayName = name ?? u.displayName;
  try {
    await setDoc(
      doc(db, "users", u.uid),
      {
        ...(displayName ? { name: displayName } : {}),
        email: u.email,
        photoURL: u.photoURL,
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (e) {
    console.error("Could not save user to Firestore", e);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signInOpen, setSignInOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) saveUser(u);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(() => setSignInOpen(true), []);
  const closeSignIn = useCallback(() => setSignInOpen(false), []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    await saveUser(cred.user, name);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        logOut,
        signInOpen,
        closeSignIn,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}