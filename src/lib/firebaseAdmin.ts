import fs from "fs";
import path from "path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import type { ServiceAccount } from "firebase-admin/app";

function readJsonFile(filePath: string): ServiceAccount | null {
  try {
    const absolute = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    const raw = fs.readFileSync(absolute, "utf8");
    return JSON.parse(raw) as ServiceAccount;
  } catch (err) {
    console.error(`Failed to read Firebase service account from ${filePath}:`, err);
    return null;
  }
}

function getServiceAccount(): ServiceAccount | null {
  const pathEnv = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
  if (pathEnv) {
    const fromPath = readJsonFile(pathEnv);
    if (fromPath) return fromPath;
  }

  const defaultPath = path.join(process.cwd(), "firebase-service-account.json");
  if (fs.existsSync(defaultPath)) {
    const fromDefault = readJsonFile(defaultPath);
    if (fromDefault) return fromDefault;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ServiceAccount;
  } catch {
    return null;
  }
}

export function isFirebaseAdminConfigured() {
  return Boolean(getServiceAccount() && process.env.FIREBASE_STORAGE_BUCKET);
}

export function getFirebaseAdminBucket() {
  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      "Firebase Admin is not configured. Add firebase-service-account.json or set FIREBASE_SERVICE_ACCOUNT_PATH."
    );
  }

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  }

  return getStorage().bucket();
}
