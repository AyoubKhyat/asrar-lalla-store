"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import Link from "next/link";
import { products } from "@/data/products";
import ProductVisual from "@/components/ui/ProductVisual";

const floatingEmojis = [
  { emoji: "🌸", x: "8%", y: "18%", size: "text-2xl", delay: 0 },
  { emoji: "✨", x: "90%", y: "14%", size: "text-xl", delay: 0.3 },
  { emoji: "💧", x: "5%", y: "55%", size: "text-lg", delay: 0.6 },
  { emoji: "🩷", x: "92%", y: "50%", size: "text-2xl", delay: 0.9 },
  { emoji: "🌸", x: "50%", y: "10%", size: "text-lg", delay: 0.7 },
];

const WHATSAPP_NUMBER = "212600000000";
const WHATSAPP_GREETING = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour ! 👋 Je voudrais commander des produits ASRAR LALLA.")}`;

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const blobX1 = useTransform(mouseX, [-1, 1], [-25, 25]);
  const blobY1 = useTransform(mouseY, [-1, 1], [-25, 25]);
  const blobX2 = useTransform(mouseX, [-1, 1], [20, -20]);
  const blobY2 = useTransform(mouseY, [-1, 1], [15, -15]);

  const emojiParallaxX = useTransform(mouseX, [-1, 1], [-15, 15]);
  const emojiParallaxY = useTransform(mouseY, [-1, 1], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const heroProduct = products.find((p) => p.id === "rose-water")!;

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden gradient-hero"
    >
      {/* Gradient mesh overlay */}
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />

      {/* Decorative blobs with parallax */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-pink-soft/40 blur-3xl animate-blob"
        style={{ x: blobX1, y: blobY1 }}
      />
      <motion.div
        className="absolute -bottom-48 -right-32 w-[500px] h-[500px] rounded-full bg-lavender/30 blur-3xl animate-blob"
        style={{
          x: blobX2,
          y: blobY2,
          animationDelay: "4s",
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-pink-accent/50 blur-2xl animate-blob"
        style={{
          x: blobX1,
          y: blobY2,
          animationDelay: "2s",
        }}
      />

      {/* Floating emojis (desktop only) */}
      <div className="hidden lg:block">
        {floatingEmojis.map((item, i) => (
          <motion.div
            key={i}
            className={`absolute ${item.size} select-none pointer-events-none`}
            style={{
              left: item.x,
              top: item.y,
              x: emojiParallaxX,
              y: emojiParallaxY,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ delay: item.delay + 0.8, duration: 0.6, ease: "backOut" }}
          >
            <motion.span
              className="block"
              animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {item.emoji}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pb-32"
        style={{ paddingTop: "calc(var(--total-header) + 1rem)" }}
      >
        {/* Product visual */}
        <motion.div
          className="relative mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="relative z-10">
            <ProductVisual product={heroProduct} size="xl" animate />
          </div>

          {/* Glow behind product */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-30"
            style={{
              background: `radial-gradient(circle, ${heroProduct.gradient[0]}, transparent)`,
            }}
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-center font-[family-name:var(--font-display)] font-bold leading-[1.1] tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-text">
            Beaut&eacute; Naturelle
          </span>
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl gradient-text mt-1">
            Marocaine
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mt-6 text-center text-base sm:text-lg md:text-xl text-text-light max-w-xl font-[family-name:var(--font-body)] leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Produits 100% naturels &agrave; partir de 5 DH. Paiement &agrave; la livraison. Livraison partout au Maroc.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-md sm:max-w-none justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link href="/products">
            <motion.button
              className="w-full sm:w-auto gradient-pink text-white font-semibold px-8 py-4 rounded-full text-base shadow-glow font-[family-name:var(--font-display)] cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: "0 16px 50px rgba(255,95,162,0.25)" }}
              whileTap={{ scale: 0.97 }}
            >
              Commander maintenant
            </motion.button>
          </Link>
          <a href={WHATSAPP_GREETING} target="_blank" rel="noopener noreferrer">
            <motion.button
              className="w-full sm:w-auto bg-[#25D366] text-white font-semibold px-8 py-4 rounded-full text-base shadow-soft font-[family-name:var(--font-display)] cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: "0 16px 50px rgba(37,211,102,0.25)" }}
              whileTap={{ scale: 0.97 }}
            >
              Commander sur WhatsApp &#128172;
            </motion.button>
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 mt-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <span className="text-sm text-text-muted font-[family-name:var(--font-body)]">
            &#128666; Livraison partout au Maroc
          </span>
          <span className="text-sm text-text-muted font-[family-name:var(--font-body)]">
            &#128181; Paiement &agrave; la livraison
          </span>
          <span className="text-sm text-text-muted font-[family-name:var(--font-body)]">
            &#128172; Confirmation WhatsApp
          </span>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-16 md:h-24"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
