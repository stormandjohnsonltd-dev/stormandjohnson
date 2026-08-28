import { ProductManager } from "@/components/admin/ProductManager";
import {
  getAdminBrands,
  getAdminCategories,
  getAdminProducts,
} from "@/lib/adminQueries";
import {
  asId,
  serializeNamedRef,
  serializeSpecs,
  serializeStringList,
} from "@/lib/serialize";

export default async function AdminProductsPage() {
  const [productsResult, brandsResult, categoriesResult] = await Promise.all([
    getAdminProducts(),
    getAdminBrands(),
    getAdminCategories(),
  ]);

  const brands = brandsResult.data.map((b) => ({
    _id: asId(b._id),
    name: b.name,
    slug: b.slug,
  }));

  const categories = categoriesResult.data.map((c) => ({
    _id: asId(c._id),
    name: c.name,
    slug: c.slug,
  }));

  const products = productsResult.data.map((p) => {
    const brand = serializeNamedRef(
      p.brand as { _id?: unknown; name?: string; slug?: string } | null | undefined
    );
    const category = serializeNamedRef(
      p.category as { _id?: unknown; name?: string; slug?: string } | null | undefined
    );

    return {
      _id: asId(p._id),
      name: p.name,
      slug: p.slug,
      description: p.description,
      shortDescription: p.shortDescription,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      images: p.images ? [...p.images] : [],
      stock: p.stock,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
      features: serializeStringList(p.features),
      specs: serializeSpecs(p.specs),
      brand: brand ?? undefined,
      category: category ?? undefined,
    };
  });

  return (
    <div>
      <h1 className="sj-display text-[30px] font-semibold">Products</h1>
      <p className="mt-2 text-[14px] text-black/65">
        Create, edit and delete products. Admin can assign brand and category when adding a product.
      </p>
      <div className="mt-6">
        <ProductManager products={products} brands={brands} categories={categories} />
      </div>
    </div>
  );
}
