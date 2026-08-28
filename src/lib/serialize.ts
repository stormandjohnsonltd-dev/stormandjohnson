import type { NamedRef } from "@/types/catalog";

export function asId(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "toString" in value) {
    return String((value as { toString: () => string }).toString());
  }
  return String(value);
}

export function serializeNamedRef(
  ref: { _id?: unknown; name?: string; slug?: string } | null | undefined
): NamedRef | null {
  if (!ref?.name) return null;
  return {
    _id: asId(ref._id),
    name: ref.name,
    slug: ref.slug || "",
  };
}

export function serializeSpecs(
  specs: unknown
): Array<{ label: string; value: string }> {
  if (!Array.isArray(specs)) return [];
  return specs
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as { label?: unknown; value?: unknown };
      const label = String(row.label ?? "").trim();
      const value = String(row.value ?? "").trim();
      if (!label || !value) return null;
      return { label, value };
    })
    .filter((item): item is { label: string; value: string } => item !== null);
}

export function serializeStringList(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values.map((v) => String(v)).filter(Boolean);
}
