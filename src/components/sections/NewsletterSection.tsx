"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setIsSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-bg-soft relative overflow-hidden">
      {/* Floating emoji */}
      <motion.div
        className="absolute top-8 right-[15%] text-4xl select-none pointer-events-none hidden md:block"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 8, -8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        💌
      </motion.div>

      <motion.div
        className="absolute bottom-12 left-[10%] text-3xl select-none pointer-events-none hidden md:block"
        animate={{
          y: [0, -8, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        💌
      </motion.div>

      <div className="max-w-xl mx-auto text-center relative z-10">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.h2
                className="text-3xl sm:text-4xl font-bold text-text font-[family-name:var(--font-display)] mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Rejoignez le Glow Club
              </motion.h2>

              <motion.p
                className="text-text-light text-sm mb-8 font-[family-name:var(--font-body)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Offres exclusives, nouveaut&eacute;s et conseils beaut&eacute; directement dans votre bo&icirc;te mail.
              </motion.p>

              <motion.form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="flex-1 px-5 py-3.5 rounded-full bg-white border border-border shadow-soft text-sm text-text font-[family-name:var(--font-body)] outline-none focus:border-pink focus:shadow-glow transition-all placeholder:text-text-muted"
                />
                <motion.button
                  type="submit"
                  className="gradient-pink text-white font-semibold px-7 py-3.5 rounded-full text-sm shadow-glow font-[family-name:var(--font-display)] cursor-pointer whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  S&apos;inscrire ✨
                </motion.button>
              </motion.form>

              <motion.p
                className="mt-4 text-text-muted text-xs font-[family-name:var(--font-body)]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Pas de spam. Promesse 🤞
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              className="bg-success rounded-3xl p-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.span
                className="text-5xl block mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  delay: 0.2,
                }}
              >
                🎉
              </motion.span>

              <h3 className="text-2xl font-bold text-success-text font-[family-name:var(--font-display)] mb-2">
                Bienvenue dans le Glow Club !
              </h3>

              <p className="text-success-text/80 text-sm font-[family-name:var(--font-body)]">
                V&eacute;rifiez votre bo&icirc;te mail pour une surprise sp&eacute;ciale 💕
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
