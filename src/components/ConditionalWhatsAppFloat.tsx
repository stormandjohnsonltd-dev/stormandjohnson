"use client";

import { usePathname } from "next/navigation";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export function ConditionalWhatsAppFloat({ phone }: { phone: string }) {
  const pathname = usePathname();
  const isProductDetail =
    pathname.startsWith("/products/") && pathname !== "/products";

  return (
    <WhatsAppFloat
      phone={phone}
      className={isProductDetail ? "hidden lg:inline-flex" : undefined}
    />
  );
}
