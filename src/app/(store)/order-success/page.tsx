"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { buildWhatsAppOrderLink } from "@/components/ui/WhatsAppButton";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  ref?: string;
  items: OrderItem[];
  total: number;
  customer: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  };
}

const confettiEmojis = [
  "&#127881;",
  "&#127882;",
  "&#10024;",
  "&#127775;",
  "&#128150;",
  "&#127880;",
  "&#128171;",
  "&#127800;",
  "&#9829;",
  "&#128156;",
  "&#127878;",
  "&#127752;",
];

function ConfettiPiece({ emoji, index }: { emoji: string; index: number }) {
  const randomX = Math.random() * 100;
  const randomDelay = Math.random() * 2;
  const randomDuration = 3 + Math.random() * 3;
  const randomSize = 16 + Math.random() * 16;

  return (
    <motion.span
      className="fixed pointer-events-none z-50"
      style={{
        left: `${randomX}%`,
        fontSize: `${randomSize}px`,
        bottom: "-30px",
      }}
      initial={{ y: 0, opacity: 1, rotate: 0 }}
      animate={{
        y: [0, -1200],
        opacity: [1, 1, 0],
        rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
        x: [0, (Math.random() - 0.5) * 200],
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        ease: "easeOut",
      }}
      dangerouslySetInnerHTML={{ __html: emoji }}
    />
  );
}

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("asrar-order");
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    } catch {
      // Ignore parse errors
    }

    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = order ? buildWhatsAppOrderLink({
    name: order.customer.fullName,
    phone: order.customer.phone,
    city: order.customer.city,
    address: order.customer.address,
    notes: order.customer.notes,
    items: order.items.map((i) => ({ name: i.name, qty: i.quantity, price: i.price })),
    total: order.total,
  }) : "";

  return (
    <>

      {/* Confetti */}
      {showConfetti &&
        confettiEmojis.map((emoji, i) =>
          [0, 1, 2].map((j) => (
            <ConfettiPiece key={`${i}-${j}`} emoji={emoji} index={i * 3 + j} />
          ))
        )}

      <main className="min-h-screen bg-bg pb-16" style={{ paddingTop: "var(--total-header)" }}>
        <div className="max-w-2xl mx-auto px-5 md:px-8 text-center">
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              damping: 10,
              stiffness: 200,
              delay: 0.2,
            }}
            className="mb-6"
          >
            <motion.span
              className="text-7xl md:text-8xl block"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              &#127881;
            </motion.span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-text font-[family-name:var(--font-display)] mb-3"
          >
            Commande{" "}
            <span className="gradient-text">Confirm&eacute;e !</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-text-light text-sm md:text-base leading-relaxed mb-8 font-[family-name:var(--font-body)]"
          >
            Merci pour votre commande. Vous recevrez une confirmation par
            WhatsApp.
          </motion.p>

          {/* Order reference */}
          {order?.ref && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 }}
              className="inline-block bg-pink-accent text-pink font-bold text-sm px-5 py-2 rounded-full mb-6"
            >
              Réf. commande : {order.ref}
            </motion.div>
          )}

          {/* Order details card */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-card border border-border p-6 md:p-8 text-left mb-8"
            >
              <h2 className="text-base font-bold text-text font-[family-name:var(--font-display)] mb-4">
                D&eacute;tails de la commande
              </h2>

              <div className="space-y-2 text-sm font-[family-name:var(--font-body)]">
                <div className="flex gap-3">
                  <span className="text-text-muted min-w-[80px]">Nom</span>
                  <span className="text-text font-medium">
                    {order.customer.fullName}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-text-muted min-w-[80px]">
                    T&eacute;l&eacute;phone
                  </span>
                  <span className="text-text font-medium">
                    {order.customer.phone}
                  </span>
                </div>
                <div className="flex gap-3">
                  <span className="text-text-muted min-w-[80px]">Ville</span>
                  <span className="text-text font-medium">
                    {order.customer.city}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="mt-5 pt-4 border-t border-border">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm py-1 font-[family-name:var(--font-body)]"
                  >
                    <span className="text-text-light">
                      {item.name}{" "}
                      <span className="text-text-muted">&times;{item.quantity}</span>
                    </span>
                    <span className="text-text font-medium">
                      {item.price * item.quantity} DH
                    </span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 mt-2 border-t border-border">
                  <span className="text-base font-bold text-text font-[family-name:var(--font-display)]">
                    Total
                  </span>
                  <span className="text-lg font-bold text-text font-[family-name:var(--font-display)]">
                    {order.total} DH
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            {order && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 rounded-2xl text-sm font-bold bg-[#25D366] text-white shadow-soft hover:shadow-card hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 font-[family-name:var(--font-display)]"
              >
                Envoyer la confirmation WhatsApp &#128172;
              </a>
            )}

            <Link
              href="/products"
              className="block w-full py-4 rounded-2xl text-sm font-bold bg-white text-text border border-border hover:border-pink-soft hover:bg-pink-accent/30 transition-all duration-200 font-[family-name:var(--font-display)]"
            >
              Continuer vos achats
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}
