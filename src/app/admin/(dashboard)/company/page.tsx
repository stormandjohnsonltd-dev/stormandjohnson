import { CompanyForm } from "@/components/admin/CompanyForm";
import { getAdminCompany } from "@/lib/adminQueries";

export default async function AdminCompanyPage() {
  const { data: company } = await getAdminCompany();

  const companyData = company as unknown as {
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
  } | null;

  return (
    <div>
      <h1 className="sj-display text-[30px] font-semibold">Company Settings</h1>
      <p className="mt-2 text-[14px] text-black/65">
        Update company profile, contacts and social links shown across the website.
      </p>
      <div className="mt-6">
        <CompanyForm company={companyData} />
      </div>
    </div>
  );
}
