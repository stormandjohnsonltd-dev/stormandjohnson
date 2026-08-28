import fs from "fs";
import path from "path";
import type { NamedRef, ProductCard, ProductDetail } from "@/types/catalog";

export type CachedProduct = ProductCard & {
  shortDescription?: string;
  isFeatured?: boolean;
  stock?: number;
  description?: string;
  compareAtPrice?: number;
  specs?: Array<{ label: string; value: string }>;
  features?: string[];
};

export type CatalogCacheData = {
  updatedAt: string;
  brands: NamedRef[];
  categories: NamedRef[];
  products: CachedProduct[];
};

const CACHE_DIR = path.join(process.cwd(), ".data");
const CACHE_FILE = path.join(CACHE_DIR, "catalog-cache.json");

declare global {
  // eslint-disable-next-line no-var
  var __sjCatalogCache: CatalogCacheData | null | undefined;
}

function emptyCache(): CatalogCacheData {
  return {
    updatedAt: new Date(0).toISOString(),
    brands: [],
    categories: [],
    products: [],
  };
}

function readFromDisk(): CatalogCacheData | null {
  try {
    if (!fs.existsSync(CACHE_FILE)) return null;
    const raw = fs.readFileSync(CACHE_FILE, "utf8");
    const parsed = JSON.parse(raw) as CatalogCacheData;
    if (!parsed || !Array.isArray(parsed.products)) return null;
    return {
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      brands: parsed.brands || [],
      categories: parsed.categories || [],
      products: parsed.products || [],
    };
  } catch {
    return null;
  }
}

function writeToDisk(data: CatalogCacheData) {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write catalog cache:", err);
  }
}

export function getCatalogCache(): CatalogCacheData {
  if (global.__sjCatalogCache) return global.__sjCatalogCache;
  const fromDisk = readFromDisk();
  global.__sjCatalogCache = fromDisk || emptyCache();
  return global.__sjCatalogCache;
}

export function saveCatalogCache( partial: Partial<CatalogCacheData>) {
  const current = getCatalogCache();
  const next: CatalogCacheData = {
    updatedAt: new Date().toISOString(),
    brands: partial.brands ?? current.brands,
    categories: partial.categories ?? current.categories,
    products: partial.products ?? current.products,
  };
  global.__sjCatalogCache = next;
  writeToDisk(next);
  return next;
}

export function upsertCachedProducts(products: CachedProduct[]) {
  if (!products.length) return getCatalogCache();
  const current = getCatalogCache();
  const map = new Map(current.products.map((p) => [p.slug, p]));
  for (const product of products) {
    map.set(product.slug, { ...map.get(product.slug), ...product });
  }
  return saveCatalogCache({ products: Array.from(map.values()) });
}

export function removeCachedProduct(slug: string) {
  const current = getCatalogCache();
  return saveCatalogCache({
    products: current.products.filter((p) => p.slug !== slug),
  });
}

export function filterCachedProducts(input: {
  q?: string;
  brandSlug?: string;
  categorySlug?: string;
  sort?: "featured" | "price_asc" | "price_desc" | "newest";
  featuredOnly?: boolean;
  limit?: number;
} = {}): CachedProduct[] {
  let list = [...getCatalogCache().products];

  if (input.featuredOnly) {
    list = list.filter((p) => p.isFeatured);
  }

  if (input.q?.trim()) {
    const q = input.q.trim().toLowerCase();
    list = list.filter((p) => {
      const hay = `${p.name} ${p.shortDescription || ""} ${p.brand?.name || ""} ${p.category?.name || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }

  if (input.brandSlug) {
    list = list.filter((p) => p.brand?.slug === input.brandSlug);
  }

  if (input.categorySlug) {
    list = list.filter((p) => p.category?.slug === input.categorySlug);
  }

  if (input.sort === "price_asc") list.sort((a, b) => a.price - b.price);
  else if (input.sort === "price_desc") list.sort((a, b) => b.price - a.price);
  else if (input.sort === "newest") list.sort((a, b) => b._id.localeCompare(a._id));
  else {
    list.sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured) || a.name.localeCompare(b.name));
  }

  return list.slice(0, input.limit ?? 60);
}

export function getCachedProductBySlug(slug: string): ProductDetail | null {
  const product = getCatalogCache().products.find((p) => p.slug === slug);
  if (!product) return null;
  return {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    description: product.description || product.shortDescription || product.name,
    shortDescription: product.shortDescription,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    images: product.images,
    specs: product.specs,
    features: product.features,
    brand: product.brand ?? null,
    category: product.category ?? null,
  };
}

export function getCachedTopSelling(limit = 4): CachedProduct[] {
  return [...getCatalogCache().products]
    .sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0) || b.price - a.price)
    .slice(0, limit);
}
