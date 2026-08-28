"use client";

import { useState } from "react";
import Link from "next/link";

type EnquiryItem = {
  _id: string;
  productName: string;
  name: string;
  quantity: number;
  email: string;
  phone?: string;
  deliveryAddress: string;
  createdAt?: string;
};

type DistributorItem = {
  _id: string;
  businessName: string;
  name: string;
  city: string;
  state: string;
  whatsapp: string;
  email: string;
  createdAt?: string;
};

type ContactItem = {
  _id: string;
  subject: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt?: string;
};

type TabKey = "enquiries" | "applications" | "messages";

export function DashboardInbox({
  enquiries,
  distributors,
  contacts,
}: {
  enquiries: EnquiryItem[];
  distributors: DistributorItem[];
  contacts: ContactItem[];
}) {
  const [tab, setTab] = useState<TabKey>("enquiries");

  const tabs: Array<{ key: TabKey; label: string; count: number }> = [
    { key: "enquiries", label: "Enquiries", count: enquiries.length },
    { key: "applications", label: "Applications", count: distributors.length },
    { key: "messages", label: "Contact messages", count: contacts.length },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-black/10 pb-3">
        {tabs.map((item) => {
          const active = tab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                active
                  ? "bg-[#0b1020] text-white"
                  : "border border-black/10 bg-white text-black/65 hover:bg-black/[0.03]"
              }`}
            >
              {item.label}
              <span className={`ml-2 ${active ? "text-white/70" : "text-black/40"}`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-black/10 bg-white">
        {tab === "enquiries" ? (
          <table className="min-w-full text-left text-[13px]">
            <thead className="border-b border-black/10 bg-black/[0.02] text-[12px] uppercase tracking-[0.06em] text-black/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Qty</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Delivery</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-black/55">
                    No enquiries yet.
                  </td>
                </tr>
              ) : (
                enquiries.map((e) => (
                  <tr key={e._id} className="border-b border-black/5 last:border-b-0">
                    <td className="px-4 py-3 font-semibold">{e.productName}</td>
                    <td className="px-4 py-3 text-black/70">{e.name}</td>
                    <td className="px-4 py-3 text-black/70">{e.quantity}</td>
                    <td className="px-4 py-3 text-black/70 whitespace-nowrap">{e.phone || "—"}</td>
                    <td className="px-4 py-3 text-black/70">{e.email}</td>
                    <td className="max-w-[220px] px-4 py-3 text-black/70">
                      <span className="line-clamp-2">{e.deliveryAddress}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : null}

        {tab === "applications" ? (
          <table className="min-w-full text-left text-[13px]">
            <thead className="border-b border-black/10 bg-black/[0.02] text-[12px] uppercase tracking-[0.06em] text-black/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Business</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">WhatsApp</th>
                <th className="px-4 py-3 font-semibold">Email</th>
              </tr>
            </thead>
            <tbody>
              {distributors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-black/55">
                    No applications yet.
                  </td>
                </tr>
              ) : (
                distributors.map((d) => (
                  <tr key={d._id} className="border-b border-black/5 last:border-b-0">
                    <td className="px-4 py-3 font-semibold">{d.businessName}</td>
                    <td className="px-4 py-3 text-black/70">{d.name}</td>
                    <td className="px-4 py-3 text-black/70">
                      {d.city}, {d.state}
                    </td>
                    <td className="px-4 py-3 text-black/70">{d.whatsapp}</td>
                    <td className="px-4 py-3 text-black/70">{d.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : null}

        {tab === "messages" ? (
          <table className="min-w-full text-left text-[13px]">
            <thead className="border-b border-black/10 bg-black/[0.02] text-[12px] uppercase tracking-[0.06em] text-black/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Subject</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Phone</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Message</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-black/55">
                    No messages yet.
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c._id} className="border-b border-black/5 last:border-b-0">
                    <td className="px-4 py-3 font-semibold">{c.subject}</td>
                    <td className="px-4 py-3 text-black/70">{c.name}</td>
                    <td className="px-4 py-3 text-black/70 whitespace-nowrap">{c.phone || "—"}</td>
                    <td className="px-4 py-3 text-black/70">{c.email}</td>
                    <td className="max-w-[280px] px-4 py-3 text-black/70">
                      <span className="line-clamp-2">{c.message}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : null}
      </div>

      <div className="mt-4">
        <Link href="/admin/products" className="text-[13px] font-semibold text-[var(--brand2)] hover:underline">
          Manage products →
        </Link>
      </div>
    </div>
  );
}
