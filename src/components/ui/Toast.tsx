"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onToast } from "@/store/cart";

export default function ToastProvider() {
  const [toasts, setToasts] = useState<{ id: number; msg: string }[]>([]);

  useEffect(() => {
    let counter = 0;
    const unsub = onToast((msg) => {
      const id = ++counter;
      setToasts((prev) => [...prev, { id, msg }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
    });
    return () => { unsub(); };
  }, []);

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[80] flex flex-col gap-2 items-center pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className="px-5 py-3 rounded-2xl bg-text text-white text-sm font-medium shadow-lg flex items-center gap-2"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
          >
            <span className="text-base">✓</span>
            {toast.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
