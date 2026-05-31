"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { products, type Product } from "@/data/products";
import ProductVisual from "@/components/ui/ProductVisual";
import DeliveryBadges from "@/components/ui/DeliveryBadges";
import { useCart } from "@/store/cart";
import { buildWhatsAppProductLink } from "@/components/ui/WhatsAppButton";

const categories = [
  { key: "all", label: "Tout" },
  { key: "visage", label: "Visage" },
  { key: "corps", label: "Corps" },
  { key: "cheveux", label: "Cheveux" },
  { key: "lèvres", label: "Lèvres" },
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 800);
  };

  const whatsappUrl = buildWhatsAppProductLink(product.name_fr, product.price, 1, product.slug);

  return (
    <motion.div
      className="relative flex-shrink-0 w-[260px] md:w-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative bg-white rounded-3xl shadow-soft overflow-hidden group cursor-pointer"
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{
          boxShadow: isHovered
            ? "0 8px 30px rgba(255,95,162,0.12)"
            : "0 2px 20px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)",
        }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 opacity-[0.15] rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${product.gradient[0]}, ${product.gradient[1]})`,
          }}
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-20">
            <span className="inline-block bg-pink text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide font-[family-name:var(--font-display)]">
              {product.badge}
            </span>
          </div>
        )}

        {/* Wishlist heart */}
        <motion.button
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-soft cursor-pointer"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            className="w-4 h-4 text-pink"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </motion.button>

        {/* Product visual */}
        <Link href={`/products/${product.slug}`}>
          <div className="relative pt-6 pb-2 flex items-center justify-center">
            <ProductVisual product={product} size="md" animate={isHovered} />

            {/* Hover particles */}
            <AnimatePresence>
              {showParticles &&
                [...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-pink"
                    initial={{
                      opacity: 1,
                      scale: 1,
                      x: 0,
                      y: 0,
                    }}
                    animate={{
                      opacity: 0,
                      scale: 0,
                      x: (Math.random() - 0.5) * 100,
                      y: (Math.random() - 0.5) * 100,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                      top: "50%",
                      left: "50%",
                    }}
                  />
                ))}
            </AnimatePresence>
          </div>
        </Link>

        {/* Content */}
        <div className="relative p-4 pt-2">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-[family-name:var(--font-display)] font-semibold text-text text-sm leading-snug mb-1 hover:text-pink transition-colors">
              {product.name_fr}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mb-1">
            <span className="font-[family-name:var(--font-display)] font-bold text-pink text-lg">
              {product.price} DH
            </span>
            {product.old_price && (
              <span className="text-text-muted text-sm line-through">
                {product.old_price} DH
              </span>
            )}
          </div>

          {/* Trust micro-text */}
          <p className="text-[11px] text-text-muted font-[family-name:var(--font-body)] mb-3">
            &#128181; Paiement &agrave; la livraison
          </p>

          {/* Action buttons */}
          <div className="flex gap-2">
            <motion.button
              className="flex-[3] gradient-pink text-white text-sm font-semibold py-2.5 rounded-full font-[family-name:var(--font-display)] cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
            >
              Ajouter &#128722;
            </motion.button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-[2]"
            >
              <motion.button
                className="w-full bg-[#25D366] text-white text-sm font-semibold py-2.5 rounded-full font-[family-name:var(--font-display)] cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                WhatsApp &#128172;
              </motion.button>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TrendingProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const trendingProducts = products
    .filter((p) => p.is_trending || p.is_best_seller)
    .filter((p) => activeCategory === "all" || p.category === activeCategory);

  return (
    <section id="collection" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="inline-flex items-center gap-1.5 bg-pink-accent text-pink text-xs font-semibold px-4 py-2 rounded-full mb-4 font-[family-name:var(--font-display)]">
              &#128717;&#65039; NOS PRODUITS
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-text font-[family-name:var(--font-display)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Les Tr&eacute;sors De Lalla &#10024;
          </motion.h2>
        </div>

        {/* Category filter pills */}
        <motion.div
          className="flex justify-center gap-2 flex-wrap mb-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 font-[family-name:var(--font-display)] cursor-pointer ${
                activeCategory === cat.key
                  ? "gradient-pink text-white shadow-glow"
                  : "bg-white text-text-light border border-border hover:border-pink-soft hover:text-pink"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Mobile: horizontal scroll / Desktop: grid */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 md:grid md:grid-cols-4 md:overflow-visible md:pb-0"
        >
          {trendingProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* See all link */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-pink font-semibold text-base hover:gap-3 transition-all font-[family-name:var(--font-display)]"
          >
            Voir toute la collection
            <span className="text-lg">&rarr;</span>
          </Link>
        </motion.div>

        {/* Delivery badges */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <DeliveryBadges />
        </motion.div>
      </div>
    </section>
  );
}
