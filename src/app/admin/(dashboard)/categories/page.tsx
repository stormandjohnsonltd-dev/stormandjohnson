import { getAdminCategories } from "@/lib/adminQueries";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { asId } from "@/lib/serialize";

export default async function AdminCategoriesPage() {
  const { data: categoriesRaw } = await getAdminCategories();
  const categories = categoriesRaw.map((c) => ({
    _id: asId(c._id),
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    isActive: c.isActive,
  }));

  return (
    <div>
      <h1 className="sj-display text-[30px] font-semibold">Categories</h1>
      <p className="mt-2 text-[14px] text-black/65">
        Manage the product categories used for filtering and product organization.
      </p>
      <div className="mt-6">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
