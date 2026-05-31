"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/store/cart";

const tabs = [
  { href: "/", icon: "🏠", label: "Accueil" },
  { href: "/products", icon: "✨", label: "Collection" },
  { href: "/cart", icon: "🛒", label: "Panier", showBadge: true },
  { href: "#reviews", icon: "💬", label: "Avis" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <motion.nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-border"
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: "spring", damping: 25 }}
    >
      <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const isActive = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const isAnchor = tab.href.startsWith("#");

          const inner = (
            <div className="flex flex-col items-center gap-0.5 relative py-1 px-3">
              <span className="text-lg relative">
                {tab.icon}
                {mounted && tab.showBadge && count > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-pink text-white text-[9px] font-bold flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={count}
                  >
                    {count}
                  </motion.span>
                )}
              </span>
              <span className={`text-[10px] font-medium ${isActive ? "text-pink" : "text-text-muted"}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-pink"
                  layoutId="bottomNavIndicator"
                />
              )}
            </div>
          );

          if (isAnchor) {
            return <a key={tab.href} href={tab.href} className="cursor-pointer">{inner}</a>;
          }

          return (
            <Link key={tab.href} href={tab.href} className="cursor-pointer">
              {inner}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
