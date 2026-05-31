"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/data/products";
import ProductVisual from "@/components/ui/ProductVisual";
import DeliveryBadges from "@/components/ui/DeliveryBadges";
import { useCart } from "@/store/cart";
import { buildWhatsAppProductLink } from "@/components/ui/WhatsAppButton";

const labelMap: Record<string, { src: string; alt: string }[]> = {
  "rose-water": [
    { src: "/brand/labels/eau-de-rose-front.svg", alt: "Étiquette avant" },
    { src: "/brand/labels/eau-de-rose-back.svg", alt: "Étiquette arrière" },
  ],
  "savon-beldi": [
    { src: "/brand/labels/savon-beldi-front.svg", alt: "Étiquette couvercle" },
  ],
  "rose-cream": [
    { src: "/brand/labels/creme-rose-front.svg", alt: "Étiquette couvercle" },
  ],
  "beauty-oil": [
    { src: "/brand/labels/huile-beaute-front.svg", alt: "Étiquette flacon" },
  ],
  "lip-balm": [
    { src: "/brand/labels/baume-levres-front.svg", alt: "Étiquette tube" },
  ],
};

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
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

export default function ClientProductPage({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const [quantity, setQuantity] = useState(1);
  const [howToUseOpen, setHowToUseOpen] = useState(false);
  const { addToCart } = useCart();
  const outOfStock = product.stock <= 0;
  const maxQty = Math.max(1, product.stock);

  const handleAddToCart = () => {
    if (outOfStock) return;
    addToCart(product, quantity);
  };

  const whatsappUrl = buildWhatsAppProductLink(product.name_fr, product.price, quantity, product.slug);

  return (
    <div className="min-h-screen bg-bg pb-24 md:pb-16" style={{ paddingTop: "var(--total-header)" }}>
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto px-5 md:px-8 mb-6 md:mb-8"
        >
          <ol className="flex items-center gap-2 text-sm text-text-muted font-[family-name:var(--font-body)]">
            <li>
              <Link
                href="/"
                className="hover:text-pink transition-colors"
              >
                Accueil
              </Link>
            </li>
            <li>
              <span className="mx-1">/</span>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-pink transition-colors"
              >
                Collection
              </Link>
            </li>
            <li>
              <span className="mx-1">/</span>
            </li>
            <li className="text-text font-medium truncate max-w-[200px]">
              {product.name_fr}
            </li>
          </ol>
        </motion.nav>

        {/* Product detail - two columns */}
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* LEFT - Visual */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center rounded-3xl py-12 md:py-16"
              style={{ background: `${product.gradient[0]}30` }}
            >
              <ProductVisual product={product} size="xl" animate />
            </motion.div>

            {/* RIGHT - Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col"
            >
              {/* Badge */}
              {product.badge && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex self-start items-center text-xs font-bold uppercase tracking-wider gradient-pink text-white px-3 py-1.5 rounded-full shadow-glow mb-4 font-[family-name:var(--font-display)]"
                >
                  {product.badge}
                </motion.span>
              )}

              {/* Product name */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text font-[family-name:var(--font-display)] leading-tight mb-1">
                {product.name_fr}
              </h1>

              {/* Arabic name */}
              <p className="text-lg text-text-muted font-[family-name:var(--font-body)] mb-4">
                {product.name_ar}
              </p>

              {/* Rating - only show if product has reviews */}
              {product.reviews_count > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={product.rating} size={18} />
                  <span className="text-sm text-text-muted font-[family-name:var(--font-body)]">
                    {product.rating} ({product.reviews_count} avis)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-text font-[family-name:var(--font-display)]">
                  {product.price} DH
                </span>
                {product.old_price && (
                  <>
                    <span className="text-lg text-text-muted line-through font-[family-name:var(--font-body)]">
                      {product.old_price} DH
                    </span>
                    <span className="text-xs font-bold uppercase bg-pink-accent text-pink px-2.5 py-1 rounded-full font-[family-name:var(--font-display)]">
                      PROMO
                    </span>
                  </>
                )}
              </div>

              {/* Tagline */}
              <p className="text-text-light italic text-base mb-4 font-[family-name:var(--font-body)]">
                &ldquo;{product.tagline}&rdquo;
              </p>

              {/* Description */}
              <p className="text-text-light text-sm leading-relaxed mb-6 font-[family-name:var(--font-body)]">
                {product.description}
              </p>

              {/* Benefits */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-3 font-[family-name:var(--font-display)]">
                  Bienfaits
                </h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-center gap-2 text-sm text-text-light font-[family-name:var(--font-body)]"
                    >
                      <span className="text-pink font-bold">&#10003;</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-3 font-[family-name:var(--font-display)]">
                  Ingr&eacute;dients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="text-xs bg-pink-accent text-text-light px-3 py-1.5 rounded-full font-[family-name:var(--font-body)]"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>

              {/* How to use - expandable */}
              <div className="mb-6">
                <button
                  onClick={() => setHowToUseOpen(!howToUseOpen)}
                  className="flex items-center justify-between w-full py-3 border-t border-b border-border text-sm font-bold text-text uppercase tracking-wider font-[family-name:var(--font-display)]"
                >
                  <span>Comment utiliser</span>
                  <motion.span
                    animate={{ rotate: howToUseOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-text-muted"
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
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence>
                  {howToUseOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-text-light leading-relaxed py-3 font-[family-name:var(--font-body)]">
                        {product.how_to_use}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Out of stock banner */}
              {outOfStock && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-sm text-red-700 font-[family-name:var(--font-body)] font-medium">
                  Rupture de stock — Ce produit est temporairement indisponible
                </div>
              )}

              {/* Quantity selector */}
              {!outOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold text-text font-[family-name:var(--font-display)]">
                  Quantit&eacute;
                </span>
                <div className="flex items-center gap-0 bg-white border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-text-light hover:text-pink hover:bg-pink-accent transition-all text-lg font-medium"
                  >
                    -
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm font-semibold text-text border-x border-border font-[family-name:var(--font-body)]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                    disabled={quantity >= maxQty}
                    className="w-10 h-10 flex items-center justify-center text-text-light hover:text-pink hover:bg-pink-accent transition-all text-lg font-medium disabled:opacity-30 disabled:pointer-events-none"
                  >
                    +
                  </button>
                </div>
                {product.stock <= 5 && (
                  <span className="text-xs text-amber-600 font-medium font-[family-name:var(--font-body)]">
                    Plus que {product.stock} en stock
                  </span>
                )}
              </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-bold gradient-pink text-white shadow-glow hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-[family-name:var(--font-display)] disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
                >
                  {outOfStock ? "Indisponible" : "Ajouter au Panier 🛒"}
                </button>
                {!outOfStock && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 rounded-2xl text-sm font-bold bg-[#25D366] text-white shadow-glow hover:shadow-glow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center font-[family-name:var(--font-display)]"
                >
                  Commander via WhatsApp &#128172;
                </a>
                )}
              </div>

              {/* Trust line */}
              <p className="text-xs text-text-muted text-center mb-6 font-[family-name:var(--font-body)]">
                &#128666; Livraison 24-72h &middot; &#128181; Paiement &agrave; la livraison &middot; &#128172; Support WhatsApp
              </p>

              {/* Delivery badges */}
              <DeliveryBadges compact />
            </motion.div>
          </div>

          {/* Packaging label showcase */}
          {labelMap[product.id] && (
            <motion.section
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-text font-[family-name:var(--font-display)] mb-4">
                Notre <span className="gradient-text">Packaging</span>
              </h2>
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {labelMap[product.id].map((label) => (
                  <div key={label.src} className="flex-shrink-0 w-40 md:w-48 bg-white rounded-2xl shadow-soft border border-border overflow-hidden hover:shadow-glow transition-shadow">
                    <Image src={label.src} alt={label.alt} width={192} height={192} className="w-full h-auto" />
                    <p className="text-xs text-text-muted text-center py-2">{label.alt}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <section>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-2xl md:text-3xl font-bold text-text font-[family-name:var(--font-display)] mb-6"
              >
                Vous aimerez <span className="gradient-text">aussi</span>
              </motion.h2>
              <div className="overflow-x-auto hide-scrollbar -mx-5 md:mx-0 px-5 md:px-0">
                <div className="flex gap-4 md:gap-6 pb-4" style={{ minWidth: "min-content" }}>
                  {relatedProducts.map((rp, i) => (
                    <motion.div
                      key={rp.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="w-48 md:w-56 flex-shrink-0"
                    >
                      <Link
                        href={`/products/${rp.slug}`}
                        className="block bg-white rounded-2xl shadow-soft border border-border hover:shadow-card hover:border-pink-soft/50 transition-all duration-300 overflow-hidden group"
                      >
                        <div
                          className="flex items-center justify-center py-6"
                          style={{ background: `${rp.gradient[0]}15` }}
                        >
                          <div className="group-hover:scale-105 transition-transform duration-500">
                            <ProductVisual
                              product={rp}
                              size="md"
                              animate={false}
                            />
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-semibold text-text font-[family-name:var(--font-display)] group-hover:text-pink transition-colors line-clamp-1 mb-1">
                            {rp.name_fr}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold text-text font-[family-name:var(--font-display)]">
                              {rp.price} DH
                            </span>
                            {rp.old_price && (
                              <span className="text-xs text-text-muted line-through">
                                {rp.old_price} DH
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      {/* Sticky mobile bottom bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass border-t border-border px-5 py-3"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
            className="flex-1 py-3 rounded-xl text-sm font-bold gradient-pink text-white shadow-glow active:scale-[0.98] transition-all duration-200 font-[family-name:var(--font-display)] disabled:opacity-50 disabled:pointer-events-none"
          >
            {outOfStock ? "Indisponible" : "Ajouter 🛒"}
          </button>
          {!outOfStock && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl text-sm font-bold bg-[#25D366] text-white shadow-soft active:scale-[0.98] transition-all duration-200 text-center font-[family-name:var(--font-display)]"
          >
            WhatsApp &#128172;
          </a>
          )}
        </div>
      </motion.div>

    </div>
  );
}
