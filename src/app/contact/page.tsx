import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { SocialIcons } from "@/components/SocialIcons";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { getCompany } from "@/lib/queries";
import { isMongoConnectionError } from "@/lib/db";
import { whatsappLink } from "@/lib/utils";

export default async function ContactPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "2349041140745";
  const wa = whatsappLink(phone, "Hello Storm & Johnson, I’d like to make an enquiry.");

  let socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  } | null = null;

  try {
    const company = await getCompany();
    socialLinks = company?.socialLinks || null;
  } catch (err) {
    if (!isMongoConnectionError(err)) console.error(err);
  }

  return (
    <div className="min-h-[70vh]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <div className="lg:pr-8">
            <h1 className="sj-display text-[34px] font-semibold">Let’s talk</h1>
            <p className="mt-3 text-[14px] leading-7 text-black/70">
              Reach out for product enquiries, bulk orders, and distributor partnerships.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[var(--brand2)]" />
                <div>
                  <div className="text-[14px] font-semibold">Office</div>
                  <a className="text-[13px] text-black/65 underline" href="tel:09066034767">
                    09066034767
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[var(--brand2)]" />
                <div>
                  <div className="text-[14px] font-semibold">WhatsApp</div>
                  <div className="text-[13px] text-black/65">+234 9041140745 · +234 7047906791</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-[var(--brand2)]" />
                <div>
                  <div className="text-[14px] font-semibold">Email</div>
                  <a
                    className="text-[13px] text-black/65 underline"
                    href="mailto:stormandjohnsonltd@gmail.com"
                  >
                    stormandjohnsonltd@gmail.com
                  </a>
                </div>
              </div>

              <div>
                <div className="text-[14px] font-semibold">Follow us</div>
                <div className="mt-3">
                  <SocialIcons links={socialLinks} tone="dark" />
                </div>
              </div>

              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-[14px] font-semibold text-white transition hover:brightness-110"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Continue on WhatsApp
              </a>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-[28px] bg-gradient-to-br from-[#0b1020] to-[#3a220f] px-6 py-10 sm:px-10">
          <h2 className="sj-display text-[28px] font-semibold text-white">
            Looking for lighting for a project?
          </h2>
          <p className="mt-3 max-w-xl text-[14px] leading-7 text-white/70">
            Browse our catalogue or apply to become a distributor and grow with Storm &amp; Johnson.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-5 py-3 text-[14px] font-semibold text-[#0b1020] transition hover:brightness-110"
            >
              View Products
            </Link>
            <Link
              href="/become-a-distributor"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--brand2)] px-5 py-3 text-[14px] font-semibold text-white transition hover:brightness-110"
            >
              Become a Distributor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
