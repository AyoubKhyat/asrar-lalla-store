"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { packs, WHATSAPP_NUMBER, type Pack } from "@/data/config";
import { getProduct, type Product } from "@/data/products";
import ProductVisual from "@/components/ui/ProductVisual";
import { useCart } from "@/store/cart";

function PackCard({ pack, index }: { pack: Pack; index: number }) {
  const { addToCart } = useCart();

  const packProducts: Product[] = pack.productIds
    .map((id) => getProduct(id))
    .filter((p): p is Product => !!p);

  const separateTotal = packProducts.reduce((sum, p) => sum + p.price, 0);
  const packTotal = Math.round(separateTotal * (1 - pack.discount / 100));
  const savings = separateTotal - packTotal;

  const handleAddAllToCart = () => {
    packProducts.forEach((product) => {
      addToCart(product);
    });
  };

  const handleWhatsApp = () => {
    const productList = packProducts
      .map((p) => `  - ${p.name_fr} (${p.price} DH)`)
      .join("\n");
    const msg = `Bonjour ! 👋\n\nJe suis intéressée par le *${pack.emoji} ${pack.name}* :\n\n${productList}\n\n💰 Prix pack : ${packTotal} DH (au lieu de ${separateTotal} DH)\n📦 Économie : ${savings} DH\n\nMerci !`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <motion.div
      className="relative bg-white rounded-3xl shadow-card overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
    >
      {/* Gradient top accent bar */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${pack.gradient[0]}, ${pack.gradient[1]})`,
        }}
      />

      <div className="p-6 md:p-8">
        {/* Header: emoji + name + badge */}
        <div className="flex items-start gap-3 mb-4">
          <span className="text-4xl">{pack.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-[family-name:var(--font-display)] font-bold text-text text-xl">
                {pack.name}
              </h3>
              {pack.badge && (
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide text-white font-[family-name:var(--font-display)]"
                  style={{
                    background: `linear-gradient(135deg, ${pack.gradient[0]}, ${pack.gradient[1]})`,
                  }}
                >
                  {pack.badge}
                </span>
              )}
            </div>
            <p className="font-[family-name:var(--font-body)] text-text-light text-sm mt-1 leading-relaxed">
              {pack.description}
            </p>
          </div>
        </div>

        {/* Products list */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 mb-5">
          {packProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
            >
              <div className="relative p-2 rounded-2xl bg-bg-soft group-hover:shadow-soft transition-shadow">
                <ProductVisual product={product} size="sm" animate={false} />
              </div>
              <span className="text-[11px] font-[family-name:var(--font-body)] text-text-light text-center max-w-[72px] leading-tight">
                {product.name_fr}
              </span>
              <span className="text-[11px] font-semibold font-[family-name:var(--font-display)] text-text">
                {product.price} DH
              </span>
            </Link>
          ))}
        </div>

        {/* Pricing */}
        <div className="rounded-2xl bg-bg-soft p-4 mb-5 space-y-2">
          <div className="flex justify-between items-center text-sm font-[family-name:var(--font-body)]">
            <span className="text-text-light">Prix séparé</span>
            <span className="text-text-muted line-through">{separateTotal} DH</span>
          </div>
          <div className="flex justify-between items-center font-[family-name:var(--font-display)]">
            <span className="text-text font-semibold text-base">Prix pack</span>
            <span className="text-pink font-bold text-xl">{packTotal} DH</span>
          </div>
          <div className="flex justify-between items-center text-sm font-[family-name:var(--font-body)]">
            <span className="text-success-text font-medium">
              Économisez
            </span>
            <span className="text-success-text font-bold bg-success px-2.5 py-0.5 rounded-full text-xs">
              -{savings} DH
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            className="flex-1 gradient-pink text-white font-semibold py-3 px-5 rounded-full text-sm font-[family-name:var(--font-display)] cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddAllToCart}
          >
            Ajouter au panier 🛒
          </motion.button>
          <motion.button
            className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold py-3 px-5 rounded-full text-sm font-[family-name:var(--font-display)] cursor-pointer transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleWhatsApp}
          >
            Commander sur WhatsApp 💬
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function PacksSection() {
  return (
    <section id="packs" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block"
          >
            <span className="inline-flex items-center gap-1.5 bg-pink-accent text-pink text-xs font-semibold px-4 py-2 rounded-full mb-4 font-[family-name:var(--font-display)]">
              🎁 NOS PACKS
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-text font-[family-name:var(--font-display)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Les Coffrets Beaut&eacute;
          </motion.h2>

          <motion.p
            className="mt-4 text-text-light text-base md:text-lg font-[family-name:var(--font-body)] max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Des routines compl&egrave;tes &agrave; prix doux
          </motion.p>
        </div>

        {/* Packs grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {packs.map((pack, i) => (
            <PackCard key={pack.id} pack={pack} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
