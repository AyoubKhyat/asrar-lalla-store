"use client";

import { motion } from "framer-motion";
import { reviews } from "@/data/products";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${
            star <= rating ? "text-yellow-400" : "text-gray-200"
          }`}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}

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

export default function ReviewsSection() {
  return (
    <section id="reviews" className="py-20 px-4 bg-bg-soft">
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
              💬 AVIS
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-text font-[family-name:var(--font-display)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Ce Qu&apos;elles{" "}
            <span className="gradient-text">Disent</span>
          </motion.h2>
        </div>

        {/* Masonry layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              className="break-inside-avoid bg-white rounded-3xl shadow-soft p-6 group"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{
                boxShadow: "0 8px 30px rgba(255,95,162,0.12)",
                y: -2,
              }}
            >
              {/* Stars */}
              <StarDisplay rating={review.rating} />

              {/* Review text */}
              <p className="mt-3 text-text text-sm leading-relaxed font-[family-name:var(--font-body)]">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-4 flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full gradient-pink flex items-center justify-center text-white font-bold text-sm font-[family-name:var(--font-display)]">
                  {review.avatar}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-[family-name:var(--font-display)] font-semibold text-text text-sm">
                      {review.name}
                    </span>
                    {review.city && (
                      <span className="text-text-muted text-[11px] font-[family-name:var(--font-body)]">
                        {review.city}
                      </span>
                    )}
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 bg-success text-success-text text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        V&eacute;rifi&eacute;
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
