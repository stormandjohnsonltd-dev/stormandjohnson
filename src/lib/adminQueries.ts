import { connectDB, isMongoConnectionError } from "@/lib/db";
import { getCatalogCache } from "@/lib/catalogCache";
import { Brand } from "@/models/Brand";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { Enquiry } from "@/models/Enquiry";
import { Distributor } from "@/models/Distributor";
import { ContactMessage } from "@/models/ContactMessage";
import { Company } from "@/models/Company";

export type AdminQueryResult<T> = {
  data: T;
  dbDown: boolean;
};

async function runQuery<T>(query: () => Promise<T>, fallback: unknown): Promise<AdminQueryResult<T>> {
  try {
    await connectDB();
    const data = await query();
    return { data, dbDown: false };
  } catch (err) {
    if (isMongoConnectionError(err)) return { data: fallback as T, dbDown: true };
    throw err;
  }
}

export async function getAdminBrands() {
  return runQuery(
    () => Brand.find({}).sort({ createdAt: -1 }).lean(),
    getCatalogCache().brands.map((b) => ({
      _id: b._id,
      name: b.name,
      slug: b.slug,
      isActive: true,
    }))
  );
}

export async function getAdminCategories() {
  return runQuery(
    () => Category.find({}).sort({ createdAt: -1 }).lean(),
    getCatalogCache().categories.map((c) => ({
      _id: c._id,
      name: c.name,
      slug: c.slug,
      isActive: true,
    }))
  );
}

export async function getAdminProducts() {
  return runQuery(
    () =>
      Product.find({})
        .populate("brand", "name slug")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
    getCatalogCache().products.map((p) => ({
      _id: p._id,
      name: p.name,
      slug: p.slug,
      description: p.description || p.shortDescription || "",
      shortDescription: p.shortDescription,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      images: p.images || [],
      stock: p.stock ?? 0,
      isFeatured: p.isFeatured ?? false,
      isActive: true,
      features: p.features || [],
      specs: p.specs || [],
      brand: p.brand,
      category: p.category,
    }))
  );
}

export async function getAdminEnquiries() {
  return runQuery(
    () =>
      Enquiry.find({})
        .populate("product", "slug name")
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(),
    []
  );
}

export async function getAdminDistributors() {
  return runQuery(() => Distributor.find({}).sort({ createdAt: -1 }).limit(50).lean(), []);
}

export async function getAdminContacts() {
  return runQuery(() => ContactMessage.find({}).sort({ createdAt: -1 }).limit(50).lean(), []);
}

export async function getAdminCompany() {
  return runQuery(() => Company.findOne().lean(), null);
}
