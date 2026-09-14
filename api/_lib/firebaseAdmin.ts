import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let dbInstance: Firestore | undefined;

export function getAdminApp(): App {
  const existing = getApps();
  if (existing.length) return existing[0];

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),
    }),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

// Vercel's serverless Node runtime has known compatibility issues with the
// persistent gRPC/HTTP2 connections the Firestore Admin SDK uses by default.
// Forcing REST transport avoids that.
export function getAdminDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getAdminApp());
    dbInstance.settings({ preferRest: true });
  }
  return dbInstance;
}
