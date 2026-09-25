import { CompanyForm } from "@/components/admin/CompanyForm";
import { getAdminCompany } from "@/lib/adminQueries";

export default async function AdminCompanyPage() {
  const { data: companyData } = await getAdminCompany();

  return (
    <div>
      <h1 className="sj-display text-[30px] font-semibold">Company Settings</h1>
      <p className="mt-2 text-[14px] text-black/65">
        Update company profile, Facebook Pixel base and conversion codes, contacts and social links.
      </p>
      <div className="mt-6">
        <CompanyForm company={companyData} />
      </div>
    </div>
  );
}
