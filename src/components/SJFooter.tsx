import Link from "next/link";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { SocialIcons } from "@/components/SocialIcons";
import { getCompany } from "@/lib/queries";
import { whatsappLink } from "@/lib/utils";
import { isMongoConnectionError } from "@/lib/db";

export async function SJFooter() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "2349041140745";
  const wa = whatsappLink(phone, "Hello Storm & Johnson, I’d like product support.");

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
    if (!isMongoConnectionError(err)) {
      // Keep footer rendering even if company lookup fails for other reasons.
      console.error(err);
    }
  }

  return (
    <footer className="mt-auto border-t border-black/5 bg-[#0b1020] text-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="sj-display text-[22px] font-semibold">
              Storm <span className="text-[var(--brand)]">&</span> Johnson
            </div>
            <p className="mt-3 max-w-sm text-[13px] leading-6 text-white/65">
              Premium energy-efficient lighting for homes, estates, offices and industries across
              Nigeria — Pololux, Qiming &amp; Liton.
            </p>
            <div className="mt-5">
              <SocialIcons links={socialLinks} tone="light" />
            </div>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-110"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>

          <div className="md:col-span-3">
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">
              Explore
            </div>
            <div className="mt-4 flex flex-col gap-2.5 text-[13px]">
              <Link className="text-white/70 transition hover:text-white" href="/">
                Home
              </Link>
              <Link className="text-white/70 transition hover:text-white" href="/products">
                Products
              </Link>
              <Link className="text-white/70 transition hover:text-white" href="/about">
                About Us
              </Link>
              <Link className="text-white/70 transition hover:text-white" href="/become-a-distributor">
                Become a Distributor
              </Link>
              <Link className="text-white/70 transition hover:text-white" href="/contact">
                Contact
              </Link>
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45">
              Contact
            </div>
            <div className="mt-4 space-y-2 text-[13px] text-white/70">
              <div>
                Office:{" "}
                <a className="underline decoration-white/20 hover:text-white" href="tel:09066034767">
                  09066034767
                </a>
              </div>
              <div>WhatsApp: +234 9041140745 · +234 7047906791</div>
              <div>
                Email:{" "}
                <a
                  className="underline decoration-white/20 hover:text-white"
                  href="mailto:stormandjohnsonltd@gmail.com"
                >
                  stormandjohnsonltd@gmail.com
                </a>
              </div>
              <div>Lagos, Nigeria</div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[12px] text-white/45">
            © {new Date().getFullYear()} Storm &amp; Johnson Limited. All rights reserved.
          </div>
          <div className="text-[12px] text-white/45">Built for brighter, more efficient spaces.</div>
        </div>
      </div>
    </footer>
  );
}
