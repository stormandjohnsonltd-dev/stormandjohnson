import {
  getAdminContacts,
  getAdminDistributors,
  getAdminEnquiries,
} from "@/lib/adminQueries";
import { DashboardInbox } from "@/components/admin/DashboardInbox";
import { asId } from "@/lib/serialize";

type EnquiryItem = {
  _id: string;
  productName: string;
  name: string;
  quantity: number;
  email: string;
  phone: string;
  deliveryAddress: string;
};

type DistributorItem = {
  _id: string;
  businessName: string;
  name: string;
  city: string;
  state: string;
  whatsapp: string;
  email: string;
};

type ContactItem = {
  _id: string;
  subject: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export default async function AdminDashboardPage() {
  const [enquiriesResult, distributorsResult, contactsResult] = await Promise.all([
    getAdminEnquiries(),
    getAdminDistributors(),
    getAdminContacts(),
  ]);

  const enquiries: EnquiryItem[] = enquiriesResult.data.map((item) => ({
    _id: asId(item._id),
    productName: item.productName,
    name: item.name,
    quantity: item.quantity,
    email: item.email,
    phone: item.phone,
    deliveryAddress: item.deliveryAddress,
  }));

  const distributors: DistributorItem[] = distributorsResult.data.map((item) => ({
    _id: asId(item._id),
    businessName: item.businessName,
    name: item.name,
    city: item.city,
    state: item.state,
    whatsapp: item.whatsapp,
    email: item.email,
  }));

  const contacts: ContactItem[] = contactsResult.data.map((item) => ({
    _id: asId(item._id),
    subject: item.subject,
    name: item.name,
    email: item.email,
    phone: item.phone,
    message: item.message,
  }));

  return (
    <div>
      <div className="sj-display text-[30px] font-semibold">Overview</div>
      <p className="mt-2 text-[14px] text-black/65">
        Switch tabs to review enquiries, distributor applications and contact messages.
      </p>
      <div className="mt-7">
        <DashboardInbox
          enquiries={enquiries}
          distributors={distributors}
          contacts={contacts}
        />
      </div>
    </div>
  );
}
