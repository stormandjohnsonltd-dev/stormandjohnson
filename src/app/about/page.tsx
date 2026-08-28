import Link from "next/link";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { whatsappLink } from "@/lib/utils";

const faqs = [
  {
    q: "Do you deliver nationwide?",
    a: "Yes. Storm & Johnson delivers lighting products across Nigeria for homes, estates, offices and industrial projects.",
  },
  {
    q: "Can I order in bulk for a project?",
    a: "Absolutely. Send an enquiry from any product page or contact our team for bulk pricing, lead times and delivery planning.",
  },
  {
    q: "Which brands do you distribute?",
    a: "We are a marketing and distribution partner for Pololux, Qiming and Liton — trusted energy-efficient lighting brands.",
  },
  {
    q: "How do distributor applications work?",
    a: "Submit the distributor form with your business details. Our team reviews applications and follows up by email or WhatsApp.",
  },
  {
    q: "Are your products suitable for Nigerian power conditions?",
    a: "Yes. Our range is selected for durability, energy savings and reliable performance in Nigerian residential and commercial environments.",
  },
];

export default function AboutPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "2349041140745";
  const wa = whatsappLink(phone, "Hello Storm & Johnson, I’d like to learn more about your lighting products.");

  return (
    <div>
      <section className="relative min-h-[58vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/heroes/about-hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(11,16,32,0.88) 0%, rgba(36,48,77,0.7) 50%, rgba(58,34,15,0.55) 100%)",
          }}
        />
        <div className="relative mx-auto flex min-h-[58vh] max-w-6xl flex-col justify-end px-4 py-16 sm:py-20">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/60">
            About the brand
          </p>
          <h1 className="sj-display mt-4 max-w-3xl text-[40px] font-semibold leading-[1.05] text-white sm:text-[52px]">
            Lighting that saves energy and builds trust.
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/75">
            Storm &amp; Johnson Limited is a Lagos-based premium energy solutions company helping
            homes, businesses and industries across Nigeria switch to high-quality, energy-efficient
            lighting.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-6 py-3.5 text-[14px] font-semibold text-[#0b1020] transition hover:brightness-110"
            >
              Explore Products
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-[14px] font-semibold text-white transition hover:brightness-110"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="sj-display text-[30px] font-semibold">Who we are</h2>
            <p className="mt-4 text-[14px] leading-7 text-black/70">
              We specialize in marketing and distributing premium lighting products designed to
              reduce energy consumption without compromising performance, durability or lighting
              quality.
            </p>
            <p className="mt-4 text-[14px] leading-7 text-black/70">
              As an official partner for Pololux, Qiming and Liton, we supply innovative lighting for
              the Nigerian market — from solar street lamps to LED bulbs and panel lights.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Lighting solutions", value: "LED+" },
              { label: "Service model", value: "B2B & Retail" },
              { label: "Coverage", value: "Nationwide" },
              { label: "Focus", value: "Energy savings" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-black/8 bg-white p-5 shadow-[0_8px_30px_rgba(11,16,32,0.04)]"
              >
                <div className="sj-display text-[28px] font-semibold text-[var(--brand2)]">
                  {item.value}
                </div>
                <div className="mt-2 text-[13px] font-semibold text-black/60">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="sj-display text-[30px] font-semibold">Why choose Storm &amp; Johnson</h2>
          <p className="mt-3 max-w-2xl text-[14px] text-black/65">
            We combine trusted brands, practical product selection and responsive support for
            buyers and distributors.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                title: "Premium brand portfolio",
                desc: "Access Pololux, Qiming and Liton products selected for Nigerian homes and commercial sites.",
              },
              {
                title: "Project-ready supply",
                desc: "From single-product enquiries to bulk orders for estates, offices and industrial facilities.",
              },
              {
                title: "Fast follow-up",
                desc: "Submit an enquiry online or continue on WhatsApp for quicker pricing and delivery support.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-black/8 bg-white p-5 transition hover:-translate-y-1 hover:border-[var(--brand)]/30 hover:shadow-[0_18px_40px_rgba(11,16,32,0.08)]"
              >
                <div className="h-1 w-10 rounded-full bg-[var(--brand2)]" />
                <div className="mt-4 text-[16px] font-semibold">{item.title}</div>
                <p className="mt-2 text-[13px] leading-6 text-black/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="sj-display text-[30px] font-semibold">Who we serve</h2>
        <p className="mt-3 max-w-2xl text-[14px] text-black/65">
          From large developments to everyday homes — we supply lighting that fits the job.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {[
            "Real estate developers",
            "Construction companies",
            "Factories & industrial facilities",
            "Corporate offices",
            "Commercial properties",
            "Homeowners",
          ].map((item) => (
            <span
              key={item}
              className="inline-flex items-center rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-black/75 shadow-[0_4px_14px_rgba(11,16,32,0.04)]"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="border-y border-black/5 bg-[#0b1020] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="sj-display text-[30px] font-semibold">Frequently asked questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-white/10 bg-white/5 px-5 py-4 open:bg-white/8"
              >
                <summary className="cursor-pointer list-none text-[15px] font-semibold">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-white/50 transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-[14px] leading-7 text-white/70">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="overflow-hidden rounded-[28px] border border-black/8 bg-gradient-to-br from-[#0b1020] via-[#1c2438] to-[#3a220f] px-6 py-10 text-center sm:px-10">
          <h2 className="sj-display mx-auto max-w-xl text-[32px] font-semibold text-white">
            Ready to light smarter spaces?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[14px] leading-7 text-white/70">
            Browse our catalogue, send an enquiry, or join our distributor network nationwide.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-6 py-3.5 text-[14px] font-semibold text-[#0b1020] transition hover:brightness-110"
            >
              Shop Products
            </Link>
            <Link
              href="/become-a-distributor"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-[14px] font-semibold text-white transition hover:bg-white/10"
            >
              Become a Distributor
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand2)] px-6 py-3.5 text-[14px] font-semibold text-white transition hover:brightness-110"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
