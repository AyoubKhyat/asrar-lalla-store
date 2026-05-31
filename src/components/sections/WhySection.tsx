"use client";

import { motion } from "framer-motion";

const reasons = [
  {
    emoji: "🧪",
    title: "Ingrédients Purs",
    description:
      "Sans parabènes, sans sulfates. Que des ingrédients naturels marocains.",
    color: "bg-pink-accent",
  },
  {
    emoji: "🌿",
    title: "100% Naturel",
    description:
      "Chaque ingrédient vient des régions les plus riches du Maroc.",
    color: "bg-mint",
  },
  {
    emoji: "🐰",
    title: "Cruelty Free",
    description:
      "Jamais testés sur les animaux. Beauté éthique et responsable.",
    color: "bg-lavender",
  },
  {
    emoji: "💰",
    title: "Prix Doux",
    description:
      "Qualité premium à prix accessible. La beauté pour toutes.",
    color: "bg-peach",
  },
  {
    emoji: "📦",
    title: "Packaging Cute",
    description:
      "Chaque commande dans notre boîte rose signature. Instagrammable !",
    color: "bg-pink-soft",
  },
  {
    emoji: "⚡",
    title: "Résultats Réels",
    description:
      "Des résultats visibles dès la première utilisation. Testez par vous-même.",
    color: "bg-sky",
  },
];

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

export default function WhySection() {
  return (
    <section id="secrets" className="py-20 px-4 bg-bg-soft">
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
              💕 NOS SECRETS
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-text font-[family-name:var(--font-display)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Pourquoi Elles Nous Adorent
          </motion.h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              className="bg-white rounded-3xl shadow-soft p-6 group"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{
                boxShadow: "0 8px 30px rgba(255,95,162,0.12)",
                y: -4,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Emoji circle */}
              <div
                className={`w-14 h-14 rounded-2xl ${reason.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                {reason.emoji}
              </div>

              <h3 className="font-[family-name:var(--font-display)] font-bold text-text text-lg mb-2">
                {reason.title}
              </h3>

              <p className="font-[family-name:var(--font-body)] text-text-light text-sm leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
