"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { products, categories, type Product } from "@/data/products";
import ProductVisual from "@/components/ui/ProductVisual";
import { useCart } from "@/store/cart";

type SortOption = "popular" | "price-asc" | "price-desc" | "newest";

const sortLabels: Record<SortOption, string> = {
  popular: "Populaire",
  "price-asc": "Prix croissant",
  "price-desc": "Prix décroissant",
  newest: "Nouveautés",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="12"
          height="12"
          viewBox="0 0 20 20"
          fill={star <= Math.round(rating) ? "#FF5FA2" : "none"}
          stroke={star <= Math.round(rating) ? "#FF5FA2" : "#D1D5DB"}
          strokeWidth="1.5"
        >
          <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.51.91-5.32L2.27 6.69l5.34-.78L10 1z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchesCategory =
        activeCategory === "all" || p.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        p.name_fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name_ar.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });

    switch (sortBy) {
      case "price-asc":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered = [...filtered].sort(
          (a, b) => (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0)
        );
        break;
      case "popular":
      default:
        filtered = [...filtered].sort(
          (a, b) => b.reviews_count - a.reviews_count
        );
        break;
    }

    return filtered;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-bg pb-16" style={{ paddingTop: "var(--total-header)" }}>
        {/* Header */}
        <section className="max-w-7xl mx-auto px-5 md:px-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-text font-[family-name:var(--font-display)] mb-3">
              La <span className="gradient-text">Collection</span>
            </h1>
            <p className="text-text-light font-[family-name:var(--font-body)] text-sm md:text-base">
              {filteredProducts.length} produit
              {filteredProducts.length !== 1 ? "s" : ""} disponible
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>
          </motion.div>
        </section>

        {/* Filters bar */}
        <section className="max-w-7xl mx-auto px-5 md:px-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
          >
            {/* Category pills - horizontally scrollable */}
            <div className="w-full md:w-auto overflow-x-auto hide-scrollbar">
              <div className="flex gap-2 pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 font-[family-name:var(--font-body)] ${
                      activeCategory === cat.id
                        ? "gradient-pink text-white shadow-glow"
                        : "bg-white text-text-light border border-border hover:border-pink-soft hover:text-pink"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search + Sort */}
            <div className="flex gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:w-56">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  width="16"
                  height="16"
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
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/10 transition-all font-[family-name:var(--font-body)]"
                />
              </div>

              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-text focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/10 transition-all font-[family-name:var(--font-body)] cursor-pointer"
              >
                {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                  <option key={key} value={key}>
                    {sortLabels[key]}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </section>

        {/* Product grid */}
        <section className="max-w-7xl mx-auto px-5 md:px-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-20"
              >
                <span className="text-5xl block mb-4">🔍</span>
                <p className="text-text-light text-lg font-[family-name:var(--font-body)]">
                  Aucun produit trouv&eacute;
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-pink text-sm font-medium hover:underline font-[family-name:var(--font-body)]"
                >
                  R&eacute;initialiser les filtres
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                {filteredProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    onAddToCart={() => addToCart(product)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
    </div>
  );
}

function ProductCard({
  product,
  index,
  onAddToCart,
}: {
  product: Product;
  index: number;
  onAddToCart: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
      className="group bg-white rounded-2xl md:rounded-3xl shadow-soft border border-border hover:shadow-card hover:border-pink-soft/50 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Visual area */}
      <Link href={`/products/${product.slug}`} className="block">
        <div
          className="relative flex items-center justify-center py-6 md:py-8"
          style={{ background: `${product.gradient[0]}15` }}
        >
          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 text-[10px] md:text-xs font-bold uppercase tracking-wider bg-white/90 text-pink px-2.5 py-1 rounded-full shadow-soft font-[family-name:var(--font-display)]">
              {product.badge}
            </span>
          )}
          <div className="group-hover:scale-105 transition-transform duration-500">
            <ProductVisual product={product} size="lg" animate={false} />
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 md:p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm md:text-base font-semibold text-text leading-tight font-[family-name:var(--font-display)] group-hover:text-pink transition-colors line-clamp-2 mb-1">
            {product.name_fr}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <StarRating rating={product.rating} />
          <span className="text-[10px] md:text-xs text-text-muted font-[family-name:var(--font-body)]">
            ({product.reviews_count})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3 mt-auto">
          <span className="text-lg font-bold text-text font-[family-name:var(--font-display)]">
            {product.price} DH
          </span>
          {product.old_price && (
            <span className="text-xs text-text-muted line-through font-[family-name:var(--font-body)]">
              {product.old_price} DH
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onAddToCart();
          }}
          className="w-full py-2.5 rounded-xl text-sm font-semibold gradient-pink text-white shadow-glow hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-[family-name:var(--font-body)]"
        >
          Ajouter
        </button>
      </div>
    </motion.div>
  );
}
