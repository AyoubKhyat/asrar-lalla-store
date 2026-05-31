"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import CartPanel from "@/components/cart/CartPanel";
import ToastProvider from "@/components/ui/Toast";
import PromoBanner from "@/components/ui/PromoBanner";
import WhatsAppFloatingButton from "@/components/ui/WhatsAppButton";
import { useLenis } from "@/hooks/useLenis";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  useLenis();

  return (
    <>
      <PromoBanner />
      <Navbar />
      <main id="main-content" className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileBottomNav />
      <CartPanel />
      <ToastProvider />
      <WhatsAppFloatingButton />
    </>
  );
}
