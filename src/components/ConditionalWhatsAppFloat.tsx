"use client";

import { usePathname } from "next/navigation";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export function ConditionalWhatsAppFloat() {
  const pathname = usePathname();
  const isProductDetail =
    pathname.startsWith("/products/") && pathname !== "/products";

  if (isProductDetail) {
    return (
      <div className="hidden lg:block">
        <WhatsAppFloat />
      </div>
    );
  }

  return <WhatsAppFloat />;
}
