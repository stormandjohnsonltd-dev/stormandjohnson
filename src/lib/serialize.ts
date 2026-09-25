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

function asText(value: unknown) {
  return value == null ? "" : String(value);
}

export type SerializedCompany = {
  name: string;
  tagline: string;
  about: string;
  mission: string;
  vision: string;
  officeLine: string;
  whatsappNumbers: string[];
  email: string;
  address: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  facebookPixelIds: string[];
  facebookPixelBaseCode: string;
  facebookConversionCode: string;
};

export function serializeCompany(row: unknown): SerializedCompany | null {
  if (!row || typeof row !== "object") return null;
  const company = row as Record<string, unknown>;
  const social =
    company.socialLinks && typeof company.socialLinks === "object"
      ? (company.socialLinks as Record<string, unknown>)
      : {};

  return {
    name: asText(company.name),
    tagline: asText(company.tagline),
    about: asText(company.about),
    mission: asText(company.mission),
    vision: asText(company.vision),
    officeLine: asText(company.officeLine),
    whatsappNumbers: serializeStringList(company.whatsappNumbers),
    email: asText(company.email),
    address: asText(company.address),
    socialLinks: {
      facebook: asText(social.facebook),
      instagram: asText(social.instagram),
      twitter: asText(social.twitter),
      linkedin: asText(social.linkedin),
    },
    facebookPixelIds: serializeStringList(company.facebookPixelIds),
    facebookPixelBaseCode: asText(company.facebookPixelBaseCode),
    facebookConversionCode: asText(company.facebookConversionCode),
  };
}
