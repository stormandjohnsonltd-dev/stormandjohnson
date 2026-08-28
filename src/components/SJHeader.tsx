"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/become-a-distributor", label: "Become a Distributor" },
  { href: "/contact", label: "Contact Us" },
];

export function SJHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="sj-display text-[16px] font-semibold leading-tight text-black">
          Storm <span className="text-[var(--brand2)]">&</span> Johnson
        </Link>

        <nav className="hidden items-center gap-6 text-[13px] md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-black/70 transition hover:text-black"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/products"
            className={cn(
              "inline-flex items-center justify-center rounded-lg px-4 py-2 text-[13px] font-semibold",
              "bg-black text-white transition hover:bg-black/90"
            )}
          >
            Order a Product
          </Link>
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center rounded-lg border border-black/10 bg-white px-3 py-2 text-[13px] font-semibold transition hover:bg-black/5"
          >
            Admin
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-black/10 md:hidden"
        >
          <span className={cn("h-0.5 w-5 bg-black/80 transition", open && "translate-y-2 rotate-45")} />
          <span className={cn("h-0.5 w-5 bg-black/80 transition", open && "opacity-0")} />
          <span className={cn("h-0.5 w-5 bg-black/80 transition", open && "-translate-y-2 -rotate-45")} />
        </button>
      </div>

      {open ? (
        <div className="border-t border-black/5 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[14px] text-black/80 transition hover:bg-black/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex gap-2">
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-black px-4 py-2.5 text-center text-[13px] font-semibold text-white"
            >
              Order
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-black/10 px-4 py-2.5 text-[13px] font-semibold"
            >
              Admin
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
