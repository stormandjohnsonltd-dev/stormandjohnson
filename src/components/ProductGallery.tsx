"use client";

import { useState } from "react";
import { ProductImage } from "@/components/ProductImage";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const gallery = images.length > 0 ? images : [""];
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const current = gallery[active] || gallery[0];

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <button
          type="button"
          onClick={() => setZoomed(true)}
          className="relative block h-[320px] w-full overflow-hidden bg-black/5 text-left sm:h-[420px]"
          aria-label="Zoom product image"
        >
          <ProductImage src={current || null} alt={name} />
          <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
            Click to zoom
          </div>
        </button>

        {gallery.length > 1 ? (
          <div className="flex gap-2 overflow-x-auto border-t border-black/5 p-3">
            {gallery.map((src, idx) => (
              <button
                key={`${src}-${idx}`}
                type="button"
                onClick={() => setActive(idx)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border transition ${
                  active === idx
                    ? "border-[var(--brand2)] ring-2 ring-[var(--brand)]/30"
                    : "border-black/10 hover:border-black/25"
                }`}
              >
                <ProductImage src={src || null} alt={`${name} ${idx + 1}`} />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {zoomed ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1.5 text-[13px] font-semibold text-white backdrop-blur hover:bg-white/25"
            onClick={() => setZoomed(false)}
          >
            Close
          </button>
          <div
            className="relative h-[70vh] w-full max-w-4xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ProductImage src={current || null} alt={name} />
          </div>
        </div>
      ) : null}
    </>
  );
}
