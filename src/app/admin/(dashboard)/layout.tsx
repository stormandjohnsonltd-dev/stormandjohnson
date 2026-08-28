import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { AdminLogoutButton } from "@/components/AdminLogoutButton";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-[100vh] bg-white">
      <div className="border-b border-black/5 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <div className="sj-display font-semibold text-[18px]">Admin Dashboard</div>
            <div className="text-[12px] text-black/55">{session.email}</div>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-[13px] font-semibold text-black/70">
            <Link href="/admin/dashboard" className="hover:text-black transition">
              Overview
            </Link>
            <Link href="/admin/products" className="hover:text-black transition">
              Products
            </Link>
            <Link href="/admin/brands" className="hover:text-black transition">
              Brands
            </Link>
            <Link href="/admin/categories" className="hover:text-black transition">
              Categories
            </Link>
            <Link href="/admin/company" className="hover:text-black transition">
              Company
            </Link>
          </nav>
          <AdminLogoutButton />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
