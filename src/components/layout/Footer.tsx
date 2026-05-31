"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";

const deliveryBadges = [
  { icon: "🚚", label: "Livraison Rapide" },
  { icon: "💵", label: "Paiement à la Livraison" },
  { icon: "🌿", label: "Produits Naturels" },
  { icon: "🇲🇦", label: "Savoir-faire Marocain" },
];

const shopLinks = [
  { label: "Tous les produits", href: "/products" },
  { label: "Best-sellers", href: "/products" },
  { label: "Nouveautés", href: "/products" },
  { label: "Coffrets", href: "/products" },
  { label: "Mon panier", href: "/cart" },
];

const aboutLinks = [
  { label: "Notre histoire", href: "#secrets" },
  { label: "Ingrédients", href: "#secrets" },
  { label: "Avis clients", href: "#reviews" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { emoji: "📸", label: "Instagram", href: "https://instagram.com" },
  { emoji: "🎬", label: "TikTok", href: "https://tiktok.com" },
  { emoji: "💬", label: "WhatsApp", href: "https://wa.me/" },
  { emoji: "💙", label: "Facebook", href: "https://facebook.com" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Footer() {
  return (
    <footer className="bg-bg-soft">
      {/* Delivery badges row */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deliveryBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-soft"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                variants={fadeUp}
              >
                <span className="text-2xl">{badge.icon}</span>
                <span className="text-sm font-semibold text-text font-[family-name:var(--font-body)]">
                  {badge.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {/* Brand section */}
            <motion.div
              className="lg:col-span-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              custom={0}
              variants={fadeUp}
            >
              <Link href="/" className="inline-block mb-4 hover:opacity-90 transition-opacity">
                <Logo variant="full" size="md" color="pink" />
              </Link>
              <p className="text-sm text-text-light leading-relaxed font-[family-name:var(--font-body)]">
                Des produits de beaut&eacute; naturels, con&ccedil;us au Maroc avec amour.
                Glow like never before avec des ingr&eacute;dients purs et une touche moderne.
              </p>
              <div className="flex gap-2 mt-5">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-lg hover:bg-pink-accent hover:border-pink-soft hover:scale-105 transition-all shadow-soft"
                    aria-label={social.label}
                  >
                    {social.emoji}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Shop links */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              custom={1}
              variants={fadeUp}
            >
              <h4 className="text-sm font-bold text-text uppercase tracking-wider mb-4 font-[family-name:var(--font-display)]">
                Boutique
              </h4>
              <ul className="space-y-2.5">
                {shopLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-light hover:text-pink transition-colors font-[family-name:var(--font-body)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* About links */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              custom={2}
              variants={fadeUp}
            >
              <h4 className="text-sm font-bold text-text uppercase tracking-wider mb-4 font-[family-name:var(--font-display)]">
                A propos
              </h4>
              <ul className="space-y-2.5">
                {aboutLinks.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="text-sm text-text-light hover:text-pink transition-colors font-[family-name:var(--font-body)]"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-text-light hover:text-pink transition-colors font-[family-name:var(--font-body)]"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Social / Contact */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              custom={3}
              variants={fadeUp}
            >
              <h4 className="text-sm font-bold text-text uppercase tracking-wider mb-4 font-[family-name:var(--font-display)]">
                Suivez-nous
              </h4>
              <ul className="space-y-2.5">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-text-light hover:text-pink transition-colors font-[family-name:var(--font-body)]"
                    >
                      <span className="text-base">{social.emoji}</span>
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-3 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-xs text-text-muted font-[family-name:var(--font-body)]">
              &copy; {new Date().getFullYear()} ASRAR LALLA. Tous droits r&eacute;serv&eacute;s.
            </p>
            <p className="text-xs text-text-muted font-[family-name:var(--font-body)]">
              Made with &hearts; in Morocco &#127474;&#127462;
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
