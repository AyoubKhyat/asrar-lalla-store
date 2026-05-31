"use client";

import { motion } from "framer-motion";

const badges = [
  { icon: "🚚", text: "Livraison partout au Maroc", sub: "24h-72h selon la ville" },
  { icon: "💵", text: "Paiement à la livraison", sub: "100% sécurisé" },
  { icon: "💬", text: "Confirmation WhatsApp", sub: "Suivi personnalisé" },
  { icon: "🌿", text: "Produits 100% Naturels", sub: "Ingrédients purs" },
];

export default function DeliveryBadges({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.map((b) => (
          <span key={b.text} className="inline-flex items-center gap-1.5 text-xs text-text-light bg-bg-soft rounded-full px-3 py-1.5 border border-border">
            <span>{b.icon}</span> {b.text}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {badges.map((badge, i) => (
        <motion.div
          key={badge.text}
          className="bg-white rounded-2xl p-4 shadow-soft border border-border text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
        >
          <span className="text-2xl block mb-2">{badge.icon}</span>
          <p className="text-text text-xs font-semibold leading-tight">{badge.text}</p>
          <p className="text-text-muted text-[10px] mt-0.5">{badge.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}
