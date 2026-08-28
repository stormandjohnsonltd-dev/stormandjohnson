"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      className="inline-flex items-center justify-center rounded-xl border border-black/10 px-3 py-2 text-[13px] font-semibold hover:bg-black/5 transition"
    >
      Logout
    </button>
  );
}

