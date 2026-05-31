"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProductVisual from "@/components/ui/ProductVisual";
import { useCart } from "@/store/cart";
import { deliveryPrices, FREE_SHIPPING_THRESHOLD } from "@/data/config";

interface FormData {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
}

const initialForm: FormData = {
  fullName: "",
  phone: "",
  city: "",
  address: "",
  notes: "",
};

const cities = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Safi",
  "El Jadida",
  "Nador",
  "Béni Mellal",
  "Khouribga",
  "Taza",
  "Mohammedia",
  "Settat",
  "Berrechid",
  "Khemisset",
  "Autre",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, count, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  const shippingEntry = deliveryPrices.find((d) => d.city === form.city);
  const shippingCost = !form.city ? 0 : total >= FREE_SHIPPING_THRESHOLD ? 0 : (shippingEntry?.price ?? 15);
  const grandTotal = total + shippingCost;

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!form.fullName.trim()) newErrors.fullName = "Nom requis";
    if (!form.phone.trim()) {
      newErrors.phone = "Téléphone requis";
    } else if (!/^[\d+\s()-]{8,}$/.test(form.phone.trim())) {
      newErrors.phone = "Numéro invalide";
    }
    if (!form.city.trim()) newErrors.city = "Ville requise";
    if (!form.address.trim()) newErrors.address = "Adresse requise";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (e: FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setOrderError("");
    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name_fr,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            fullName: form.fullName,
            phone: form.phone,
            city: form.city,
            address: form.address,
            notes: form.notes || undefined,
          },
          items: orderItems,
          total: grandTotal,
          shippingCost,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOrderError(data.error || "Une erreur est survenue. Veuillez réessayer.");
        setSubmitting(false);
        return;
      }

      sessionStorage.setItem("asrar-order", JSON.stringify({
        ref: data.ref,
        items: orderItems,
        total: grandTotal,
        shippingCost,
        customer: data.customer,
      }));

      clearCart();
      router.push("/order-success");
    } catch {
      setOrderError("Erreur de connexion. Vérifiez votre internet et réessayez.");
      setSubmitting(false);
    }
  };

  // Redirect if cart is empty and not on step 2 (might have just confirmed)
  if (items.length === 0 && step === 1) {
    return (
      <div className="min-h-screen bg-bg pb-16" style={{ paddingTop: "var(--total-header)" }}>
        <div className="max-w-2xl mx-auto px-5 md:px-8 text-center py-20">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <span className="text-6xl block mb-4">🛒</span>
            <h2 className="text-2xl font-bold text-text font-[family-name:var(--font-display)] mb-3">Votre panier est vide</h2>
            <p className="text-text-muted text-sm mb-6">Ajoutez des produits avant de passer commande</p>
            <Link href="/products" className="inline-flex gradient-pink text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-glow">Découvrir la collection</Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-16" style={{ paddingTop: "var(--total-header)" }}>
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-text font-[family-name:var(--font-display)] mb-2">
              Commande
            </h1>
          </motion.div>

          {/* Step indicator */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-10"
          >
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= 1
                    ? "gradient-pink text-white shadow-glow"
                    : "bg-border text-text-muted"
                }`}
              >
                1
              </div>
              <span
                className={`text-sm font-medium font-[family-name:var(--font-body)] ${
                  step >= 1 ? "text-text" : "text-text-muted"
                }`}
              >
                Informations
              </span>
            </div>

            {/* Connector */}
            <div
              className={`flex-1 h-0.5 rounded-full transition-all ${
                step >= 2 ? "gradient-pink" : "bg-border"
              }`}
            />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= 2
                    ? "gradient-pink text-white shadow-glow"
                    : "bg-border text-text-muted"
                }`}
              >
                2
              </div>
              <span
                className={`text-sm font-medium font-[family-name:var(--font-body)] ${
                  step >= 2 ? "text-text" : "text-text-muted"
                }`}
              >
                Confirmation
              </span>
            </div>
          </motion.div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleContinue}
                className="space-y-5"
              >
                <div className="bg-white rounded-2xl shadow-soft border border-border p-6 md:p-8 space-y-5">
                  {/* Full name */}
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5 font-[family-name:var(--font-display)]">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      placeholder="Votre nom complet"
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all font-[family-name:var(--font-body)] ${
                        errors.fullName
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-border focus:border-pink focus:ring-pink/10"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-body)]">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5 font-[family-name:var(--font-display)]">
                      T&eacute;l&eacute;phone *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+212 6XX XX XX XX"
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all font-[family-name:var(--font-body)] ${
                        errors.phone
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-border focus:border-pink focus:ring-pink/10"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-body)]">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5 font-[family-name:var(--font-display)]">
                      Ville *
                    </label>
                    <select
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-text focus:outline-none focus:ring-2 transition-all font-[family-name:var(--font-body)] cursor-pointer ${
                        errors.city
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-border focus:border-pink focus:ring-pink/10"
                      } ${!form.city ? "text-text-muted" : ""}`}
                    >
                      <option value="">Choisir votre ville</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-body)]">
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5 font-[family-name:var(--font-display)]">
                      Adresse *
                    </label>
                    <textarea
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="Adresse complète de livraison"
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all font-[family-name:var(--font-body)] resize-none ${
                        errors.address
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-border focus:border-pink focus:ring-pink/10"
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs mt-1 font-[family-name:var(--font-body)]">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-text mb-1.5 font-[family-name:var(--font-display)]">
                      Notes{" "}
                      <span className="text-text-muted font-normal">
                        (optionnel)
                      </span>
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      placeholder="Instructions spéciales pour la livraison..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-white text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink/10 transition-all font-[family-name:var(--font-body)] resize-none"
                    />
                  </div>

                  {/* Payment badge */}
                  <div className="bg-pink-accent rounded-xl p-4 flex items-center gap-3">
                    <span className="text-2xl">&#128181;</span>
                    <div>
                      <p className="text-sm font-semibold text-text font-[family-name:var(--font-display)]">
                        Paiement &agrave; la livraison
                      </p>
                      <p className="text-xs text-text-light font-[family-name:var(--font-body)]">
                        Vous payez uniquement &agrave; la r&eacute;ception de
                        votre commande
                      </p>
                    </div>
                  </div>
                </div>

                {/* Continue button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl text-sm font-bold gradient-pink text-white shadow-glow hover:shadow-glow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 font-[family-name:var(--font-display)]"
                >
                  Continuer
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Order summary */}
                <div className="bg-white rounded-2xl shadow-soft border border-border p-6 md:p-8">
                  <h2 className="text-lg font-bold text-text font-[family-name:var(--font-display)] mb-5">
                    R&eacute;sum&eacute; de la commande
                  </h2>

                  {/* Items */}
                  <div className="space-y-3 mb-5">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-3 py-2"
                      >
                        <div
                          className="w-12 h-14 flex items-center justify-center rounded-lg flex-shrink-0"
                          style={{
                            background: `${item.product.gradient[0]}20`,
                          }}
                        >
                          <ProductVisual
                            product={item.product}
                            size="sm"
                            animate={false}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text font-[family-name:var(--font-display)] truncate">
                            {item.product.name_fr}
                          </p>
                          <p className="text-xs text-text-muted font-[family-name:var(--font-body)]">
                            Qty: {item.quantity} &times; {item.product.price} DH
                          </p>
                        </div>
                        <span className="text-sm font-bold text-text font-[family-name:var(--font-display)]">
                          {item.product.price * item.quantity} DH
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm font-[family-name:var(--font-body)]">
                      <span className="text-text-light">Sous-total</span>
                      <span className="text-text">{total} DH</span>
                    </div>
                    <div className="flex justify-between text-sm font-[family-name:var(--font-body)]">
                      <span className="text-text-light">Livraison</span>
                      <span className={`font-medium ${shippingCost === 0 ? "text-success-text" : "text-text"}`}>
                        {shippingCost === 0 ? "Gratuite" : `${shippingCost} DH`}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="text-base font-bold text-text font-[family-name:var(--font-display)]">
                        Total
                      </span>
                      <span className="text-xl font-bold text-text font-[family-name:var(--font-display)]">
                        {grandTotal} DH
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery info */}
                <div className="bg-white rounded-2xl shadow-soft border border-border p-6 md:p-8">
                  <h2 className="text-lg font-bold text-text font-[family-name:var(--font-display)] mb-4">
                    Informations de livraison
                  </h2>
                  <div className="space-y-2 text-sm font-[family-name:var(--font-body)]">
                    <div className="flex gap-2">
                      <span className="text-text-muted w-20">Nom</span>
                      <span className="text-text font-medium">
                        {form.fullName}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-text-muted w-20">
                        T&eacute;l&eacute;phone
                      </span>
                      <span className="text-text font-medium">
                        {form.phone}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-text-muted w-20">Ville</span>
                      <span className="text-text font-medium">{form.city}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-text-muted w-20">Adresse</span>
                      <span className="text-text font-medium">
                        {form.address}
                      </span>
                    </div>
                    {form.notes && (
                      <div className="flex gap-2">
                        <span className="text-text-muted w-20">Notes</span>
                        <span className="text-text">{form.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error message */}
                {orderError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 font-[family-name:var(--font-body)]"
                  >
                    {orderError}
                  </motion.div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setStep(1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex-1 py-4 rounded-2xl text-sm font-bold bg-white text-text border border-border hover:border-pink-soft hover:bg-pink-accent/30 transition-all duration-200 font-[family-name:var(--font-display)]"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={submitting}
                    className="flex-[2] py-4 rounded-2xl text-sm font-bold gradient-pink text-white shadow-glow hover:shadow-glow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 font-[family-name:var(--font-display)] disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {submitting ? "Envoi en cours..." : "Confirmer la commande"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </div>
  );
}
