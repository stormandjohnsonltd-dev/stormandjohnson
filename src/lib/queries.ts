import { Product } from "@/models/Product";
import { Brand } from "@/models/Brand";
import { Category } from "@/models/Category";
import { Company } from "@/models/Company";
import { connectDB, isMongoConnectionError } from "@/lib/db";
import {
  filterCachedProducts,
  getCachedProductBySlug,
  getCachedTopSelling,
  getCatalogCache,
  saveCatalogCache,
  upsertCachedProducts,
  type CachedProduct,
} from "@/lib/catalogCache";
import { asId, serializeNamedRef, serializeSpecs, serializeStringList } from "@/lib/serialize";
import type { NamedRef, ProductCard, ProductDetail } from "@/types/catalog";
import type { FilterQuery } from "mongoose";
import type { IProduct } from "@/models/Product";

type ProductSort = "featured" | "price_asc" | "price_desc" | "newest";

function mapProductCard(p: {
  _id: unknown;
  name: string;
  slug: string;
  price: number;
  images?: string[];
  shortDescription?: string;
  isFeatured?: boolean;
  stock?: number;
  description?: string;
  compareAtPrice?: number;
  specs?: Array<{ label: string; value: string }>;
  features?: string[];
  brand?: NamedRef;
  category?: NamedRef;
}): CachedProduct {
  return {
    _id: asId(p._id),
    name: p.name,
    slug: p.slug,
    price: p.price,
    images: p.images ? [...p.images] : undefined,
    shortDescription: p.shortDescription,
    isFeatured: p.isFeatured,
    stock: p.stock,
    description: p.description,
    compareAtPrice: p.compareAtPrice,
    specs: serializeSpecs(p.specs),
    features: serializeStringList(p.features),
    brand: serializeNamedRef(p.brand),
    category: serializeNamedRef(p.category),
  };
}

async function refreshCatalogSnapshot() {
  try {
    const [brands, categories, products] = await Promise.all([
      Brand.find({ isActive: true }).sort({ name: 1 }).lean(),
      Category.find({ isActive: true }).sort({ name: 1 }).lean(),
      Product.find({ isActive: true })
        .populate("brand", "name slug")
        .populate("category", "name slug")
        .sort({ isFeatured: -1, createdAt: -1 })
        .limit(200)
        .lean(),
    ]);

    saveCatalogCache({
      brands: brands.map((b) => ({
        _id: asId(b._id),
        name: b.name,
        slug: b.slug,
      })),
      categories: categories.map((c) => ({
        _id: asId(c._id),
        name: c.name,
        slug: c.slug,
      })),
      products: products.map((p) =>
        mapProductCard({
          ...(p as unknown as IProduct & { _id: unknown }),
          brand: p.brand as unknown as NamedRef | undefined,
          category: p.category as unknown as NamedRef | undefined,
        })
      ),
    });
  } catch (err) {
    if (!isMongoConnectionError(err)) throw err;
  }
}

export async function getBrands(): Promise<NamedRef[]> {
  try {
    await connectDB();
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 }).lean();
    const mapped = brands.map((b) => ({
      _id: asId(b._id),
      name: b.name,
      slug: b.slug,
    }));
    saveCatalogCache({ brands: mapped });
    return mapped;
  } catch (err) {
    if (!isMongoConnectionError(err)) throw err;
    return getCatalogCache().brands;
  }
}

export async function getCategories(): Promise<NamedRef[]> {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
    const mapped = categories.map((c) => ({
      _id: asId(c._id),
      name: c.name,
      slug: c.slug,
    }));
    saveCatalogCache({ categories: mapped });
    return mapped;
  } catch (err) {
    if (!isMongoConnectionError(err)) throw err;
    return getCatalogCache().categories;
  }
}

export async function getCompany() {
  try {
    await connectDB();
    return Company.findOne().lean();
  } catch (err) {
    if (!isMongoConnectionError(err)) throw err;
    return null;
  }
}

