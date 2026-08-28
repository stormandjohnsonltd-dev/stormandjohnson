import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries";
import { ProductEnquiryForm } from "@/components/ProductEnquiryForm";
import { ProductGallery } from "@/components/ProductGallery";
import { formatNaira } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const images = product.images?.length ? product.images : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <ProductGallery images={images} name={product.name} />

          <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-[12px] font-semibold text-black/55">
              {product.brand?.name} • {product.category?.name}
            </div>
            <h1 className="sj-display mt-2 text-[28px] font-semibold leading-[1.1]">
              {product.name}
            </h1>
            <p className="mt-3 text-[14px] leading-7 text-black/70">
              {product.shortDescription || product.description}
            </p>

            <div className="mt-5 flex items-baseline gap-3">
              <div className="sj-display text-[24px] font-semibold text-[var(--brand2)]">
                {formatNaira(product.price)}
              </div>
              {product.compareAtPrice ? (
                <div className="text-[13px] font-semibold text-black/45 line-through">
                  {formatNaira(product.compareAtPrice)}
                </div>
              ) : null}
            </div>

            {product.specs?.length ? (
              <div className="mt-6">
                <div className="text-[12px] font-semibold text-black/55">Specs</div>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {product.specs.slice(0, 6).map((s, idx) => (
                    <div key={idx} className="rounded-xl border border-black/10 px-3 py-2">
                      <div className="text-[12px] font-semibold text-black/60">{s.label}</div>
                      <div className="text-[13px] font-semibold">{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {product.features?.length ? (
              <div className="mt-6">
                <div className="text-[12px] font-semibold text-black/55">Highlights</div>
                <ul className="mt-3 space-y-2">
                  {product.features.slice(0, 6).map((f, i) => (
                    <li key={i} className="flex gap-3 text-[14px] text-black/70">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--brand2)]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="sj-rise-in lg:sticky lg:top-24 lg:self-start">
          <ProductEnquiryForm productSlug={product.slug} productName={product.name} />
        </div>
      </div>
    </div>
  );
}
