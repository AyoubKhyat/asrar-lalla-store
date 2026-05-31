"use client";

import { motion } from "framer-motion";
import { instagramReviews } from "@/data/config";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

const previewVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

/* ------------------------------------------------------------------ */
/*  Instagram feed preview section                                     */
/* ------------------------------------------------------------------ */

function InstaFeedPreview() {
  return (
    <motion.div
      className="mb-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Sub-header */}
      <motion.h3
        className="text-center text-lg md:text-xl font-bold text-text mb-8 font-[family-name:var(--font-display)]"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Notre Feed Instagram
      </motion.h3>

      {/* Template previews row */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 mb-8">
        {/* Feed template - phone frame */}
        <motion.div
          className="w-[220px] md:w-[240px] rounded-[2rem] border-[6px] border-gray-800 bg-white overflow-hidden shadow-soft hover:shadow-glow transition-shadow duration-300"
          custom={0}
          variants={previewVariants}
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="bg-gray-800 h-4 flex justify-center items-center">
            <div className="w-12 h-1.5 bg-gray-700 rounded-full" />
          </div>
          <img
            src="/brand/instagram/feed-templates.svg"
            alt="Instagram feed templates Asrar Lalla"
            className="w-full h-auto"
            loading="lazy"
          />
        </motion.div>

        {/* Story template - taller phone frame */}
        <motion.div
          className="w-[200px] md:w-[210px] rounded-[2rem] border-[6px] border-gray-800 bg-white overflow-hidden shadow-soft hover:shadow-glow transition-shadow duration-300"
          custom={1}
          variants={previewVariants}
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="bg-gray-800 h-4 flex justify-center items-center">
            <div className="w-12 h-1.5 bg-gray-700 rounded-full" />
          </div>
          <img
            src="/brand/instagram/story-template.svg"
            alt="Instagram story template Asrar Lalla"
            className="w-full h-auto"
            loading="lazy"
          />
        </motion.div>

        {/* Highlight covers - smaller display */}
        <motion.div
          className="w-[180px] md:w-[200px]"
          custom={2}
          variants={previewVariants}
        >
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-glow transition-shadow duration-300 p-3">
            <p className="text-center text-[10px] text-text-muted font-[family-name:var(--font-body)] mb-2 uppercase tracking-wider">
              Highlights
            </p>
            <img
              src="/brand/instagram/highlight-covers.svg"
              alt="Instagram highlight covers Asrar Lalla"
              className="w-full h-auto"
              loading="lazy"
            />
          </div>
        </motion.div>
      </div>

      {/* Instagram profile badge */}
      <motion.div
        className="flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#E1306C] p-0.5">
          <img
            src="/brand/logos/instagram-avatar.svg"
            alt="Avatar Instagram Asrar Lalla"
            className="w-full h-auto rounded-full"
            loading="lazy"
          />
        </div>
        <div>
          <p className="font-[family-name:var(--font-display)] font-bold text-text text-sm">
            @asrarlalla
          </p>
          <p className="font-[family-name:var(--font-body)] text-text-muted text-xs">
            +15K abonnés
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section component                                             */
/* ------------------------------------------------------------------ */

export default function InstaProofSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="inline-flex items-center gap-1.5 bg-pink-accent text-pink text-xs font-semibold px-4 py-2 rounded-full mb-4 font-[family-name:var(--font-display)]">
              {"\u{1F4F8}"} SUR INSTAGRAM
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-text font-[family-name:var(--font-display)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            La Communaut&eacute; ASRAR LALLA
          </motion.h2>
        </div>

        {/* Instagram feed preview */}
        <InstaFeedPreview />

        {/* Review cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {instagramReviews.map((review, i) => (
            <motion.div
              key={review.username}
              className="bg-white rounded-2xl shadow-soft p-5 group hover:shadow-glow transition-shadow duration-300"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Top: username + Instagram label */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {/* Avatar circle */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center">
                    <div className="w-[31px] h-[31px] rounded-full bg-white flex items-center justify-center">
                      <span className="text-xs font-bold text-pink font-[family-name:var(--font-display)]">
                        {review.username.replace("@", "").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <span className="font-[family-name:var(--font-display)] font-bold text-text text-sm">
                    <span className="text-pink">@</span>
                    {review.username.replace("@", "")}
                  </span>
                </div>
                <span className="text-[10px] font-[family-name:var(--font-body)] text-text-muted bg-bg-soft px-2 py-1 rounded-full">
                  Instagram
                </span>
              </div>

              {/* Review text */}
              <p className="font-[family-name:var(--font-body)] text-text text-sm leading-relaxed mb-4">
                {review.text}
              </p>

              {/* Bottom: heart + likes + product */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {/* Heart icon */}
                  <svg
                    className="w-4 h-4 text-red-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="font-[family-name:var(--font-body)] text-text-muted text-xs">
                    {review.likes.toLocaleString()}
                  </span>
                </div>

                <span className="inline-block bg-pink-accent text-pink text-[11px] font-medium px-2.5 py-1 rounded-full font-[family-name:var(--font-body)]">
                  {review.product}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Follow CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.a
            href="https://instagram.com/asrarlalla"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border-2 border-pink text-pink font-semibold px-8 py-3.5 rounded-full text-sm font-[family-name:var(--font-display)] hover:bg-pink hover:text-white transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Instagram icon */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
            Suivez-nous @asrarlalla
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
