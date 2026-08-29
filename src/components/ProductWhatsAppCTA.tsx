import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

type ProductWhatsAppCTAProps = {
  phone: string;
  productName: string;
  className?: string;
};

function orderMessage(productName: string) {
  return `Hello Storm & Johnson, I want to order: ${productName}`;
}

export function ProductWhatsAppCTA({ phone, productName, className = "" }: ProductWhatsAppCTAProps) {
  const waUrl = whatsappLink(phone, orderMessage(productName));

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noreferrer"
      className={`flex items-start gap-3 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-3 transition hover:bg-[#25D366]/15 ${className}`}
    >
      <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
        <WhatsAppIcon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-[14px] font-semibold text-[#075E54]">
          Prefer WhatsApp? Chat with us now
        </span>
        <span className="mt-1 block text-[12px] leading-5 text-[#075E54]/80">
          Send your product interest instantly. Our sales team replies quickly with pricing,
          availability and delivery options.
        </span>
      </span>
    </a>
  );
}

export function ProductWhatsAppOrderButton({
  phone,
  productName,
  className = "",
}: ProductWhatsAppCTAProps) {
  const waUrl = whatsappLink(phone, orderMessage(productName));

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-[14px] font-semibold text-white transition hover:brightness-110 ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      Order on WhatsApp
    </a>
  );
}

export function ProductWhatsAppMobileBar({ phone, productName }: ProductWhatsAppCTAProps) {
  const waUrl = whatsappLink(phone, orderMessage(productName));

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <a
        href={waUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3.5 text-[14px] font-semibold text-white shadow-[0_-4px_20px_rgba(11,16,32,0.08)] transition hover:brightness-110"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Order on WhatsApp
      </a>
    </div>
  );
}
