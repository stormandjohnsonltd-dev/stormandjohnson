import slugify from "slugify";

export function createSlug(text: string) {
  return slugify(text, { lower: true, strict: true });
}

export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export const formatCurrency = formatNaira;

export function whatsappLink(phone: string, message?: string) {
  const clean = phone.replace(/\D/g, "");
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${clean}${text}`;
}

export const whatsappUrl = whatsappLink;

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
