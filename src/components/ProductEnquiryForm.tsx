"use client";

import { useRef, useState } from "react";
import { isServiceUnavailable } from "@/lib/readApiError";
import { z } from "zod";
import { ProductWhatsAppCTA } from "@/components/ProductWhatsAppCTA";

const schema = z.object({
  productSlug: z.string().min(2),
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(6, "Enter your phone number"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  deliveryAddress: z.string().min(5, "Enter delivery address"),
  message: z.string().optional(),
});

export function ProductEnquiryForm({
  productSlug,
  productName,
  whatsappPhone,
}: {
  productSlug: string;
  productName: string;
  whatsappPhone: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const values = {
      productSlug,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      quantity: formData.get("quantity"),
      deliveryAddress: formData.get("deliveryAddress"),
      message: formData.get("message") || undefined,
    };

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setStatus("error");
      setError(parsed.error.issues[0]?.message || "Please check the form.");
      return;
    }

    try {
      setStatus("submitting");
      const res = await fetch("/api/enquiries/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        if (isServiceUnavailable(res)) {
          setStatus("idle");
          return;
        }
        throw new Error("Failed to submit enquiry.");
      }

      form.reset();
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_10px_40px_rgba(11,16,32,0.05)]">
      <div className="text-[12px] font-semibold text-black/55">Product enquiry</div>
      <div className="sj-display mt-1 text-[22px] font-semibold">{productName}</div>

      <p className="mt-3 text-[13px] leading-6 text-black/65">
        Complete the form below and our team will follow up. Prefer a faster conversation?
        Continue on WhatsApp and we&apos;ll assist you directly.
      </p>

      {whatsappPhone ? (
        <ProductWhatsAppCTA
          phone={whatsappPhone}
          productName={productName}
          className="mt-4 hidden lg:flex"
        />
      ) : null}

      <form ref={formRef} onSubmit={onSubmit} className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-[12px] font-semibold text-black/60">Name</label>
          <input name="name" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]" />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-black/60">Email</label>
          <input name="email" type="email" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]" />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-black/60">Phone</label>
          <input name="phone" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]" />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-black/60">Quantity</label>
          <input name="quantity" type="number" min={1} defaultValue={1} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[12px] font-semibold text-black/60">Delivery address</label>
          <textarea name="deliveryAddress" rows={3} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[12px] font-semibold text-black/60">Message (optional)</label>
          <textarea name="message" rows={2} placeholder="e.g. Need delivery by next week" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]" />
        </div>

        <div className="sm:col-span-2">
          {status === "success" ? (
            <div className="text-[13px] font-semibold text-green-700">
              Enquiry submitted successfully. Thank you!
            </div>
          ) : null}
          {status === "error" && error ? (
            <div className="text-[13px] font-semibold text-red-700">{error}</div>
          ) : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-[var(--brand2)] px-5 py-3 text-[14px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {status === "submitting" ? "Submitting..." : "Submit enquiry"}
          </button>
        </div>
      </form>
    </div>
  );
}
