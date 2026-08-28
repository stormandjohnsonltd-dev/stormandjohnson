import { isMongoConnectionError } from "@/lib/db";

function collectErrorText(err: unknown): string {
  const parts: string[] = [];
  const seen = new Set<unknown>();
  let current: unknown = err;

  while (current && !seen.has(current)) {
    seen.add(current);

    if (typeof current === "string") {
      parts.push(current);
      break;
    }

    if (typeof current === "object") {
      if ("message" in current && current.message) parts.push(String(current.message));
      if ("code" in current && current.code) parts.push(String(current.code));
      if ("syscall" in current && current.syscall) parts.push(String(current.syscall));
      current = "cause" in current ? current.cause : undefined;
      continue;
    }

    break;
  }

  return parts.join(" ");
}

export function isNetworkError(err: unknown) {
  const text = collectErrorText(err).toLowerCase();
  if (!text) return false;

  return (
    text.includes("econnrefused") ||
    text.includes("econnreset") ||
    text.includes("enotfound") ||
    text.includes("etimedout") ||
    text.includes("network socket") ||
    text.includes("socket disconnected") ||
    text.includes("tls connection") ||
    text.includes("fetch failed") ||
    text.includes("getaddrinfo") ||
    text.includes("googleapis.com") ||
    text.includes("oauth2/v4/token") ||
    text.includes("firebasestorage") ||
    text.includes("unable to detect a project id") ||
    text.includes("service unavailable")
  );
}

/** Mongo unreachable or outbound network (Firebase, Google APIs, SMTP, etc.) */
export function isServiceUnavailableError(err: unknown) {
  return isMongoConnectionError(err) || isNetworkError(err);
}