export async function getProducts(input: {
  q?: string;
  brandSlug?: string;
  categorySlug?: string;
  sort?: ProductSort;
  featuredOnly?: boolean;
  limit?: number;
} = {}): Promise<Array<ProductCard & { shortDescription?: string; isFeatured?: boolean }>> {
  try {
    await connectDB();

    const filter: FilterQuery<IProduct> = { isActive: true };

    if (input.featuredOnly) filter.isFeatured = true;

    if (input.q && input.q.trim().length > 0) {
      filter.$text = { $search: input.q.trim() };
    }

    if (input.brandSlug) {
      const brand = await Brand.findOne({ slug: input.brandSlug, isActive: true }).select("_id");
      if (brand?._id) filter.brand = brand._id;
    }

    if (input.categorySlug) {
      const category = await Category.findOne({
        slug: input.categorySlug,
        isActive: true,
      }).select("_id");
      if (category?._id) filter.category = category._id;
    }

    const sort: Record<string, 1 | -1> = {};
    if (input.sort === "price_asc") sort.price = 1;
    else if (input.sort === "price_desc") sort.price = -1;
    else if (input.sort === "featured") {
      sort.isFeatured = -1;
      sort.createdAt = -1;
    } else sort.createdAt = -1;

    const products = await Product.find(filter)
      .populate("brand", "name slug")
      .populate("category", "name slug")
      .sort(sort)
      .limit(input.limit ?? 60)
      .lean();

    const mapped = products.map((p) =>
      mapProductCard({
        ...(p as unknown as IProduct & { _id: unknown }),
        brand: p.brand as unknown as NamedRef | undefined,
        category: p.category as unknown as NamedRef | undefined,
      })
    );

    upsertCachedProducts(mapped);

    // Keep a fuller offline snapshot when loading the main catalogue.
    if (!input.featuredOnly && !input.q && !input.brandSlug && !input.categorySlug) {
      void refreshCatalogSnapshot().catch(() => undefined);
    }

    return mapped;
  } catch (err) {
    if (!isMongoConnectionError(err)) throw err;
    return filterCachedProducts(input);
  }
}

export async function getFeaturedProducts(limit = 4) {
  return getProducts({ featuredOnly: true, sort: "featured", limit });
}

export async function getTopSellingProducts(limit = 4) {
  try {
    await connectDB();
    const products = await Product.find({ isActive: true })
      .populate("brand", "name slug")
      .populate("category", "name slug")
      .sort({ stock: -1, price: -1 })
      .limit(limit)
      .lean();

    const mapped = products.map((p) =>
      mapProductCard({
        ...(p as unknown as IProduct & { _id: unknown }),
        brand: p.brand as unknown as NamedRef | undefined,
        category: p.category as unknown as NamedRef | undefined,
      })
    );
    upsertCachedProducts(mapped);
    return mapped;
  } catch (err) {
    if (!isMongoConnectionError(err)) throw err;
    return getCachedTopSelling(limit);
  }
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  try {
    await connectDB();
    const product = (await Product.findOne({ slug, isActive: true })
      .populate("brand", "name slug")
      .populate("category", "name slug")
      .lean()) as unknown as
      | (IProduct & {
          _id: unknown;
          brand?: NamedRef;
          category?: NamedRef;
        })
      | null;

    if (!product) return getCachedProductBySlug(slug);

    const detail: ProductDetail = {
      _id: asId(product._id),
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      images: product.images ? [...product.images] : undefined,
      specs: serializeSpecs(product.specs),
      features: serializeStringList(product.features),
      brand: serializeNamedRef(product.brand),
      category: serializeNamedRef(product.category),
    };

    upsertCachedProducts([
      {
        ...detail,
        isFeatured: product.isFeatured,
        stock: product.stock,
      },
    ]);

    return detail;
  } catch (err) {
    if (!isMongoConnectionError(err)) throw err;
    return getCachedProductBySlug(slug);
  }
}

/** Force-refresh cache from Mongo (used after seed / admin writes). */
export async function warmCatalogCache() {
  try {
    await connectDB();
    await refreshCatalogSnapshot();
  } catch (err) {
    if (!isMongoConnectionError(err)) throw err;
  }
}
