import { getAdminBrands } from "@/lib/adminQueries";
import { BrandManager } from "@/components/admin/BrandManager";
import { asId } from "@/lib/serialize";

export default async function AdminBrandsPage() {
  const { data: brandsRaw } = await getAdminBrands();
  const brands = brandsRaw.map((b) => ({
    _id: asId(b._id),
    name: b.name,
    slug: b.slug,
    description: b.description,
    logo: b.logo,
    isActive: b.isActive,
  }));

  return (
    <div>
      <h1 className="sj-display text-[30px] font-semibold">Brands</h1>
      <p className="mt-2 text-[14px] text-black/65">
        Create selectable brands for products and disable any brand no longer in use.
      </p>
      <div className="mt-6">
        <BrandManager brands={brands} />
      </div>
    </div>
  );
}
