"use client";

import { useMemo, useState } from "react";
import { isServiceUnavailable } from "@/lib/readApiError";
import { parseFacebookPixelConfig } from "@/lib/facebookPixel";

type Company = {
  name?: string;
  tagline?: string;
  about?: string;
  mission?: string;
  vision?: string;
  officeLine?: string;
  whatsappNumbers?: string[];
  email?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  facebookPixelIds?: string[];
  facebookPixelBaseCode?: string;
  facebookConversionCode?: string;
};

const inputCls = "w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]";

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[12px] font-semibold text-black/60">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function CompanyForm({ company }: { company: Company | null }) {
  const [form, setForm] = useState({
    name: company?.name || "Storm & Johnson Limited",
    tagline: company?.tagline || "Premium energy-efficient lighting products in Nigeria",
    about:
      company?.about ||
      "Storm & Johnson Limited is a premium energy solutions company based in Lagos, Nigeria, specializing in the marketing and distribution of high-quality, energy-efficient lighting products.",
    mission: company?.mission || "",
    vision: company?.vision || "",
    officeLine: company?.officeLine || "09066034767",
    whatsappNumbers: company?.whatsappNumbers?.join(", ") || "+234 9041140745, +234 7047906791",
    email: company?.email || "stormandjohnsonltd@gmail.com",
    address: company?.address || "Lagos, Nigeria",
    facebook: company?.socialLinks?.facebook || "",
    instagram: company?.socialLinks?.instagram || "",
    twitter: company?.socialLinks?.twitter || "",
    linkedin: company?.socialLinks?.linkedin || "",
    facebookPixelBaseCode:
      company?.facebookPixelBaseCode || company?.facebookPixelIds?.join("\n") || "",
    facebookConversionCode: company?.facebookConversionCode || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const pixelPreview = useMemo(
    () =>
      parseFacebookPixelConfig({
        baseCode: form.facebookPixelBaseCode,
        conversionCode: form.facebookConversionCode,
      }),
    [form.facebookPixelBaseCode, form.facebookConversionCode]
  );

  async function onSave() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        if (isServiceUnavailable(res)) return;
        throw new Error("Failed to save company details.");
      }
      setMessage("Company details updated.");
    } catch (err: unknown) {
      setMessage(err instanceof Error ? err.message : "Failed to save company details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5">
      <h1 className="sj-display text-[26px] font-semibold">Company Details</h1>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Company name">
          <input
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            className={inputCls}
          />
        </Field>
        <Field label="Tagline">
          <input
            value={form.tagline}
            onChange={(e) => setForm((s) => ({ ...s, tagline: e.target.value }))}
            className={inputCls}
          />
        </Field>
        <Field label="Office line">
          <input
            value={form.officeLine}
            onChange={(e) => setForm((s) => ({ ...s, officeLine: e.target.value }))}
            className={inputCls}
          />
        </Field>
        <Field label="Email">
          <input
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            className={inputCls}
          />
        </Field>
        <Field label="WhatsApp numbers (comma-separated)" className="md:col-span-2">
          <input
            value={form.whatsappNumbers}
            onChange={(e) => setForm((s) => ({ ...s, whatsappNumbers: e.target.value }))}
            className={inputCls}
          />
        </Field>
        <Field label="Address" className="md:col-span-2">
          <input
            value={form.address}
            onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
            className={inputCls}
          />
        </Field>
        <Field label="About text" className="md:col-span-2">
          <textarea
            value={form.about}
            onChange={(e) => setForm((s) => ({ ...s, about: e.target.value }))}
            rows={6}
            className={inputCls}
          />
        </Field>
        <Field label="Mission">
          <textarea
            value={form.mission}
            onChange={(e) => setForm((s) => ({ ...s, mission: e.target.value }))}
            rows={3}
            className={inputCls}
          />
        </Field>
        <Field label="Vision">
          <textarea
            value={form.vision}
            onChange={(e) => setForm((s) => ({ ...s, vision: e.target.value }))}
            rows={3}
            className={inputCls}
          />
        </Field>
        <Field label="Facebook URL">
          <input
            value={form.facebook}
            onChange={(e) => setForm((s) => ({ ...s, facebook: e.target.value }))}
            className={inputCls}
          />
        </Field>
        <Field label="Instagram URL">
          <input
            value={form.instagram}
            onChange={(e) => setForm((s) => ({ ...s, instagram: e.target.value }))}
            className={inputCls}
          />
        </Field>
        <Field label="Twitter / X URL">
          <input
            value={form.twitter}
            onChange={(e) => setForm((s) => ({ ...s, twitter: e.target.value }))}
            className={inputCls}
          />
        </Field>
        <Field label="LinkedIn URL">
          <input
            value={form.linkedin}
            onChange={(e) => setForm((s) => ({ ...s, linkedin: e.target.value }))}
            className={inputCls}
          />
        </Field>
        <Field label="Facebook Pixel — Batch 1 (base code or Pixel ID)" className="md:col-span-2">
          <textarea
            value={form.facebookPixelBaseCode}
            onChange={(e) => setForm((s) => ({ ...s, facebookPixelBaseCode: e.target.value }))}
            rows={8}
            placeholder="Paste the Facebook Pixel base code here, or a Pixel ID."
            className={`${inputCls} font-mono text-[12px]`}
          />
          <p className="mt-1.5 text-[12px] leading-5 text-black/55">
            This is the first batch Facebook gives you. Paste the full base script, or just the
            Pixel ID. It loads on the public site.
          </p>
        </Field>
        <Field label="Facebook Pixel — Batch 2 (conversion / event code)" className="md:col-span-2">
          <textarea
            value={form.facebookConversionCode}
            onChange={(e) => setForm((s) => ({ ...s, facebookConversionCode: e.target.value }))}
            rows={6}
            placeholder="Paste the conversion pixel or event code Facebook gives you for purchases."
            className={`${inputCls} font-mono text-[12px]`}
          />
          <p className="mt-1.5 text-[12px] leading-5 text-black/55">
            This is the second batch. It fires only when someone orders an advertised product
            (enquiry form or WhatsApp). If this is empty, orders still send a Purchase event.
          </p>
        </Field>
        {pixelPreview.pixelIds.length || pixelPreview.conversionEvents.length ? (
          <div className="rounded-xl border border-black/10 bg-black/[0.02] px-3 py-2 text-[12px] leading-5 text-black/65 md:col-span-2">
            {pixelPreview.pixelIds.length ? (
              <div>
                Detected Pixel ID{pixelPreview.pixelIds.length > 1 ? "s" : ""}:{" "}
                <span className="font-semibold text-black">{pixelPreview.pixelIds.join(", ")}</span>
              </div>
            ) : null}
            {pixelPreview.conversionEvents.length ? (
              <div className={pixelPreview.pixelIds.length ? "mt-1" : ""}>
                Detected conversion event{pixelPreview.conversionEvents.length > 1 ? "s" : ""}:{" "}
                <span className="font-semibold text-black">
                  {pixelPreview.conversionEvents.join(", ")}
                </span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      {message ? <div className="mt-4 text-[13px] font-semibold text-black/70">{message}</div> : null}
      <button
        type="button"
        onClick={onSave}
        disabled={loading}
        className="mt-5 rounded-xl bg-black px-5 py-3 text-[13px] font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Company Details"}
      </button>
    </section>
  );
}
