import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "./firebaseAdmin.js";

export async function requireUser(req: {
  headers: Record<string, string | string[] | undefined>;
}) {
  const header = req.headers.authorization;
  const value = Array.isArray(header) ? header[0] : header;
  if (!value?.startsWith("Bearer ")) {
    throw new Error("UNAUTHENTICATED");
  }
  const idToken = value.slice("Bearer ".length);
  return getAuth(getAdminApp()).verifyIdToken(idToken);
}
