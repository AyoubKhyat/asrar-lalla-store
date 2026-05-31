"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { products, type Product } from "@/data/products";
import { useCart } from "@/store/cart";

/* ------------------------------------------------------------------ */
/*  Types & data                                                       */
/* ------------------------------------------------------------------ */

interface BeautyQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuizOption {
  emoji: string;
  label: string;
}

interface QuizStep {
  question: string;
  options: QuizOption[];
}

const steps: QuizStep[] = [
  {
    question: "Quel est votre type de peau ?",
    options: [
      { emoji: "🧴", label: "Normale" },
      { emoji: "💧", label: "Sèche" },
      { emoji: "✨", label: "Mixte" },
      { emoji: "🫧", label: "Grasse" },
      { emoji: "🌸", label: "Sensible" },
    ],
  },
  {
    question: "Quel est votre type de cheveux ?",
    options: [
      { emoji: "💇‍♀️", label: "Lisses" },
      { emoji: "〰️", label: "Ondulés" },
      { emoji: "🌀", label: "Bouclés" },
      { emoji: "💆‍♀️", label: "Crépus" },
      { emoji: "😤", label: "Abîmés" },
    ],
  },
  {
    question: "Quelle est votre préoccupation principale ?",
    options: [
      { emoji: "😐", label: "Teint terne" },
      { emoji: "🔴", label: "Imperfections" },
      { emoji: "🧓", label: "Anti-âge" },
      { emoji: "💧", label: "Déshydratation" },
      { emoji: "🌿", label: "Naturel & bio" },
    ],
  },
  {
    question: "Quel résultat cherchez-vous ?",
    options: [
      { emoji: "✨", label: "Peau éclatante" },
      { emoji: "🧖‍♀️", label: "Routine hammam" },
      { emoji: "💋", label: "Look naturel" },
      { emoji: "👰", label: "Préparation mariage" },
      { emoji: "🧴", label: "Soin quotidien" },
    ],
  },
  {
    question: "Votre budget ?",
    options: [
      { emoji: "💰", label: "Moins de 30 DH" },
      { emoji: "💎", label: "30-60 DH" },
      { emoji: "👑", label: "60-100 DH" },
      { emoji: "🌟", label: "Plus de 100 DH" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Recommendation logic                                               */
/* ------------------------------------------------------------------ */

function recommend(answers: (string | null)[]): Product[] {
  const [skinType, hairType, concern, goal, budget] = answers;
  const scored = new Map<string, number>();

  const bump = (id: string, pts: number) =>
    scored.set(id, (scored.get(id) ?? 0) + pts);

  // Skin type matching
  if (skinType === "Sèche" || skinType === "Sensible") {
    bump("rose-cream", 3);
    bump("rose-water", 2);
    bump("beauty-oil", 2);
  }
  if (skinType === "Grasse" || skinType === "Mixte") {
    bump("peel-mask", 3);
    bump("tbrima", 2);
    bump("savon-beldi", 2);
  }
  if (skinType === "Normale") {
    bump("rose-water", 2);
    bump("rose-cream", 2);
  }

  // Hair type matching
  if (hairType === "Abîmés") {
    bump("hair-herbs", 3);
    bump("hair-cream", 3);
    bump("shampoo", 2);
  }
  if (hairType === "Bouclés" || hairType === "Crépus") {
    bump("hair-cream", 3);
    bump("beauty-oil", 2);
  }
  if (hairType === "Lisses" || hairType === "Ondulés") {
    bump("shampoo", 2);
    bump("hair-cream", 1);
  }

  // Concern matching
  if (concern === "Teint terne") {
    bump("tbrima", 3);
    bump("gommage", 2);
    bump("rose-water", 2);
  }
  if (concern === "Imperfections") {
    bump("peel-mask", 3);
    bump("savon-beldi", 2);
    bump("tbrima", 2);
  }
  if (concern === "Anti-âge") {
    bump("rose-cream", 3);
    bump("beauty-oil", 2);
    bump("rose-water", 2);
  }
  if (concern === "Déshydratation") {
    bump("rose-cream", 3);
    bump("rose-water", 3);
    bump("beauty-milk", 2);
  }
  if (concern === "Naturel & bio") {
    bump("savon-beldi", 2);
    bump("beauty-oil", 2);
    bump("rose-water", 2);
  }

  // Goal matching
  if (goal === "Peau éclatante") {
    bump("rose-water", 4);
    bump("tbrima", 2);
    bump("gommage", 2);
  }
  if (goal === "Routine hammam") {
    bump("savon-beldi", 4);
    bump("gommage", 3);
    bump("beauty-oil", 2);
  }
  if (goal === "Look naturel") {
    bump("blush", 4);
    bump("lip-balm", 3);
    bump("kohl", 2);
  }
  if (goal === "Préparation mariage") {
    bump("rose-water", 3);
    bump("rose-cream", 3);
    bump("blush", 3);
    bump("kohl", 2);
    bump("tbrima", 2);
  }
  if (goal === "Soin quotidien") {
    bump("rose-cream", 3);
    bump("rose-water", 2);
    bump("lip-balm", 2);
    bump("beauty-milk", 2);
  }

  // Sort by score desc
  const sorted = [...scored.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => products.find((p) => p.id === id)!)
    .filter(Boolean);

  // Budget determines count
  let maxItems = 3;
  if (budget === "30-60 DH") maxItems = 4;
  if (budget === "60-100 DH") maxItems = 5;
  if (budget === "Plus de 100 DH") maxItems = 5;

  return sorted.slice(0, maxItems);
}

/* ------------------------------------------------------------------ */
/*  Motion variants                                                    */
/* ------------------------------------------------------------------ */

const overlayV = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalV = {
  hidden: { opacity: 0, scale: 0.92, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 28, stiffness: 340 },
  },
  exit: { opacity: 0, scale: 0.92, y: 40 },
};

const stepV = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit: { opacity: 0, x: -60, transition: { duration: 0.25 } },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function BeautyQuiz({ isOpen, onClose }: BeautyQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(steps.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const { addToCart } = useCart();

  const recommended = useMemo(
    () => (showResults ? recommend(answers) : []),
    [showResults, answers]
  );

  const reset = useCallback(() => {
    setCurrentStep(0);
    setAnswers(Array(steps.length).fill(null));
    setShowResults(false);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    // Reset after animation
    setTimeout(reset, 300);
  }, [onClose, reset]);

  const selectOption = (label: string) => {
    const updated = [...answers];
    updated[currentStep] = label;
    setAnswers(updated);
  };

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowResults(true);
    }
  };

  const goBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const addAllToCart = () => {
    recommended.forEach((p) => addToCart(p));
    handleClose();
  };

  const progress = showResults
    ? 100
    : ((currentStep + (answers[currentStep] ? 1 : 0)) / steps.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          variants={overlayV}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-glow-lg md:max-h-[85vh]"
            variants={modalV}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-soft text-text-light hover:text-text transition-colors cursor-pointer"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>

            {/* Pink gradient header */}
            <div className="gradient-pink px-6 pt-8 pb-6 rounded-t-3xl text-center">
              <h2 className="text-white text-xl md:text-2xl font-bold font-[family-name:var(--font-display)]">
                {showResults
                  ? "Votre Routine Personnalisée 🌸"
                  : "🌸 Diagnostic Beauté"}
              </h2>
              {!showResults && (
                <p className="text-white/80 text-sm mt-1 font-[family-name:var(--font-body)]">
                  Répondez à 5 questions, on s&apos;occupe du reste
                </p>
              )}
            </div>

            {/* Progress bar */}
            <div className="px-6 pt-4">
              <div className="flex items-center justify-between text-xs text-text-muted mb-2 font-[family-name:var(--font-body)]">
                <span>
                  {showResults
                    ? "Résultats"
                    : `Étape ${currentStep + 1}/${steps.length}`}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-pink-accent rounded-full overflow-hidden">
                <motion.div
                  className="h-full gradient-pink rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Content area */}
            <div className="px-6 py-6 min-h-[320px]">
              <AnimatePresence mode="wait">
                {!showResults ? (
                  <motion.div
                    key={`step-${currentStep}`}
                    variants={stepV}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <h3 className="text-lg md:text-xl font-bold text-text mb-6 font-[family-name:var(--font-display)]">
                      {steps[currentStep].question}
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                      {steps[currentStep].options.map((opt) => {
                        const selected = answers[currentStep] === opt.label;
                        return (
                          <motion.button
                            key={opt.label}
                            onClick={() => selectOption(opt.label)}
                            className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                              selected
                                ? "border-[#FF5FA2] bg-pink-accent shadow-glow"
                                : "border-border bg-white hover:border-[#FFCFE1] hover:bg-bg-soft"
                            }`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <span className="text-3xl">{opt.emoji}</span>
                            <span
                              className={`text-sm font-medium font-[family-name:var(--font-body)] ${
                                selected ? "text-[#FF5FA2]" : "text-text"
                              }`}
                            >
                              {opt.label}
                            </span>
                            {selected && (
                              <motion.div
                                className="absolute top-2 right-2 w-5 h-5 rounded-full gradient-pink flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 20,
                                }}
                              >
                                <svg
                                  width="10"
                                  height="8"
                                  viewBox="0 0 10 8"
                                  fill="none"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M1 4l3 3 5-5" />
                                </svg>
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : (
                  /* ----- RESULTS SCREEN ----- */
                  <motion.div
                    key="results"
                    variants={stepV}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <p className="text-sm text-text-light mb-5 font-[family-name:var(--font-body)]">
                      Voici les produits idéaux pour vous, basés sur
                      vos réponses :
                    </p>

                    <div className="space-y-3">
                      {recommended.map((product, i) => (
                        <motion.div
                          key={product.id}
                          className="flex items-center gap-4 p-4 bg-bg-soft rounded-2xl border border-border"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {/* Color swatch */}
                          <div
                            className="w-12 h-12 rounded-xl flex-shrink-0"
                            style={{
                              background: `linear-gradient(135deg, ${product.gradient[0]}, ${product.gradient[1]})`,
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-text text-sm font-[family-name:var(--font-display)] truncate">
                              {product.name_fr}
                            </h4>
                            <p className="text-xs text-text-light font-[family-name:var(--font-body)] line-clamp-1">
                              {product.tagline}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-[#FF5FA2] flex-shrink-0 font-[family-name:var(--font-display)]">
                            {product.price} DH
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {recommended.length > 0 && (
                      <div className="mt-4 p-3 bg-pink-accent/60 rounded-xl text-center">
                        <span className="text-sm font-semibold text-text font-[family-name:var(--font-body)]">
                          Total :{" "}
                          <span className="text-[#FF5FA2]">
                            {recommended.reduce((s, p) => s + p.price, 0)} DH
                          </span>
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 space-y-3">
                      <motion.button
                        onClick={addAllToCart}
                        className="w-full gradient-pink text-white font-semibold py-3.5 rounded-full text-sm shadow-glow font-[family-name:var(--font-display)] cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Ajouter tout au panier
                      </motion.button>

                      <Link
                        href="/products"
                        onClick={handleClose}
                        className="block w-full text-center py-3 rounded-full text-sm font-semibold text-[#FF5FA2] bg-pink-accent hover:bg-[#FFCFE1] transition-colors font-[family-name:var(--font-display)]"
                      >
                        Voir la collection
                      </Link>

                      <button
                        onClick={reset}
                        className="w-full text-center py-2 text-sm text-text-muted hover:text-text transition-colors font-[family-name:var(--font-body)] cursor-pointer"
                      >
                        Recommencer le quiz
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation footer (not shown on results) */}
            {!showResults && (
              <div className="px-6 pb-6 flex items-center justify-between gap-3">
                <button
                  onClick={goBack}
                  disabled={currentStep === 0}
                  className="px-5 py-2.5 rounded-full text-sm font-medium text-text-light hover:text-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-[family-name:var(--font-body)] cursor-pointer"
                >
                  Retour
                </button>

                <motion.button
                  onClick={goNext}
                  disabled={!answers[currentStep]}
                  className="px-8 py-2.5 rounded-full text-sm font-semibold gradient-pink text-white shadow-glow disabled:opacity-40 disabled:cursor-not-allowed font-[family-name:var(--font-display)] cursor-pointer"
                  whileHover={
                    answers[currentStep] ? { scale: 1.04 } : undefined
                  }
                  whileTap={
                    answers[currentStep] ? { scale: 0.97 } : undefined
                  }
                >
                  {currentStep === steps.length - 1 ? "Voir mes résultats" : "Suivant"}
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
