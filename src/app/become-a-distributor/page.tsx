import Link from "next/link";
import { DistributorApplicationForm } from "@/components/DistributorApplicationForm";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { whatsappLink } from "@/lib/utils";

export default function DistributorPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "2349041140745";
  const wa = whatsappLink(
    phone,
    "Hello Storm & Johnson, I’m interested in becoming a distributor."
  );

  return (
    <div className="min-h-[70vh]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <div className="lg:pr-8">
            <h1 className="sj-display text-[34px] font-semibold">Distributors Wanted</h1>
            <p className="mt-3 text-[14px] leading-7 text-black/70">
              Join Storm &amp; Johnson Limited and help bring premium lighting solutions to homes and
              businesses across Nigeria.
            </p>

            <div className="mt-6 space-y-3">
              {[
                { title: "Nationwide coverage", desc: "We work with partners in every state." },
                { title: "Premium product range", desc: "Pololux, Qiming and Liton lighting." },
                { title: "Responsive support", desc: "Email and WhatsApp follow-up after application." },
              ].map((x) => (
                <div key={x.title} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[var(--brand2)]" />
                  <div>
                    <div className="text-[14px] font-semibold">{x.title}</div>
                    <div className="mt-1 text-[13px] text-black/65">{x.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-[14px] font-semibold text-white transition hover:brightness-110"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Ask about partnerships on WhatsApp
            </a>
          </div>

          <DistributorApplicationForm />
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-[28px] border border-black/8 bg-white px-6 py-10 shadow-[0_12px_40px_rgba(11,16,32,0.05)] sm:px-10">
          <h2 className="sj-display text-[28px] font-semibold">Why partner with us?</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              "Access a focused premium lighting catalogue",
              "Serve residential and commercial demand",
              "Get support for enquiries and order follow-up",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-black/8 bg-[#faf8f5] p-4 text-[13px] leading-6 text-black/70">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand2)] px-5 py-3 text-[14px] font-semibold text-white transition hover:brightness-110"
            >
              Review Products
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-3 text-[14px] font-semibold transition hover:bg-black/5"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
