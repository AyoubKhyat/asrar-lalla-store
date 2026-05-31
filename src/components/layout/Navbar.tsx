"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart";
import { products } from "@/data/products";
import Logo from "@/components/ui/Logo";
import ProductVisual from "@/components/ui/ProductVisual";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Collection", href: "/products" },
  { label: "Nos Secrets", href: "/#secrets" },
  { label: "Avis", href: "/#reviews" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { count, toggleCart } = useCart();

  const results = query.trim().length >= 2
    ? products.filter((p) =>
        p.name_fr.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => { setSearchOpen(false); setQuery(""); }, [pathname]);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
                <Link
                  href={link.href}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-text-light hover:text-pink hover:bg-pink-accent transition-all duration-200 font-[family-name:var(--font-body)]"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {/* Search icon */}
            <motion.button
              onClick={() => setSearchOpen((v) => !v)}
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

          </div>
        </nav>
      </motion.header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 z-[49] bg-white shadow-soft border-b border-border px-5 md:px-8"
            style={{ top: "calc(var(--banner-h, 0px) + 72px)" }}
          >
            <div className="max-w-2xl mx-auto py-4">
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/10 transition-all font-[family-name:var(--font-body)]"
              />
              {results.length > 0 && (
                <div className="mt-3 space-y-1">
                  {results.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.slug}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-pink-accent transition-colors"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: `${p.gradient[0]}20` }}>
                        <ProductVisual product={p} size="sm" animate={false} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate font-[family-name:var(--font-display)]">{p.name_fr}</p>
                        <p className="text-xs text-text-muted font-[family-name:var(--font-body)]">{p.price} DH</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {query.trim().length >= 2 && results.length === 0 && (
                <p className="mt-3 text-sm text-text-muted text-center py-4 font-[family-name:var(--font-body)]">Aucun produit trouvé</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search backdrop */}
      {searchOpen && (
        <div className="fixed inset-0 z-[48] bg-black/20" onClick={() => setSearchOpen(false)} />
      )}
    </>
  );
}
