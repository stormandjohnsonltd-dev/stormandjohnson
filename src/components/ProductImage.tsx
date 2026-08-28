type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

const LOCAL_BY_REMOTE: Record<string, string> = {
  "photo-1519710164239-da123dc03ef4": "/images/products/panel-light.jpg",
  "photo-1509395176047-4a66953fd231": "/images/products/solar-street-light.jpg",
  "photo-1518005020951-eccb494ad742": "/images/products/led-bulb.jpg",
  "photo-1558618666-fcd25c85f82e": "/images/products/bulkhead-lamp.jpg",
};

function resolveSrc(src?: string | null) {
  if (!src) return "/images/products/panel-light.jpg";

  // Local and Firebase / other remote URLs should render as-is.
  if (src.startsWith("/") || src.startsWith("blob:") || src.startsWith("data:")) return src;
  if (src.includes("/uploads/products/")) return src;
  if (
    src.includes("firebasestorage.googleapis.com") ||
    src.includes("firebasestorage.app") ||
    src.includes("googleapis.com")
  ) {
    return src;
  }

  for (const [id, local] of Object.entries(LOCAL_BY_REMOTE)) {
    if (src.includes(id)) return local;
  }

  if (src.includes("unsplash.com") || src.includes("pexels.com")) {
    return "/images/products/panel-light.jpg";
  }

  return src;
}

export function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  const resolved = resolveSrc(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resolved} alt={alt} className={`h-full w-full object-cover ${className}`} />
  );
}
