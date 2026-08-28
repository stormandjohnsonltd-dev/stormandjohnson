"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { isServiceUnavailable, readApiError } from "@/lib/readApiError";
import { ImageUploader, type ImageUploaderHandle } from "@/components/admin/ImageUploader";

type Brand = { _id: string; name: string; slug: string };
type Category = { _id: string; name: string; slug: string };
type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images?: string[];
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  features?: string[];
  specs?: Array<{ label: string; value: string }>;
  brand?: Brand;
  category?: Category;
};

type ProductFormState = {
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  compareAtPrice: string;
  imageUrls: string[];
  brandId: string;
  categoryId: string;
  stock: string;
  isFeatured: boolean;
  isActive: boolean;
  features: string;
  specs: string;
};

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  shortDescription: "",
  price: "",
  compareAtPrice: "",
  imageUrls: [],
  brandId: "",
  categoryId: "",
  stock: "0",
  isFeatured: false,
  isActive: true,
  features: "",
  specs: "",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-black/60">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls = "w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]";

export function ProductManager({
  products,
  brands,
  categories,
}: {
  products: Product[];
  brands: Brand[];
  categories: Category[];
}) {
  const router = useRouter();
  const imageUploaderRef = useRef<ImageUploaderHandle>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitPhase, setSubmitPhase] = useState<"idle" | "uploading" | "saving">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<"name" | "price" | "stock" | "status">("name");

  const canSubmit = useMemo(
    () =>
      !!form.name.trim() &&
      !!form.description.trim() &&
      !!form.price &&
      !!form.brandId &&
      !!form.categoryId,
    [form]
  );

  const sortedProducts = useMemo(() => {
    const list = [...products];
    list.sort((a, b) => {
      if (sortKey === "price") return a.price - b.price;
      if (sortKey === "stock") return a.stock - b.stock;
      if (sortKey === "status") {
        return Number(b.isActive) - Number(a.isActive) || a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [products, sortKey]);

  function openCreate() {
    setEditingSlug(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  }

  function loadProduct(product: Product) {
    setEditingSlug(product.slug);
    setFormError(null);
    setForm({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription || "",
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
      imageUrls: product.images || [],
      brandId: product.brand?._id || "",
      categoryId: product.category?._id || "",
      stock: String(product.stock ?? 0),
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      features: product.features?.join("\n") || "",
      specs: product.specs?.map((s) => `${s.label}:${s.value}`).join("\n") || "",
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingSlug(null);
    setForm(emptyForm);
    setFormError(null);
  }

  function buildPayload(imageUrls: string[]) {
    return {
      name: form.name,
      description: form.description,
      shortDescription: form.shortDescription || undefined,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      images: imageUrls,
      brandId: form.brandId,
      categoryId: form.categoryId,
      stock: Number(form.stock || 0),
      isFeatured: form.isFeatured,
      isActive: form.isActive,
      features: form.features
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      specs: form.specs
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [label, ...rest] = line.split(":");
          return { label: label.trim(), value: rest.join(":").trim() };
        })
        .filter((x) => x.label && x.value),
    };
  }

  async function submit() {
    setLoading(true);
    setFormError(null);
    setSubmitPhase("uploading");
    try {
      const imageUrls = imageUploaderRef.current
        ? await imageUploaderRef.current.uploadPending()
        : form.imageUrls;

      setForm((s) => ({ ...s, imageUrls }));
      setSubmitPhase("saving");

      const payload = buildPayload(imageUrls);
      const url = editingSlug ? `/api/admin/products/${editingSlug}` : "/api/admin/products";
      const method = editingSlug ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        if (isServiceUnavailable(res)) return;
        const data = await res.json().catch(() => null);
        throw new Error(
          typeof data?.error === "string" ? data.error : "Failed to save product."
        );
      }
      closeModal();
      router.refresh();
    } catch (err) {
      if (err instanceof Error && err.message === "Upload cancelled.") return;
      setFormError(err instanceof Error ? err.message : "Failed to save product.");
    } finally {
      setLoading(false);
      setSubmitPhase("idle");
    }
  }

  const submitButtonLabel = (() => {
    if (!loading) return editingSlug ? "Update Product" : "Create Product";
    if (submitPhase === "uploading") return "Uploading images to Firebase...";
    return editingSlug ? "Updating product..." : "Creating product...";
  })();

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.slug}`, { method: "DELETE" });
      if (!res.ok) {
        const message = await readApiError(res, "Failed to delete product.");
        if (message) setDeleteError(message);
        return;
      }
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="sj-display text-[22px] font-semibold">Existing Products</h2>
          <p className="mt-1 text-[13px] text-black/55">Sort and manage catalogue items.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-[12px] font-semibold text-black/60">
            Order by
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as typeof sortKey)}
              className="rounded-lg border border-black/10 px-2.5 py-2 text-[12px] font-semibold text-black"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
              <option value="status">Status</option>
            </select>
          </label>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-xl bg-black px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-black/90"
          >
            Create new product
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-black/10 bg-white">
        <table className="min-w-full text-left text-[13px]">
          <thead className="border-b border-black/10 bg-black/[0.02] text-[12px] uppercase tracking-[0.06em] text-black/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Brand</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-black/55">
                  No products yet. Click “Create new product” to add one.
                </td>
              </tr>
            ) : (
              sortedProducts.map((product) => (
                <tr key={product._id} className="border-b border-black/5 last:border-b-0">
                  <td className="px-4 py-3 font-semibold">{product.name}</td>
                  <td className="px-4 py-3 text-black/70">{product.brand?.name || "—"}</td>
                  <td className="px-4 py-3 text-black/70">{product.category?.name || "—"}</td>
                  <td className="px-4 py-3 text-black/70">
                    ₦{Math.round(product.price).toLocaleString("en-NG")}
                  </td>
                  <td className="px-4 py-3 text-black/70">{product.stock}</td>
                  <td className="px-4 py-3 text-black/70">
                    {product.isActive ? "Active" : "Inactive"}
                    {product.isFeatured ? " · Featured" : ""}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => loadProduct(product)}
                        className="rounded-lg border border-black/10 px-3 py-1.5 text-[12px] font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(product)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-[12px] font-semibold text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 bg-black/45"
            onClick={closeModal}
          />
          <div className="relative w-full max-w-2xl rounded-2xl border border-black/10 bg-white p-5 shadow-[0_24px_60px_rgba(11,16,32,0.2)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="sj-display text-[22px] font-semibold">
                {editingSlug ? "Edit Product" : "Create Product"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-[12px] font-semibold text-black/55"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Product name">
                <input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Stock quantity">
                <input
                  value={form.stock}
                  onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))}
                  type="number"
                  className={inputCls}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Short description">
                  <textarea
                    value={form.shortDescription}
                    onChange={(e) => setForm((s) => ({ ...s, shortDescription: e.target.value }))}
                    rows={2}
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Full description">
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                    rows={4}
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Price (₦)">
                <input
                  value={form.price}
                  onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
                  type="number"
                  className={inputCls}
                />
              </Field>
              <Field label="Compare-at price (₦)">
                <input
                  value={form.compareAtPrice}
                  onChange={(e) => setForm((s) => ({ ...s, compareAtPrice: e.target.value }))}
                  type="number"
                  className={inputCls}
                />
              </Field>
              <Field label="Brand">
                <select
                  value={form.brandId}
                  onChange={(e) => setForm((s) => ({ ...s, brandId: e.target.value }))}
                  className={inputCls}
                >
                  <option value="">Select brand</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Category">
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm((s) => ({ ...s, categoryId: e.target.value }))}
                  className={inputCls}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <span className="text-[12px] font-semibold text-black/60">Product images</span>
                <div className="mt-1.5">
                  <ImageUploader
                    ref={imageUploaderRef}
                    images={form.imageUrls}
                    onChange={(imageUrls) => setForm((s) => ({ ...s, imageUrls }))}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <Field label="Features (one per line)">
                  <textarea
                    value={form.features}
                    onChange={(e) => setForm((s) => ({ ...s, features: e.target.value }))}
                    rows={3}
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Specs (Label:Value, one per line)">
                  <textarea
                    value={form.specs}
                    onChange={(e) => setForm((s) => ({ ...s, specs: e.target.value }))}
                    rows={3}
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="flex gap-4 text-[13px] sm:col-span-2">
                <label className="flex items-center gap-2 font-semibold text-black/70">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm((s) => ({ ...s, isFeatured: e.target.checked }))}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 font-semibold text-black/70">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((s) => ({ ...s, isActive: e.target.checked }))}
                  />
                  Active
                </label>
              </div>
            </div>

            {formError ? (
              <div className="mt-4 text-[13px] font-semibold text-red-700">{formError}</div>
            ) : null}

            <button
              type="button"
              onClick={submit}
              disabled={loading || !canSubmit}
              className="mt-5 w-full rounded-xl bg-black px-4 py-3 text-[13px] font-semibold text-white disabled:opacity-60"
            >
              {submitButtonLabel}
            </button>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product?"
        message={
          deleteTarget
            ? `“${deleteTarget.name}” will be permanently removed from the catalogue.`
            : ""
        }
        loading={deleting}
        error={deleteError ?? undefined}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
