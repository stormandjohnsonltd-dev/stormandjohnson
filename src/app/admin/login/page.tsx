import { AdminLoginForm } from "@/components/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-[440px] rounded-2xl border border-black/10 bg-white p-6 shadow-[0_16px_40px_rgba(11,16,32,0.06)] sm:p-8">
        <h1 className="sj-display text-center text-[34px] font-semibold">Admin Login</h1>
        <p className="mt-3 text-center text-[14px] text-black/70">
          Sign in to manage products, prices, brands, categories and company details.
        </p>
        <AdminLoginForm />
      </div>
    </div>
  );
}
