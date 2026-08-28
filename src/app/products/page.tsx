import { getBrands, getCategories, getProducts } from "@/lib/queries";
import { ProductsCatalog } from "@/components/ProductsCatalog";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const q = typeof resolved?.q === "string" ? resolved.q : "";
  const brand = typeof resolved?.brand === "string" ? resolved.brand : "";
  const category = typeof resolved?.category === "string" ? resolved.category : "";
  const sort = typeof resolved?.sort === "string" ? resolved.sort : "featured";

  const [brands, categories, products] = await Promise.all([
    getBrands(),
    getCategories(),
    getProducts({ sort: "featured", limit: 100 }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div>
        <h1 className="sj-display text-[32px] font-semibold">Products</h1>
        <p className="mt-2 text-[14px] text-black/65">
          Search and filter instantly by brand, category or keyword.
        </p>
      </div>

      <div className="mt-7">
        <ProductsCatalog
          products={products}
          brands={brands}
          categories={categories}
          initialQ={q}
          initialBrand={brand}
          initialCategory={category}
          initialSort={sort}
        />
      </div>
    </div>
  );
}
