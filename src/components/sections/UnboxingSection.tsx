"use client";

import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Timeline data                                                      */
/* ------------------------------------------------------------------ */

const timelineSteps = [
  {
    emoji: "\u{1F380}",
    title: "Coffret Rose Signature",
    description:
      "Chaque commande arrive dans notre boîte rose, emballée avec amour",
  },
  {
    emoji: "\u{1F338}",
    title: "Papier de Soie Parfumé",
    description:
      "Vos produits sont enveloppés dans du papier de soie parfumé à la rose",
  },
  {
    emoji: "\u{1F48C}",
    title: "Carte de Remerciement",
    description:
      "Un mot personnalisé avec chaque commande, parce que vous le valez bien",
  },
  {
    emoji: "\u{1F381}",
    title: "Échantillon Gratuit",
    description:
      "Une surprise beauté offerte avec chaque commande pour découvrir nos nouveautés",
  },
  {
    emoji: "\u{1F4AC}",
    title: "Support WhatsApp",
    description:
      "Un suivi personnalisé sur WhatsApp du début à la fin",
  },
];

/* ------------------------------------------------------------------ */
/*  Shipping showcase card data                                        */
/* ------------------------------------------------------------------ */

const shippingCards = [
  {
    src: "/brand/shipping/shipping-box.svg",
    alt: "Coffret rose Asrar Lalla",
    caption: "Le Coffret Rose",
  },
  {
    src: "/brand/shipping/thank-you-card.svg",
    alt: "Carte de remerciement Asrar Lalla",
    caption: "Carte de Remerciement",
  },
  {
    src: "/brand/shipping/discount-card.svg",
    alt: "Carte de réduction Asrar Lalla",
    caption: "Code -15%",
  },
  {
    src: "/brand/shipping/referral-card.svg",
    alt: "Carte de parrainage Asrar Lalla",
    caption: "Code Parrainage",
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const containerV = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemV = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const cardV = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
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
/*  Shipping assets showcase grid                                      */
/* ------------------------------------------------------------------ */

function ShippingShowcase() {
  return (
    <motion.div
      className="mt-16 md:mt-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.h3
        className="text-center text-lg md:text-xl font-bold text-text mb-8 font-[family-name:var(--font-display)]"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Ce Qui Vous Attend Dans Votre Colis
      </motion.h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
        {shippingCards.map((card, i) => (
          <motion.div
            key={card.caption}
            className="bg-white rounded-2xl shadow-soft overflow-hidden group cursor-default hover:shadow-glow transition-shadow duration-300"
            custom={i}
            variants={cardV}
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="overflow-hidden">
              <img
                src={card.src}
                alt={card.alt}
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <div className="px-3 py-3 text-center">
              <p className="text-text text-xs md:text-sm font-semibold font-[family-name:var(--font-display)]">
                {card.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section component                                             */
/* ------------------------------------------------------------------ */

export default function UnboxingSection() {
  return (
    <section className="py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="inline-flex items-center gap-1.5 bg-pink-accent text-[#FF5FA2] text-xs font-semibold px-4 py-2 rounded-full mb-4 font-[family-name:var(--font-display)]">
              {"\u{1F4E6}"} L&apos;EXP&Eacute;RIENCE ASRAR LALLA
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-text font-[family-name:var(--font-display)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Plus Qu&apos;un Produit,{" "}
            <span className="gradient-text">Une Exp&eacute;rience</span>
          </motion.h2>
        </div>

        {/* ---- Desktop horizontal timeline ---- */}
        <motion.div
          className="hidden md:block"
          variants={containerV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Connecting line */}
          <div className="relative">
            <div className="absolute top-[38px] left-[10%] right-[10%] h-0.5 bg-border z-0">
              <motion.div
                className="h-full gradient-pink origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              />
            </div>

            <div className="relative z-10 grid grid-cols-5 gap-4">
              {timelineSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  className="flex flex-col items-center text-center"
                  variants={itemV}
                  custom={i}
                >
                  {/* Dot on the line */}
                  <motion.div
                    className="w-[76px] h-[76px] rounded-full bg-white border-3 border-[#FF5FA2] flex items-center justify-center text-3xl shadow-soft mb-5"
                    whileHover={{ scale: 1.1, boxShadow: "0 8px 30px rgba(255,95,162,0.2)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {step.emoji}
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    className="bg-white rounded-2xl shadow-soft p-5 w-full border border-border hover:shadow-card transition-shadow duration-300"
                    whileHover={{ y: -4 }}
                  >
                    <h3 className="font-bold text-text text-sm mb-2 font-[family-name:var(--font-display)]">
                      {step.title}
                    </h3>
                    <p className="text-text-light text-xs leading-relaxed font-[family-name:var(--font-body)]">
                      {step.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ---- Mobile vertical timeline ---- */}
        <motion.div
          className="md:hidden"
          variants={containerV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="relative pl-10">
            {/* Vertical line */}
            <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-border">
              <motion.div
                className="w-full gradient-pink origin-top"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                style={{ height: "100%" }}
              />
            </div>

            <div className="space-y-6">
              {timelineSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  className="relative"
                  variants={itemV}
                  custom={i}
                >
                  {/* Dot */}
                  <div className="absolute -left-10 top-4 w-9 h-9 rounded-full bg-white border-2 border-[#FF5FA2] flex items-center justify-center text-lg shadow-soft">
                    {step.emoji}
                  </div>

                  {/* Card */}
                  <div className="bg-white rounded-2xl shadow-soft p-5 border border-border">
                    <h3 className="font-bold text-text text-base mb-1.5 font-[family-name:var(--font-display)]">
                      {step.title}
                    </h3>
                    <p className="text-text-light text-sm leading-relaxed font-[family-name:var(--font-body)]">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Shipping assets showcase */}
        <ShippingShowcase />

        {/* Bottom tagline */}
        <motion.p
          className="text-center mt-10 text-text-light text-sm md:text-base font-[family-name:var(--font-body)] max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Chaque commande est pr&eacute;par&eacute;e avec soin pour que vous viviez un vrai moment de bonheur en ouvrant votre colis {"\u{1F495}"}
        </motion.p>
      </div>
    </section>
  );
}
