import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function WhatsAppFloat() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP || "2349041140745";
  const href = whatsappLink(phone, "Hello Storm & Johnson, I need lighting support.");

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-[13px] font-semibold text-white shadow-[0_12px_30px_rgba(37,211,102,0.45)] transition hover:scale-[1.03] hover:brightness-105"
    >
      <WhatsAppIcon className="h-5 w-5" />
      WhatsApp
    </a>
  );
}
