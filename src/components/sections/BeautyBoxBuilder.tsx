"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products, type Product } from "@/data/products";
import ProductVisual from "@/components/ui/ProductVisual";
import { useCart } from "@/store/cart";

const sizeOptions = [
  { count: 3, label: "3 Produits", discount: 5 },
  { count: 4, label: "4 Produits", discount: 10 },
  { count: 5, label: "5 Produits", discount: 15 },
  { count: 6, label: "6 Produits", discount: 20 },
];

export default function BeautyBoxBuilder() {
  const { addToCart } = useCart();
  const [maxSize, setMaxSize] = useState(3);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedProducts = useMemo(
    () => products.filter((p) => selectedIds.includes(p.id)),
    [selectedIds]
  );

  const discountPercent =
    sizeOptions.find((s) => s.count === maxSize)?.discount ?? 0;

  const subtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

  const toggleProduct = (productId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= maxSize) return prev;
      return [...prev, productId];
    });
  };

  const removeProduct = (productId: string) => {
    setSelectedIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleAddAllToCart = () => {
    selectedProducts.forEach((p) => addToCart(p));
  };

  return (
    <section
      id="beautybox"
      className="py-20 px-4"
      style={{
        background:
          "linear-gradient(160deg, rgba(255,234,243,0.4) 0%, rgba(232,222,255,0.2) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="inline-flex items-center gap-1.5 bg-pink-accent text-pink text-xs font-semibold px-4 py-2 rounded-full mb-4 font-[family-name:var(--font-display)]">
              🎀 BEAUTY BOX
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-text font-[family-name:var(--font-display)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Cr&eacute;ez Votre Box
          </motion.h2>
        </div>

        {/* Size selector */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {sizeOptions.map((option) => (
            <motion.button
              key={option.count}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold font-[family-name:var(--font-display)] transition-colors cursor-pointer ${
                maxSize === option.count
                  ? "gradient-pink text-white shadow-glow"
                  : "bg-white text-text border border-border shadow-soft hover:border-pink-soft"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setMaxSize(option.count);
                setSelectedIds((prev) => prev.slice(0, option.count));
              }}
            >
              {option.label}
            </motion.button>
          ))}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product grid */}
          <div className="flex-1">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {products.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                const isFull =
                  selectedIds.length >= maxSize && !isSelected;

                return (
                  <motion.button
                    key={product.id}
                    className={`relative bg-white rounded-2xl p-3 text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-2 border-pink shadow-glow"
                        : "border border-border shadow-soft hover:shadow-card"
                    } ${isFull ? "opacity-40 cursor-not-allowed" : ""}`}
                    whileHover={!isFull ? { scale: 1.04 } : undefined}
                    whileTap={!isFull ? { scale: 0.97 } : undefined}
                    onClick={() => !isFull && toggleProduct(product.id)}
                  >
                    {/* Checkmark */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          className="absolute top-2 right-2 w-5 h-5 rounded-full gradient-pink flex items-center justify-center z-10"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-center mb-2">
                      <ProductVisual
                        product={product}
                        size="sm"
                        animate={isSelected}
                      />
                    </div>

                    <p className="text-xs font-semibold text-text leading-tight font-[family-name:var(--font-display)] truncate">
                      {product.name_fr}
                    </p>
                    <p className="text-xs text-pink font-bold mt-0.5 font-[family-name:var(--font-display)]">
                      {product.price} DH
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Preview box */}
          <div className="lg:w-80 lg:sticky lg:self-start" style={{ top: "calc(var(--total-header) + 1rem)" }}>
            <motion.div
              className="bg-white rounded-3xl shadow-card overflow-hidden"
              style={{
                border: "2px solid transparent",
                backgroundImage:
                  "linear-gradient(white, white), linear-gradient(135deg, #FF5FA2, #FF85B8, #FFCFE1)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {/* Ribbon header */}
              <div className="gradient-pink p-4 text-center relative">
                <span className="text-2xl block mb-1">🎀</span>
                <h3 className="text-white font-bold text-lg font-[family-name:var(--font-display)]">
                  Votre Beauty Box
                </h3>
                <p className="text-white/80 text-xs font-[family-name:var(--font-body)]">
                  {selectedIds.length}/{maxSize} produits
                </p>
              </div>

              <div className="p-5">
                {/* Progress bar */}
                <div className="mb-5">
                  <div className="h-2 bg-pink-accent rounded-full overflow-hidden">
                    <motion.div
                      className="h-full gradient-pink rounded-full"
                      animate={{
                        width: `${(selectedIds.length / maxSize) * 100}%`,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  </div>
                </div>

                {/* Selected items list */}
                <div className="space-y-2 min-h-[100px] mb-5">
                  <AnimatePresence mode="popLayout">
                    {selectedProducts.length === 0 ? (
                      <motion.p
                        key="empty"
                        className="text-text-muted text-sm text-center py-6 font-[family-name:var(--font-body)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        S&eacute;lectionnez vos produits pr&eacute;f&eacute;r&eacute;s ✨
                      </motion.p>
                    ) : (
                      selectedProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          className="flex items-center gap-3 bg-bg-soft rounded-xl p-2.5"
                          initial={{ opacity: 0, x: -20, height: 0 }}
                          animate={{ opacity: 1, x: 0, height: "auto" }}
                          exit={{ opacity: 0, x: 20, height: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          layout
                        >
                          <div className="flex-shrink-0">
                            <ProductVisual
                              product={product}
                              size="sm"
                              animate={false}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-text truncate font-[family-name:var(--font-display)]">
                              {product.name_fr}
                            </p>
                            <p className="text-xs text-pink font-bold font-[family-name:var(--font-display)]">
                              {product.price} DH
                            </p>
                          </div>
                          <motion.button
                            className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-accent text-pink flex items-center justify-center text-xs hover:bg-pink hover:text-white transition-colors cursor-pointer"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeProduct(product.id)}
                          >
                            &times;
                          </motion.button>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Discount message */}
                <div className="bg-pink-accent rounded-xl p-3 mb-4 text-center">
                  <p className="text-pink text-xs font-semibold font-[family-name:var(--font-display)]">
                    {maxSize} produits = -{discountPercent}% 🎉
                  </p>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-sm text-text-light font-[family-name:var(--font-body)]">
                    Total
                  </span>
                  <div className="text-right">
                    {selectedProducts.length > 0 && discountPercent > 0 && (
                      <span className="text-xs text-text-muted line-through block">
                        {subtotal.toFixed(0)} DH
                      </span>
                    )}
                    <span className="text-lg font-bold text-text font-[family-name:var(--font-display)]">
                      {selectedProducts.length > 0
                        ? `${total.toFixed(0)} DH`
                        : "0 DH"}
                    </span>
                  </div>
                </div>

                {/* Add to cart button */}
                <motion.button
                  className={`w-full py-3.5 rounded-full text-sm font-bold font-[family-name:var(--font-display)] transition-all cursor-pointer ${
                    selectedIds.length === maxSize
                      ? "gradient-pink text-white shadow-glow"
                      : "bg-pink-accent text-pink-soft cursor-not-allowed"
                  }`}
                  whileHover={
                    selectedIds.length === maxSize ? { scale: 1.03 } : undefined
                  }
                  whileTap={
                    selectedIds.length === maxSize ? { scale: 0.97 } : undefined
                  }
                  onClick={() => {
                    if (selectedIds.length === maxSize) {
                      handleAddAllToCart();
                      setSelectedIds([]);
                    }
                  }}
                  disabled={selectedIds.length !== maxSize}
                >
                  {selectedIds.length === maxSize
                    ? "Ajouter au panier 🛍️"
                    : `Choisissez encore ${maxSize - selectedIds.length} produit${
                        maxSize - selectedIds.length > 1 ? "s" : ""
                      }`}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
