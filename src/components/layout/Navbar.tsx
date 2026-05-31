"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Collection", href: "/products" },
  { label: "Nos Secrets", href: "#secrets" },
  { label: "Avis", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { count, toggleCart } = useCart();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-soft" : "bg-white/80 backdrop-blur-sm"
        }`}
        style={{ top: "var(--banner-h, 0px)" }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-16 md:h-[72px]">
          {/* Logo */}
          <Link href="/" className="group hover:opacity-90 transition-opacity">
            <Logo variant="full" size="md" color="pink" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                {link.href.startsWith("/") ? (
                  <Link
                    href={link.href}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-text-light hover:text-pink hover:bg-pink-accent transition-all duration-200 font-[family-name:var(--font-body)]"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-text-light hover:text-pink hover:bg-pink-accent transition-all duration-200 font-[family-name:var(--font-body)]"
                  >
                    {link.label}
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {/* Search icon (visual only) */}
            <motion.button
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl text-text-light hover:text-pink hover:bg-pink-accent transition-all"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              aria-label="Rechercher"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </motion.button>

            {/* Cart button */}
            <motion.button
              onClick={toggleCart}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl text-text-light hover:text-pink hover:bg-pink-accent transition-all"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              aria-label="Panier"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {mounted && (
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key="cart-badge"
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full gradient-pink text-white text-[10px] font-bold flex items-center justify-center shadow-glow px-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", damping: 15, stiffness: 400 }}
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              )}
            </motion.button>

            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-text-light hover:text-pink hover:bg-pink-accent transition-all"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <div className="w-5 h-4 flex flex-col justify-between relative">
                <motion.span
                  className="block h-[2px] w-5 bg-current rounded-full origin-center"
                  animate={
                    mobileOpen
                      ? { rotate: 45, y: 7 }
                      : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="block h-[2px] w-5 bg-current rounded-full"
                  animate={
                    mobileOpen
                      ? { opacity: 0, scaleX: 0 }
                      : { opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-[2px] w-5 bg-current rounded-full origin-center"
                  animate={
                    mobileOpen
                      ? { rotate: -45, y: -7 }
                      : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-white flex flex-col md:hidden"
            style={{ top: "var(--banner-h, 0px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-16" /> {/* Spacer for header */}
            <div className="flex-1 flex flex-col items-center justify-center gap-2 px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.07, type: "spring", damping: 20, stiffness: 200 }}
                  className="w-full text-center"
                >
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-4 text-2xl font-semibold text-text hover:text-pink transition-colors font-[family-name:var(--font-display)]"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-4 text-2xl font-semibold text-text hover:text-pink transition-colors font-[family-name:var(--font-display)]"
                    >
                      {link.label}
                    </a>
                  )}
                </motion.div>
              ))}

              {/* Mobile CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: navLinks.length * 0.07 + 0.05 }}
                className="mt-6"
              >
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    toggleCart();
                  }}
                  className="gradient-pink text-white px-8 py-3 rounded-2xl text-base font-semibold shadow-glow hover:shadow-glow-lg transition-shadow font-[family-name:var(--font-display)]"
                >
                  Mon Panier {count > 0 && `(${count})`}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
