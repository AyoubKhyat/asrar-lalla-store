"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProductVisual from "@/components/ui/ProductVisual";
import DeliveryBadges from "@/components/ui/DeliveryBadges";
import { useCart } from "@/store/cart";
import { products } from "@/data/products";

export default function CartPage() {
  const { items, total, count, removeFromCart, updateQuantity, addToCart } = useCart();

  const FREE_SHIPPING_THRESHOLD = 99;
  const remaining = FREE_SHIPPING_THRESHOLD - total;
  const shippingProgress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const suggestions = useMemo(() => {
    const cartIds = new Set(items.map((i) => i.product.id));
    const available = products.filter((p) => !cartIds.has(p.id));
    // Shuffle and pick 4
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [items]);

  return (
    <div className="min-h-screen bg-bg pb-16" style={{ paddingTop: "var(--total-header)" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-text font-[family-name:var(--font-display)]">
              Votre Panier &#128717;
            </h1>
            <p className="text-text-muted text-sm mt-1 font-[family-name:var(--font-body)]">
              {count} article{count !== 1 ? "s" : ""}
            </p>
          </motion.div>

          {items.length === 0 ? (
            /* Empty state */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <motion.span
                className="text-7xl block mb-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                &#128722;
              </motion.span>
              <h2 className="text-2xl font-bold text-text font-[family-name:var(--font-display)] mb-3">
                Votre panier est vide
              </h2>
              <p className="text-text-muted text-sm mb-8 font-[family-name:var(--font-body)]">
                D&eacute;couvrez nos produits et ajoutez vos favoris au panier
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 gradient-pink text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-glow hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-[family-name:var(--font-display)]"
              >
                D&eacute;couvrir la collection
              </Link>

              {/* Free shipping reminder */}
              <div className="mt-8 mx-auto max-w-md bg-pink-accent border border-pink/20 rounded-2xl px-6 py-4">
                <p className="text-sm text-text font-medium font-[family-name:var(--font-body)]">
                  &#128161; Astuce : Ajoutez pour 99 DH ou plus pour
                  b&eacute;n&eacute;ficier de la livraison gratuite !
                </p>
              </div>
            </motion.div>
          ) : (
            /* Cart with items */
            <>
            {/* Free shipping progress banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              {remaining > 0 ? (
                <div className="bg-white rounded-2xl border border-border p-4 shadow-soft">
                  <p className="text-sm font-medium text-text font-[family-name:var(--font-body)] mb-2">
                    &#128666; Plus que {remaining} DH pour la livraison gratuite !
                  </p>
                  <div className="w-full h-2.5 bg-bg-soft rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #FFB5C2, #FF8FAB)",
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${shippingProgress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-success-bg rounded-2xl border border-success-text/20 p-4">
                  <p className="text-sm font-medium text-success-text font-[family-name:var(--font-body)]">
                    &#9989; Livraison gratuite d&eacute;bloqu&eacute;e !
                  </p>
                </div>
              )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items list */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-2xl shadow-soft border border-border p-4 md:p-5 flex gap-4 items-center"
                    >
                      {/* Product visual */}
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="flex-shrink-0 w-16 h-20 flex items-center justify-center rounded-xl"
                        style={{
                          background: `${item.product.gradient[0]}20`,
                        }}
                      >
                        <ProductVisual
                          product={item.product}
                          size="sm"
                          animate={false}
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.product.slug}`}>
                          <h3 className="text-sm md:text-base font-semibold text-text font-[family-name:var(--font-display)] hover:text-pink transition-colors truncate">
                            {item.product.name_fr}
                          </h3>
                        </Link>
                        <p className="text-sm text-text-muted font-[family-name:var(--font-body)]">
                          {item.product.price} DH
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-0 bg-bg-soft border border-border rounded-lg overflow-hidden">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              aria-label={`Réduire la quantité de ${item.product.name_fr}`}
                              className="w-8 h-8 flex items-center justify-center text-text-light hover:text-pink hover:bg-pink-accent transition-all text-sm cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-text border-x border-border font-[family-name:var(--font-body)]" aria-label={`Quantité: ${item.quantity}`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              aria-label={`Augmenter la quantité de ${item.product.name_fr}`}
                              className="w-8 h-8 flex items-center justify-center text-text-light hover:text-pink hover:bg-pink-accent transition-all text-sm cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-text-muted hover:text-red-500 transition-colors"
                            aria-label="Supprimer"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Line total */}
                      <div className="flex-shrink-0 text-right">
                        <span className="text-base md:text-lg font-bold text-text font-[family-name:var(--font-display)]">
                          {item.product.price * item.quantity} DH
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-2xl shadow-card border border-border p-6 sticky" style={{ top: "calc(var(--total-header) + 1rem)" }}>
                  <h2 className="text-lg font-bold text-text font-[family-name:var(--font-display)] mb-5">
                    R&eacute;sum&eacute; de la commande
                  </h2>

                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm font-[family-name:var(--font-body)]">
                      <span className="text-text-light">Sous-total</span>
                      <span className="text-text font-medium">{total} DH</span>
                    </div>
                    <div className="flex justify-between text-sm font-[family-name:var(--font-body)]">
                      <span className="text-text-light">Livraison</span>
                      <span className="text-success-text font-medium">
                        Gratuite
                      </span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="text-base font-bold text-text font-[family-name:var(--font-display)]">
                          Total
                        </span>
                        <span className="text-xl font-bold text-text font-[family-name:var(--font-display)]">
                          {total} DH
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full py-3.5 rounded-2xl text-sm font-bold gradient-pink text-white shadow-glow hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center font-[family-name:var(--font-display)] mb-5"
                  >
                    Passer la commande
                  </Link>

                  <DeliveryBadges compact />
                </div>
              </motion.div>
            </div>

            {/* You may also like */}
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-12"
              >
                <h2 className="text-xl font-bold text-text font-[family-name:var(--font-display)] mb-5">
                  Vous aimerez aussi &#10024;
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestions.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-border p-3 flex items-center gap-3 shadow-soft"
                    >
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex-shrink-0 w-14 h-16 flex items-center justify-center rounded-xl"
                        style={{ background: `${product.gradient[0]}20` }}
                      >
                        <ProductVisual
                          product={product}
                          size="sm"
                          animate={false}
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="text-sm font-semibold text-text font-[family-name:var(--font-display)] hover:text-pink transition-colors truncate">
                            {product.name_fr}
                          </h3>
                        </Link>
                        <p className="text-xs text-text-muted font-[family-name:var(--font-body)]">
                          {product.price} DH
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-shrink-0 text-xs font-bold text-pink border border-pink/30 hover:bg-pink-accent px-3 py-1.5 rounded-xl transition-all duration-200 font-[family-name:var(--font-display)]"
                      >
                        Ajouter
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            </>
          )}
        </div>
    </div>
  );
}
