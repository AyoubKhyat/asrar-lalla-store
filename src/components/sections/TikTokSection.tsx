"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { tiktokVideos } from "@/data/config";
import { getProduct } from "@/data/products";

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

/* ------------------------------------------------------------------ */
/*  Featured TikTok brand template cards                               */
/* ------------------------------------------------------------------ */

const featuredTemplates = [
  {
    src: "/brand/tiktok/cover-template.svg",
    alt: "TikTok cover template Asrar Lalla",
    label: "Notre Style TikTok",
  },
  {
    src: "/brand/tiktok/hook-screen.svg",
    alt: "TikTok hook screen Asrar Lalla",
    label: "Hook Signature",
  },
];

export default function TikTokSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="tiktok" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="inline-flex items-center gap-1.5 bg-pink-accent text-pink text-xs font-semibold px-4 py-2 rounded-full mb-4 font-[family-name:var(--font-display)]">
              {"\u{1F4F1}"} VU SUR TIKTOK
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-text font-[family-name:var(--font-display)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Elles en{" "}
            <span className="gradient-text">Parlent</span>
          </motion.h2>
        </div>

        {/* Featured brand template cards */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto mb-10">
          {featuredTemplates.map((tmpl, i) => (
            <motion.div
              key={tmpl.label}
              className="relative rounded-3xl overflow-hidden aspect-[9/16] group cursor-default"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Image
                src={tmpl.src}
                alt={tmpl.alt}
                width={300}
                height={400}
                className="w-full h-full object-cover"
              />

              {/* Overlay label */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="font-[family-name:var(--font-display)] font-bold text-white text-sm md:text-base">
                  {tmpl.label}
                </span>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-glow rounded-3xl" />
            </motion.div>
          ))}
        </div>

        {/* Video cards - horizontal scroll on mobile, grid on desktop */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 lg:grid-cols-6 md:overflow-visible md:pb-0 md:snap-none"
        >
          {tiktokVideos.map((video, i) => {
            const product = getProduct(video.product);
            const productSlug = product?.slug ?? video.product;

            return (
              <motion.div
                key={video.id}
                className="flex-shrink-0 w-[42vw] md:w-auto snap-center"
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Link href={`/products/${productSlug}`}>
                  <motion.div
                    className="relative rounded-3xl overflow-hidden aspect-[9/16] group cursor-pointer"
                    style={{
                      background: `linear-gradient(160deg, ${video.color}80, ${video.color}CC, ${video.color}40)`,
                    }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-10">
                      <div
                        className="absolute top-[20%] left-[10%] w-20 h-20 rounded-full blur-xl"
                        style={{ background: video.color }}
                      />
                      <div
                        className="absolute bottom-[30%] right-[10%] w-16 h-16 rounded-full blur-xl"
                        style={{ background: video.color }}
                      />
                    </div>

                    {/* Views badge - top right */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full font-[family-name:var(--font-body)]">
                        {"▶"} {video.views}
                      </span>
                    </div>

                    {/* TikTok logo area - top left */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.42 6.26 6.26 0 001.82-4.44V8.76a8.26 8.26 0 004.77 1.51V6.84a4.86 4.86 0 01-1.01-.15z" />
                        </svg>
                      </div>
                    </div>

                    {/* Play button - center */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <motion.div
                        className="w-14 h-14 rounded-full bg-white/90 shadow-glow flex items-center justify-center group-hover:bg-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <svg
                          className="w-6 h-6 text-pink ml-0.5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Bottom gradient overlay with info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pt-16 z-10">
                      <p className="font-[family-name:var(--font-display)] font-bold text-white text-xs mb-0.5">
                        {video.username}
                      </p>
                      <p className="font-[family-name:var(--font-body)] text-white/80 text-[11px] leading-snug line-clamp-2 mb-2">
                        {video.caption}
                      </p>
                      {product && (
                        <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full font-[family-name:var(--font-body)]">
                          {"\u{1F6CD}️"} {product.name_fr}
                        </span>
                      )}
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-glow rounded-3xl" />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
