"use client";

import Link from "next/link";
import { ProductImage } from "@/components/ProductImage";
import { formatNaira } from "@/lib/utils";

export type ProductCardData = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  images?: string[];
  brand?: { name: string; slug: string } | null;
  category?: { name: string; slug: string } | null;
  shortDescription?: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const img = product.images?.[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_30px_rgba(11,16,32,0.04)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--brand)]/35 hover:shadow-[0_24px_50px_rgba(11,16,32,0.12)]"
    >
      <div className="relative h-[210px] overflow-hidden bg-[#111827]">
        <div className="absolute inset-0 transition duration-700 group-hover:scale-[1.06]">
          <ProductImage src={img} alt={product.name} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent opacity-70 transition duration-500 group-hover:opacity-90" />
        <div className="absolute bottom-3 right-3">
          <div className="translate-y-2 rounded-full bg-white/95 px-3 py-1 text-[12px] font-semibold text-[#0b1020] opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            View
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand2)]">
          {product.brand?.name || "Storm & Johnson"}
        </div>
        <div className="mt-1 text-[12px] font-semibold text-black/50">
          {product.category?.name || "Lighting"}
        </div>
        <div className="sj-display mt-1 text-[18px] font-semibold leading-snug transition group-hover:text-[var(--brand2)]">
          {product.name}
        </div>
        {product.shortDescription ? (
          <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-black/60">
            {product.shortDescription}
          </p>
        ) : null}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[15px] font-semibold">{formatNaira(product.price)}</div>
          <div className="text-[12px] font-semibold text-[var(--brand2)] opacity-0 transition group-hover:opacity-100">
            Enquire →
          </div>
        </div>
      </div>
    </Link>
  );
}
