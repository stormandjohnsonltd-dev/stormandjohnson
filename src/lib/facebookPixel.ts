const STANDALONE_ID_PATTERN = /^[A-Za-z0-9._-]{5,40}$/;
const DIGIT_ID_PATTERN = /^\d{5,20}$/;

const STANDARD_EVENTS = new Set([
  "AddPaymentInfo",
  "AddToCart",
  "AddToWishlist",
  "CompleteRegistration",
  "Contact",
  "CustomizeProduct",
  "Donate",
  "FindLocation",
  "InitiateCheckout",
  "Lead",
  "PageView",
  "Purchase",
  "Schedule",
  "Search",
  "StartTrial",
  "SubmitApplication",
  "Subscribe",
  "ViewContent",
]);

const CODE_NOISE = new Set([
  "function",
  "script",
  "noscript",
  "facebook",
  "fbevents",
  "connect",
  "track",
  "trackcustom",
  "init",
  "pageview",
  "purchase",
  "lead",
  "viewcontent",
  "fbq",
  "https",
  "http",
  "true",
  "false",
]);

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    __sjFbConversionEvents?: string[];
  }
}

export type FacebookPixelConfig = {
  pixelIds: string[];
  conversionEvents: string[];
};

function asText(raw: unknown): string {
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw)) return raw.map((value) => String(value)).join("\n");
  return "";
}

function isSafePixelId(id: string) {
  if (!STANDALONE_ID_PATTERN.test(id)) return false;
  if (CODE_NOISE.has(id.toLowerCase())) return false;
  return true;
}

function addId(target: Set<string>, value: string) {
  const id = value.trim();
  if (isSafePixelId(id)) target.add(id);
}

function decodePixelSource(raw: string) {
  return raw
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'");
}

