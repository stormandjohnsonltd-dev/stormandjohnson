import type { ReactNode } from "react";

type SocialLinks = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
};

const defaults: Required<SocialLinks> = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  twitter: "https://x.com",
  linkedin: "https://linkedin.com",
};

function IconWrap({
  href,
  label,
  children,
  tone = "dark",
}: {
  href: string;
  label: string;
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  const cls =
    tone === "light"
      ? "inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15"
      : "inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black/70 transition hover:border-[var(--brand)]/40 hover:text-[var(--brand2)]";

  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className={cls}>
      {children}
    </a>
  );
}

export function SocialIcons({
  links,
  tone = "dark",
}: {
  links?: SocialLinks | null;
  tone?: "dark" | "light";
}) {
  const social = {
    facebook: links?.facebook || defaults.facebook,
    instagram: links?.instagram || defaults.instagram,
    twitter: links?.twitter || defaults.twitter,
    linkedin: links?.linkedin || defaults.linkedin,
  };

  return (
    <div className="flex items-center gap-2.5">
      <IconWrap href={social.facebook} label="Facebook" tone={tone}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
        </svg>
      </IconWrap>
      <IconWrap href={social.instagram} label="Instagram" tone={tone}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.2-.9a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
        </svg>
      </IconWrap>
      <IconWrap href={social.twitter} label="X (Twitter)" tone={tone}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M18.9 2H21l-6.6 7.5L22 22h-6.2l-4.9-6.4L5.4 22H3.3l7.1-8.1L2 2h6.3l4.4 5.8L18.9 2zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20z" />
        </svg>
      </IconWrap>
      <IconWrap href={social.linkedin} label="LinkedIn" tone={tone}>
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M6.9 8.8H3.6V21h3.3V8.8zM5.2 3A1.9 1.9 0 1 0 5.2 6.8 1.9 1.9 0 0 0 5.2 3zM21 21h-3.3v-6.2c0-1.5-.5-2.5-1.8-2.5-1 0-1.6.7-1.8 1.3-.1.2-.1.6-.1.9V21H10.7s.1-10.3 0-11.4h3.3v1.6c.4-.7 1.2-1.8 3-1.8 2.2 0 3.9 1.4 3.9 4.5V21z" />
        </svg>
      </IconWrap>
    </div>
  );
}
