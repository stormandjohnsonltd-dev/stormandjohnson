"use client";

import { useRef, useState } from "react";
import { isServiceUnavailable } from "@/lib/readApiError";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Enter subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = formRef.current;
    if (!form) return;

    const fd = new FormData(form);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone") || undefined,
      subject: fd.get("subject"),
      message: fd.get("message"),
    });

    if (!parsed.success) {
      setStatus("error");
      setError(parsed.error.issues[0]?.message ?? "Please check your input.");
      return;
    }

    try {
      setStatus("submitting");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) {
        if (isServiceUnavailable(res)) {
          setStatus("idle");
          return;
        }
        throw new Error("Failed to send message.");
      }
      form.reset();
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_40px_rgba(11,16,32,0.05)]">
      <h2 className="sj-display text-[26px] font-semibold">Send a message</h2>
      <p className="mt-3 text-[14px] text-black/70">We typically respond within one business day.</p>

      <form ref={formRef} onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-[12px] font-semibold text-black/60">Name</label>
          <input name="name" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]" />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-black/60">Email</label>
          <input name="email" type="email" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]" />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-black/60">Phone (optional)</label>
          <input name="phone" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]" />
        </div>
        <div>
          <label className="text-[12px] font-semibold text-black/60">Subject</label>
          <input name="subject" className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[12px] font-semibold text-black/60">Message</label>
          <textarea name="message" rows={5} className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-[13px]" />
        </div>

        <div className="sm:col-span-2">
          {status === "success" ? (
            <div className="text-[13px] font-semibold text-green-700">
              Message sent successfully. Thank you!
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
            {status === "submitting" ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
}
