import Link from "next/link";
import {
  getFeaturedProducts,
  getProducts,
  getTopSellingProducts,
} from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, topSelling, allProducts] = await Promise.all([
    getFeaturedProducts(4),
    getTopSellingProducts(4),
    getProducts({ sort: "featured", limit: 8 }),
  ]);

  return (
    <div>
      <section className="relative min-h-[82vh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/heroes/home-hero.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(11,16,32,0.92) 0%, rgba(11,16,32,0.72) 45%, rgba(42,26,15,0.55) 100%)",
          }}
        />
        <div
          aria-hidden
          className="sj-glow absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(245,179,1,0.35) 0%, rgba(255,106,0,0.12) 45%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto flex min-h-[82vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-24">
          <div className="sj-rise-in max-w-3xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Energy-efficient lighting · Nigeria
            </p>
            <h1 className="sj-display mt-4 text-[44px] font-semibold leading-[1.02] text-white sm:text-[64px]">
              Storm &amp; Johnson Limited
            </h1>
            <p className="mt-5 max-w-[540px] text-[15px] leading-7 text-white/75 sm:text-[16px]">
              Premium solar street lights, LED bulbs, bulkhead lamps and panel lights designed to
              cut energy cost without compromising brightness.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--brand)] px-6 py-3.5 text-[14px] font-semibold text-[#0b1020] transition hover:brightness-110 hover:shadow-[0_10px_30px_rgba(245,179,1,0.35)]"
              >
                Browse Products
              </Link>
              <Link
                href="/become-a-distributor"
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-[14px] font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/12"
              >
                Become a Distributor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="sj-display text-[30px] font-semibold">Featured products</h2>
            <p className="mt-2 text-[14px] text-black/65">Handpicked lighting for high-demand projects.</p>
          </div>
          <Link href="/products" className="hidden text-[13px] font-semibold text-[var(--brand2)] hover:underline sm:inline">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.length === 0 ? (
            <p className="col-span-full text-[14px] text-black/55">
              Featured products will appear here soon.
            </p>
          ) : (
            featured.map((p) => <ProductCard key={p._id} product={p} />)
          )}
        </div>
      </section>

      <section className="border-y border-black/5 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="sj-display text-[30px] font-semibold">Top selling</h2>
              <p className="mt-2 text-[14px] text-black/65">Popular choices across homes, estates and businesses.</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {topSelling.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="sj-display text-[30px] font-semibold">All products</h2>
            <p className="mt-2 text-[14px] text-black/65">Explore our full catalogue of premium lighting.</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--brand2)] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-110"
          >
            Shop catalogue
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {allProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
