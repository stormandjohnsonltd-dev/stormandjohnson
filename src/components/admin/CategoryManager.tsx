"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { isServiceUnavailable, readApiError } from "@/lib/readApiError";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
};

const inputCls = "w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-black/60">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        if (isServiceUnavailable(res)) return;
        return;
      }
      setForm({ name: "", description: "", image: "", isActive: true });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.slug}`, { method: "DELETE" });
      if (!res.ok) {
        const message = await readApiError(res, "Failed to delete category.");
        if (message) setDeleteError(message);
        return;
      }
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  async function toggle(category: Category) {
    await fetch(`/api/admin/categories/${category.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: category.name,
        description: category.description || "",
        image: category.image || "",
        isActive: !category.isActive,
      }),
    });
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="sj-display text-[22px] font-semibold">Add Category</h2>
        <div className="mt-4 space-y-3">
          <Field label="Category name">
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className={inputCls}
            />
          </Field>
          <Field label="Image URL (optional)">
            <input
              value={form.image}
              onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))}
              className={inputCls}
            />
          </Field>
          <Field label="Short description">
            <textarea
              value={form.description}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
              rows={4}
              className={inputCls}
            />
          </Field>
          <button
            type="button"
            onClick={submit}
            disabled={loading || !form.name.trim()}
            className="w-full rounded-xl bg-black px-4 py-3 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Create Category"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="sj-display text-[22px] font-semibold">Existing Categories</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-[13px]">
            <thead className="border-b border-black/10 text-[12px] uppercase tracking-[0.06em] text-black/50">
              <tr>
                <th className="py-2 pr-3 font-semibold">Name</th>
                <th className="py-2 pr-3 font-semibold">Status</th>
                <th className="py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="border-b border-black/5 last:border-b-0">
                  <td className="py-3 pr-3">
                    <div className="font-semibold">{category.name}</div>
                    <div className="text-[12px] text-black/50">{category.slug}</div>
                  </td>
                  <td className="py-3 pr-3 text-black/65">
                    {category.isActive ? "Active" : "Disabled"}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggle(category)}
                        className="rounded-lg border border-black/10 px-3 py-1.5 text-[12px] font-semibold"
                      >
                        {category.isActive ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(category)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-[12px] font-semibold text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-black/55">
                    No categories yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete category?"
        message={
          deleteTarget
            ? `“${deleteTarget.name}” will be permanently removed. Products in this category may be affected.`
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
