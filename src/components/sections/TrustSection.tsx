"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trustBadges, deliveryPrices } from "@/data/config";

const badgeVariants = {
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

export default function TrustSection() {
  const [deliveryOpen, setDeliveryOpen] = useState(false);

  return (
    <section id="trust" className="py-20 px-4 bg-bg-soft">
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
              🤝 CONFIANCE
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-text font-[family-name:var(--font-display)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Pourquoi Nous Faire Confiance
          </motion.h2>
        </div>

        {/* Trust badges grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5 mb-12">
          {trustBadges.map((badge, i) => (
            <motion.div
              key={badge.title}
              className="bg-white rounded-2xl shadow-soft p-5 text-center group hover:shadow-glow transition-shadow duration-300"
              custom={i}
              variants={badgeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {badge.icon}
              </div>
              <h3 className="font-[family-name:var(--font-display)] font-bold text-text text-sm mb-1.5 leading-snug">
                {badge.title}
              </h3>
              <p className="font-[family-name:var(--font-body)] text-text-muted text-xs leading-relaxed">
                {badge.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Delivery prices accordion */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className="w-full bg-white rounded-2xl shadow-soft px-6 py-4 flex items-center justify-between cursor-pointer group hover:shadow-glow transition-shadow"
            onClick={() => setDeliveryOpen(!deliveryOpen)}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚚</span>
              <span className="font-[family-name:var(--font-display)] font-semibold text-text text-base">
                Tarifs de livraison
              </span>
            </div>
            <motion.svg
              className="w-5 h-5 text-pink"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              animate={{ rotate: deliveryOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
          </motion.button>

          <AnimatePresence>
            {deliveryOpen && (
              <motion.div
                className="overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="mt-3 bg-white rounded-2xl shadow-soft overflow-hidden">
                  {/* Table header */}
                  <div className="grid grid-cols-3 gap-4 px-6 py-3 bg-pink-accent/60 border-b border-pink-soft/30">
                    <span className="font-[family-name:var(--font-display)] font-semibold text-text text-sm">
                      Ville
                    </span>
                    <span className="font-[family-name:var(--font-display)] font-semibold text-text text-sm text-center">
                      Prix
                    </span>
                    <span className="font-[family-name:var(--font-display)] font-semibold text-text text-sm text-right">
                      D&eacute;lai
                    </span>
                  </div>

                  {/* Table rows */}
                  {deliveryPrices.map((item, i) => (
                    <div
                      key={item.city}
                      className={`grid grid-cols-3 gap-4 px-6 py-3 ${
                        i % 2 === 0 ? "bg-pink-accent/20" : "bg-white"
                      }`}
                    >
                      <span className="font-[family-name:var(--font-body)] text-text text-sm">
                        {item.city}
                      </span>
                      <span className="font-[family-name:var(--font-body)] text-sm text-center">
                        {item.price === 0 ? (
                          <span className="text-success-text font-semibold">Gratuit</span>
                        ) : (
                          <span className="text-text">{item.price} DH</span>
                        )}
                      </span>
                      <span className="font-[family-name:var(--font-body)] text-text-light text-sm text-right">
                        {item.delay}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
