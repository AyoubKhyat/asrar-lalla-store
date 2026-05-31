"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { products } from "@/data/products";
import ProductVisual from "@/components/ui/ProductVisual";
import { useCart } from "@/store/cart";

const routines = [
  {
    name: "Routine Glow Quotidienne",
    emoji: "✨",
    description: "4 étapes pour un teint lumineux chaque jour",
    steps: [
      { productId: "rose-water", step: "1. Tonifier", instruction: "Vaporisez sur le visage propre" },
      { productId: "rose-cream", step: "2. Hydrater", instruction: "Appliquez en massant doucement" },
      { productId: "lip-balm", step: "3. Nourrir", instruction: "Glissez sur les lèvres" },
      { productId: "blush", step: "4. Sublimer", instruction: "Tapotez sur les pommettes" },
    ],
    gradient: ["#FECDD3", "#FBCFE8"],
  },
  {
    name: "Routine Hammam Maison",
    emoji: "🧖‍♀️",
    description: "Le rituel hammam traditionnel chez vous",
    steps: [
      { productId: "savon-beldi", step: "1. Nettoyer", instruction: "Appliquez sur peau humide, laissez 5 min" },
      { productId: "gommage", step: "2. Exfolier", instruction: "Frottez en mouvements circulaires" },
      { productId: "rose-water", step: "3. Tonifier", instruction: "Vaporisez pour refermer les pores" },
      { productId: "beauty-oil", step: "4. Nourrir", instruction: "Massez sur peau encore humide" },
    ],
    gradient: ["#B8E6C8", "#A7F3D0"],
  },
  {
    name: "Routine Cheveux de Rêve",
    emoji: "💆‍♀️",
    description: "Des cheveux brillants et forts en 3 étapes",
    steps: [
      { productId: "shampoo", step: "1. Laver", instruction: "Massez le cuir chevelu 2-3 min" },
      { productId: "hair-herbs", step: "2. Traiter", instruction: "Appliquez le masque, 30 min" },
      { productId: "hair-cream", step: "3. Coiffer", instruction: "Répartissez sur longueurs et pointes" },
    ],
    gradient: ["#E8DEFF", "#DDD6FE"],
  },
];

export default function RoutineSection() {
  const { addToCart } = useCart();

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-accent text-pink text-xs font-bold tracking-wider uppercase mb-4">
            💎 ROUTINES RECOMMANDÉES
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-extrabold text-text tracking-tight mb-3">
            Votre Routine <span className="gradient-text">Parfaite</span>
          </h2>
          <p className="text-text-light text-base max-w-md mx-auto">
            Des combinaisons testées et approuvées par notre communauté
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {routines.map((routine, ri) => {
            const routineProducts = routine.steps
              .map((s) => products.find((p) => p.id === s.productId))
              .filter(Boolean) as typeof products;
            const totalPrice = routineProducts.reduce((s, p) => s + p.price, 0);

            return (
              <motion.div
                key={routine.name}
                className="bg-white rounded-3xl shadow-card border border-border overflow-hidden group hover:shadow-glow-lg transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: ri * 0.12 }}
              >
                {/* Header */}
                <div
                  className="p-5 text-center"
                  style={{ background: `linear-gradient(135deg, ${routine.gradient[0]}40, ${routine.gradient[1]}30)` }}
                >
                  <span className="text-3xl block mb-2">{routine.emoji}</span>
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-text text-lg">{routine.name}</h3>
                  <p className="text-text-muted text-xs mt-1">{routine.description}</p>
                </div>

                {/* Steps */}
                <div className="p-5 space-y-4">
                  {routine.steps.map((step, si) => {
                    const product = products.find((p) => p.id === step.productId);
                    if (!product) return null;
                    return (
                      <div key={step.productId} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${product.gradient[0]}25` }}>
                          <ProductVisual product={product} size="sm" animate={false} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-pink">{step.step}</p>
                          <Link href={`/products/${product.slug}`} className="text-sm font-semibold text-text hover:text-pink transition-colors truncate block">
                            {product.name_fr}
                          </Link>
                          <p className="text-[11px] text-text-muted">{step.instruction}</p>
                        </div>
                        <span className="text-xs font-bold text-text-light flex-shrink-0">{product.price} DH</span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between mb-3 pt-3 border-t border-border">
                    <span className="text-text-light text-sm">Routine complète</span>
                    <span className="font-[family-name:var(--font-display)] font-extrabold text-lg text-text">{totalPrice} DH</span>
                  </div>
                  <button
                    onClick={() => routineProducts.forEach((p) => addToCart(p))}
                    className="w-full py-3 rounded-xl gradient-pink text-white font-bold text-sm shadow-glow hover:shadow-glow-lg active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Ajouter la routine 🛒
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
