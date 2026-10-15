import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Server-only access to Firebase. Never import this file in a client component.
export function getAdmin() {
  let app = getApps()[0];

  if (!app) {
    const projectId =
      process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Firebase Admin keys are missing. Check FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.");
    }

    app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }

  return { auth: getAuth(app), db: getFirestore(app) };
}