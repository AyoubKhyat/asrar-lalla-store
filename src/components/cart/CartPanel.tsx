"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart";
import ProductVisual from "@/components/ui/ProductVisual";
import Link from "next/link";

export default function CartPanel() {
  const { items, isOpen, total, closeCart, removeFromCart, updateQuantity } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/15 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[380px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350 }}
          >
            <div className="h-full bg-white flex flex-col rounded-l-3xl shadow-glow-lg overflow-hidden">
              {/* Header */}
              <div className="p-5 pb-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-lg text-text">
                    Votre Panier 🛍️
                  </h3>
                  <p className="text-text-muted text-xs mt-0.5">
                    {items.length} {items.length === 1 ? "article" : "articles"}
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="w-9 h-9 rounded-full bg-pink-accent hover:bg-pink-soft flex items-center justify-center cursor-pointer transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5FA2" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.length === 0 ? (
                    <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <span className="text-5xl block mb-4">🛒</span>
                      <p className="text-text-muted text-sm font-medium">Votre panier est vide</p>
                      <p className="text-text-muted text-xs mt-1">Découvrez nos produits ✨</p>
                    </motion.div>
                  ) : (
                    items.map((item, i) => (
                      <motion.div
                        key={item.product.id}
                        className="flex items-center gap-3 bg-bg-soft rounded-2xl p-3"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40, height: 0, padding: 0, marginBottom: 0 }}
                        transition={{ delay: i * 0.03 }}
                        layout
                      >
                        <div className="flex-shrink-0">
                          <ProductVisual product={item.product} size="sm" animate={false} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-text text-sm font-semibold truncate">{item.product.name_fr}</h4>
                          <p className="text-pink text-sm font-bold">{item.product.price} DH</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center text-text-light text-xs cursor-pointer hover:border-pink transition-colors">−</button>
                          <span className="text-text text-sm font-bold w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center text-text-light text-xs cursor-pointer hover:border-pink transition-colors">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-text-muted hover:text-pink transition-colors cursor-pointer p-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-5 pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-text-light text-sm">Total</span>
                    <span className="font-[family-name:var(--font-display)] font-extrabold text-xl text-text">{total} DH</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block w-full py-3.5 rounded-full gradient-pink text-white font-bold text-sm tracking-wide shadow-glow text-center"
                  >
                    Passer la commande →
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="block w-full py-3 rounded-full border-2 border-pink-soft text-pink font-bold text-sm text-center hover:bg-pink-accent transition-colors"
                  >
                    Voir le panier
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
