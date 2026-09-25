"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { flushFacebookEventQueue, setFacebookConversionEvents } from "@/lib/facebookPixel";

export function FacebookPixel({
  pixelIds,
  conversionEvents = [],
}: {
  pixelIds: string[];
  conversionEvents?: string[];
}) {
  const pathname = usePathname();
  const firstPath = useRef(true);
  const ids = pixelIds.filter((id) => /^[A-Za-z0-9._-]+$/.test(id));
  const conversionKey = conversionEvents.join(",");

  useEffect(() => {
    setFacebookConversionEvents(conversionKey ? conversionKey.split(",") : []);
  }, [conversionKey]);

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    if (typeof window.fbq !== "function" || pathname.startsWith("/admin")) return;
    window.fbq("track", "PageView");
  }, [pathname]);

  if (!ids.length || pathname.startsWith("/admin")) return null;

  const initCalls = ids.map((id) => `fbq('init','${id}');`).join("");

  return (
    <Script
      id="facebook-pixel"
      strategy="afterInteractive"
      onReady={() => flushFacebookEventQueue()}
    >
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        ${initCalls}
        fbq('track','PageView');
      `}
    </Script>
  );
}
