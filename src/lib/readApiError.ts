export function isServiceUnavailable(res: Response) {
  return res.status === 503;
}

export async function readApiError(res: Response, fallback: string): Promise<string | null> {
  if (isServiceUnavailable(res)) return null;

  try {
    const data = (await res.json()) as { error?: unknown };
    return typeof data.error === "string" ? data.error : fallback;
  } catch {
    return fallback;
  }
}
