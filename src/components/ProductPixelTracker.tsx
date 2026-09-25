"use client";

import { useEffect } from "react";
import { trackAdvertisedProductView } from "@/lib/facebookPixel";

export function ProductPixelTracker({
  advertised,
  productId,
  productName,
  price,
}: {
  advertised: boolean;
  productId: string;
  productName: string;
  price: number;
}) {
  useEffect(() => {
    trackAdvertisedProductView({ advertised, productId, productName, price });
  }, [advertised, productId, productName, price]);

  return null;
}
