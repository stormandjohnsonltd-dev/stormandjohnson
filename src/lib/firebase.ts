import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.FIREBASE_APP_ID || "",
};

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.storageBucket &&
      firebaseConfig.appId
  );
}

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured. Add FIREBASE_* values to .env.local and restart npm run dev.");
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseStorage(): FirebaseStorage {
  const app = getFirebaseApp();
  const bucket = firebaseConfig.storageBucket;
  // Explicit bucket avoids wrong-default issues with *.firebasestorage.app
  return getStorage(app, `gs://${bucket}`);
}

export async function uploadProductImage(file: File): Promise<string> {
  const storage = getFirebaseStorage();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, {
    contentType: file.type || "image/jpeg",
    cacheControl: "public,max-age=31536000",
  });
  return getDownloadURL(storageRef);
}

export function explainFirebaseUploadError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("storage/unauthorized") || message.includes("Permission denied")) {
    return "Firebase Storage blocked the upload. In Firebase Console → Storage → Rules, allow writes to products/ (then publish).";
  }
  if (message.includes("storage/retry-limit-exceeded") || message.includes("network")) {
    return "Upload failed due to network. Check your connection and try again.";
  }
  if (message.includes("not configured")) {
    return message;
  }
  return message || "Image upload failed.";
}