function imagePixelMatches(code: string) {
  return code.match(/(?:https?:\/\/)?(?:www\.)?facebook\.com\/tr\/?\?[^"'>\s]*/gi) || [];
}

function extractIdsFromCode(code: string, target: Set<string>) {
  const source = decodePixelSource(code);

  for (const match of source.matchAll(/fbq\s*\(\s*['"]init['"]\s*,\s*['"]([^'"]+)['"]/gi)) {
    addId(target, match[1] || "");
  }

  for (const match of source.matchAll(/fbq\s*\(\s*['"]init['"]\s*,\s*([A-Za-z0-9._-]{5,40})/gi)) {
    addId(target, match[1] || "");
  }

  for (const rawUrl of imagePixelMatches(source)) {
    try {
      const url = new URL(rawUrl, "https://www.facebook.com");
      addId(target, url.searchParams.get("id") || "");
    } catch {
      const id = /(?:^|[?&])id=([^&]+)/.exec(rawUrl)?.[1];
      if (id) addId(target, decodeURIComponent(id));
    }
  }
}

function extractEventsFromCode(code: string, target: Set<string>) {
  const source = decodePixelSource(code);

  for (const match of source.matchAll(/fbq\s*\(\s*['"](track|trackCustom)['"]\s*,\s*['"]([^'"]+)['"]/gi)) {
    const event = (match[2] || "").trim();
    if (event) target.add(event);
  }

  for (const rawUrl of imagePixelMatches(source)) {
    try {
      const url = new URL(rawUrl, "https://www.facebook.com");
      const event = url.searchParams.get("ev");
      if (event) target.add(event);
    } catch {
      const event = /(?:^|[?&])ev=([^&]+)/.exec(rawUrl)?.[1];
      if (event) target.add(decodeURIComponent(event));
    }
  }
}

function extractStandaloneIds(raw: string, target: Set<string>) {
  const chunks = raw.split(/[\s,;]+/);
  for (const chunk of chunks) {
    const id = chunk.trim();
    if (DIGIT_ID_PATTERN.test(id) || (STANDALONE_ID_PATTERN.test(id) && /[0-9]/.test(id))) {
      addId(target, id);
    }
  }
}

export function parseFacebookPixelConfig(input: {
  baseCode?: unknown;
  conversionCode?: unknown;
  pixelIds?: unknown;
} = {}): FacebookPixelConfig {
  const baseCode = asText(input.baseCode);
  const conversionCode = asText(input.conversionCode);
  const storedIds = asText(input.pixelIds);
  const combined = [baseCode, conversionCode, storedIds].filter(Boolean).join("\n");

  const pixelIds = new Set<string>();
  const conversionEvents = new Set<string>();

  extractIdsFromCode(combined, pixelIds);
  extractEventsFromCode(conversionCode, conversionEvents);

  if (!pixelIds.size) {
    extractStandaloneIds(combined, pixelIds);
  } else {
    extractStandaloneIds(storedIds, pixelIds);
    extractStandaloneIds(baseCode, pixelIds);
  }

  return {
    pixelIds: Array.from(pixelIds),
    conversionEvents: Array.from(conversionEvents),
  };
}

/** @deprecated Use parseFacebookPixelConfig. Kept for older call sites. */
export function parseFacebookPixelIds(raw: unknown): string[] {
  return parseFacebookPixelConfig({ pixelIds: raw, baseCode: raw }).pixelIds;
}

export function setFacebookConversionEvents(events: string[]) {
  if (typeof window === "undefined") return;
  window.__sjFbConversionEvents = events;
}

const pendingEvents: Array<{ event: string; params?: Record<string, unknown> }> = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

export function flushFacebookEventQueue() {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  while (pendingEvents.length) {
    const item = pendingEvents.shift();
    if (!item) break;
    const method = STANDARD_EVENTS.has(item.event) ? "track" : "trackCustom";
    window.fbq(method, item.event, item.params);
  }
}

function scheduleFacebookFlush() {
  if (typeof window === "undefined" || flushTimer) return;
  let attempts = 0;
  flushTimer = setInterval(() => {
    attempts += 1;
    if (typeof window.fbq === "function") {
      flushFacebookEventQueue();
      if (flushTimer) clearInterval(flushTimer);
      flushTimer = null;
    } else if (attempts >= 40) {
      if (flushTimer) clearInterval(flushTimer);
      flushTimer = null;
    }
  }, 250);
}

function conversionEventsForOrder() {
  const stored =
    typeof window !== "undefined" && Array.isArray(window.__sjFbConversionEvents)
      ? window.__sjFbConversionEvents
      : [];
  const orderEvents = stored.filter((event) => event && event !== "PageView" && event !== "ViewContent");
  return orderEvents.length ? orderEvents : ["Purchase"];
}

export function trackFacebookEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") {
    pendingEvents.push({ event, params });
    scheduleFacebookFlush();
    return;
  }
  flushFacebookEventQueue();
  const method = STANDARD_EVENTS.has(event) ? "track" : "trackCustom";
  window.fbq(method, event, params);
}

function productParams(input: {
  productId: string;
  productName: string;
  price: number;
  quantity?: number;
}) {
  const quantity = Math.max(1, Number(input.quantity) || 1);
  return {
    content_ids: [input.productId],
    content_name: input.productName,
    content_type: "product",
    num_items: quantity,
    value: input.price * quantity,
    currency: "NGN",
  };
}

export function trackAdvertisedProductView(input: {
  advertised: boolean;
  productId: string;
  productName: string;
  price: number;
}) {
  if (!input.advertised) return;
  trackFacebookEvent("ViewContent", productParams(input));
}

export function trackAdvertisedProductOrder(input: {
  advertised: boolean;
  productId: string;
  productName: string;
  price: number;
  quantity?: number;
}) {
  if (!input.advertised) return;
  const params = productParams(input);
  for (const event of conversionEventsForOrder()) {
    trackFacebookEvent(event, params);
  }
}
