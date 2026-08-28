import { randomUUID } from "crypto";
import {
  getFirebaseAdminBucket,
  isFirebaseAdminConfigured,
} from "@/lib/firebaseAdmin";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function safeFilename(name: string) {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")).toLowerCase() : ".jpg";
  const base = name
    .slice(0, name.length - ext.length)
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 60);
  return `${Date.now()}-${randomUUID().slice(0, 8)}-${base || "image"}${ext}`;
}

async function uploadToFirebase(buffer: Buffer, filename: string, mimeType: string) {
  const bucket = getFirebaseAdminBucket();
  const destination = `products/${filename}`;
  const file = bucket.file(destination);
  const token = randomUUID();

  await file.save(buffer, {
    metadata: {
      contentType: mimeType,
      cacheControl: "public,max-age=31536000",
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
    resumable: false,
  });

  const encoded = encodeURIComponent(destination);
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encoded}?alt=media&token=${token}`;
  return url;
}

export async function uploadProductImageServer(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, WebP or GIF images are allowed.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }

  if (!isFirebaseAdminConfigured()) {
    throw new Error(
      "Firebase Admin is not configured. Add firebase-service-account.json to the project root and restart npm run dev."
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = safeFilename(file.name);
  const mimeType = file.type || "image/jpeg";

  return uploadToFirebase(buffer, filename, mimeType);
}

import { isServiceUnavailableError } from "@/lib/networkErrors";

export function explainUploadError(err: unknown): string {
  if (isServiceUnavailableError(err)) return "";

  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("storage/unauthorized") || message.includes("Permission denied")) {
    return "Firebase Storage blocked the upload. Check Storage rules allow writes to products/.";
  }
  if (message.includes("Firebase Admin is not configured")) {
    return message;
  }
  return "Image upload failed.";
}
