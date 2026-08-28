"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { isServiceUnavailable, readApiError } from "@/lib/readApiError";

type Brand = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
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

export function BrandManager({ brands }: { brands: Brand[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    logo: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        if (isServiceUnavailable(res)) return;
        return;
      }
      setForm({ name: "", description: "", logo: "", isActive: true });
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
      const res = await fetch(`/api/admin/brands/${deleteTarget.slug}`, { method: "DELETE" });
      if (!res.ok) {
        const message = await readApiError(res, "Failed to delete brand.");
        if (message) setDeleteError(message);
        return;
      }
      setDeleteTarget(null);
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  async function toggle(brand: Brand) {
    await fetch(`/api/admin/brands/${brand.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: brand.name,
        description: brand.description || "",
        logo: brand.logo || "",
        isActive: !brand.isActive,
      }),
    });
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="sj-display text-[22px] font-semibold">Add Brand</h2>
        <div className="mt-4 space-y-3">
          <Field label="Brand name">
            <input
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              className={inputCls}
            />
          </Field>
          <Field label="Logo / image URL (optional)">
            <input
              value={form.logo}
              onChange={(e) => setForm((s) => ({ ...s, logo: e.target.value }))}
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
            {loading ? "Saving..." : "Create Brand"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="sj-display text-[22px] font-semibold">Existing Brands</h2>
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
              {brands.map((brand) => (
                <tr key={brand._id} className="border-b border-black/5 last:border-b-0">
                  <td className="py-3 pr-3">
                    <div className="font-semibold">{brand.name}</div>
                    <div className="text-[12px] text-black/50">{brand.slug}</div>
                  </td>
                  <td className="py-3 pr-3 text-black/65">
                    {brand.isActive ? "Active" : "Disabled"}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => toggle(brand)}
                        className="rounded-lg border border-black/10 px-3 py-1.5 text-[12px] font-semibold"
                      >
                        {brand.isActive ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(brand)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-[12px] font-semibold text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {brands.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-black/55">
                    No brands yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete brand?"
        message={
          deleteTarget
            ? `“${deleteTarget.name}” will be permanently removed. Products using this brand may be affected.`
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
