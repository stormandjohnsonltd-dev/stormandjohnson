"use client";

import { useState } from "react";
import { isServiceUnavailable } from "@/lib/readApiError";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("submitting");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        if (isServiceUnavailable(res)) {
          setStatus("idle");
          return;
        }
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Login failed.");
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6">
      <div>
        <label className="text-[12px] font-semibold text-black/60">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="username"
          className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-[13px]"
        />
      </div>
      <div className="mt-4">
        <label className="text-[12px] font-semibold text-black/60">Password</label>
        <div className="relative mt-2">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 pr-12 text-[13px]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 px-3 text-[12px] font-semibold text-black/55 transition hover:text-black"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {status === "error" && error ? (
        <div className="mt-4 text-[13px] font-semibold text-red-700">{error}</div>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-black px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-black/90 disabled:opacity-60"
      >
        {status === "submitting" ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
