import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey);

export const app = initializeApp(
  isFirebaseConfigured ? firebaseConfig : { apiKey: "demo-key", projectId: "demo" },
);
export const auth = getAuth(app);
// Some networks hang the default WebChannel transport for write acks even
// though the listen/read stream works fine. Long-polling avoids that.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
