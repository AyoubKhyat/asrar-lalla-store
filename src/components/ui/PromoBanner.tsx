"use client";

import { useState, useRef, useEffect } from "react";

function setBannerHeight(px: number) {
  document.documentElement.style.setProperty("--banner-h", `${px}px`);
}

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);
  const [text, setText] = useState("🚚 Livraison offerte à partir de 99 DH · Paiement à la livraison 💵");
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        if (!s.promoBannerEnabled) {
          setVisible(false);
          setBannerHeight(0);
          return;
        }
        if (s.promoBannerText) setText(s.promoBannerText);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!visible) return;

    function measure() {
      if (bannerRef.current) {
        setBannerHeight(bannerRef.current.offsetHeight);
      }
    }

    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, [visible, text]);

  const handleDismiss = () => {
    setBannerHeight(0);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      className="fixed top-0 left-0 right-0 z-[52] bg-pink text-white text-center py-2.5 px-10 text-xs md:text-sm font-medium"
    >
      <span>{text}</span>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
        aria-label="Fermer la bannière"
      >
        ✕
      </button>
    </div>
  );
}
