"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/data/products";

/* ------------------------------------------------------------------ */
/*  Notification data                                                  */
/* ------------------------------------------------------------------ */

const moroccanNames = [
  "Fatima",
  "Nour",
  "Amina",
  "Yasmine",
  "Salma",
  "Khadija",
  "Hajar",
  "Zineb",
  "Imane",
  "Rania",
  "Sara",
  "Meryem",
  "Houda",
  "Layla",
  "Souad",
];

const cities = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Nador",
  "Safi",
];

function buildNotifications(): string[] {
  const prods = products;
  const notes: string[] = [];

  // Orders
  for (let i = 0; i < 4; i++) {
    const name = moroccanNames[i % moroccanNames.length];
    const city = cities[i % cities.length];
    const prod = prods[i % prods.length];
    notes.push(
      `🛒 ${name} de ${city} vient de commander ${prod.name_fr}`
    );
  }

  // Reviews
  for (let i = 0; i < 3; i++) {
    const name = moroccanNames[(i + 4) % moroccanNames.length];
    const city = cities[(i + 3) % cities.length];
    notes.push(
      `⭐ ${name} de ${city} a laissé un avis 5 étoiles`
    );
  }

  // Shipped
  for (let i = 0; i < 2; i++) {
    const city = cities[(i + 6) % cities.length];
    const orderNum = String(87 + i).padStart(4, "0");
    notes.push(
      `📦 Commande #AL-2026-${orderNum} expédiée vers ${city}`
    );
  }

  // Trending
  const trendingProds = prods.filter((p) => p.is_trending);
  for (let i = 0; i < 2; i++) {
    const prod = trendingProds[i % trendingProds.length];
    const sales = 15 + Math.floor(Math.random() * 30);
    notes.push(
      `🔥 ${prod.name_fr} est en tendance — ${sales} ventes aujourd'hui`
    );
  }

  // Beauty box
  for (let i = 0; i < 2; i++) {
    const name = moroccanNames[(i + 8) % moroccanNames.length];
    const city = cities[(i + 8) % cities.length];
    const count = 2 + Math.floor(Math.random() * 4);
    notes.push(
      `💕 ${name} de ${city} a ajouté ${count} produits à sa Beauty Box`
    );
  }

  return notes;
}

/* ------------------------------------------------------------------ */
/*  Floating notification component                                    */
/* ------------------------------------------------------------------ */

const notifVariants = {
  hidden: { opacity: 0, y: 60, x: -20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: { type: "spring" as const, damping: 22, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    y: 20,
    x: -40,
    scale: 0.85,
    transition: { duration: 0.3 },
  },
};

export default function SocialProof() {
  const [currentNotif, setCurrentNotif] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [minutesAgo, setMinutesAgo] = useState(3);

  const notifications = useMemo(() => buildNotifications(), []);

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hidden = sessionStorage.getItem("asrar-social-proof-hidden");
      if (hidden === "true") setDismissed(true);
    }
  }, []);

  // Cycle notifications
  useEffect(() => {
    if (dismissed) return;

    let idx = 0;

    // Show first notification after a short delay
    const initialTimer = setTimeout(() => {
      setCurrentNotif(notifications[0]);
      setMinutesAgo(1 + Math.floor(Math.random() * 15));
      idx = 1;
    }, 3000);

    // Cycle every 5 seconds
    const interval = setInterval(() => {
      setCurrentNotif(null);

      // Brief gap before showing next
      setTimeout(() => {
        setCurrentNotif(notifications[idx % notifications.length]);
        setMinutesAgo(1 + Math.floor(Math.random() * 15));
        idx++;
      }, 600);
    }, 5000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dismissed, notifications]);

  // Auto-hide each notification after 4 seconds
  useEffect(() => {
    if (!currentNotif) return;
    const timer = setTimeout(() => setCurrentNotif(null), 4000);
    return () => clearTimeout(timer);
  }, [currentNotif]);

  const dismissAll = useCallback(() => {
    setDismissed(true);
    setCurrentNotif(null);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("asrar-social-proof-hidden", "true");
    }
  }, []);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 z-[60] max-w-[340px]">
      <AnimatePresence>
        {currentNotif && (
          <motion.div
            key={currentNotif}
            variants={notifVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-white rounded-2xl shadow-card p-4 pr-10 border border-border"
          >
            {/* Close button */}
            <button
              onClick={dismissAll}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-pink-accent text-text-muted hover:text-text transition-colors cursor-pointer"
              aria-label="Masquer les notifications"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M2 2l6 6M8 2l-6 6" />
              </svg>
            </button>

            <p className="text-sm text-text leading-snug font-[family-name:var(--font-body)]">
              {currentNotif}
            </p>
            <p className="text-xs text-text-muted mt-1.5 font-[family-name:var(--font-body)]">
              Il y a {minutesAgo} min
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline badge components                                            */
/* ------------------------------------------------------------------ */

interface BadgeProps {
  count: number;
}

interface StockBadgeProps {
  stock: number;
}

export function SocialProofBadgeSold({ count }: BadgeProps) {
  return (
    <motion.span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-accent text-xs font-medium text-[#FF5FA2] font-[family-name:var(--font-body)]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      🔥 {count} vendus aujourd&apos;hui
    </motion.span>
  );
}

export function SocialProofBadgeViewing({ count }: BadgeProps) {
  return (
    <motion.span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFEAF3] text-xs font-medium text-text-light font-[family-name:var(--font-body)]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      👁️ {count} personnes regardent ce produit
    </motion.span>
  );
}

export function SocialProofBadgeStock({ stock }: StockBadgeProps) {
  if (stock >= 20) return null;

  return (
    <motion.span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF3E0] text-xs font-semibold text-[#E65100] font-[family-name:var(--font-body)]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      ⚡ Stock limité — Plus que {stock} en stock
    </motion.span>
  );
}
