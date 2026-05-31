"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  orderService,
  productService,
  settingsService,
  authService,
  type Order,
  type OrderStatus,
  type SiteSettings,
  statusLabels,
  statusColors,
  statusEmoji,
  statusTimeline,
  whatsappLink,
  confirmationMessage,
  shippedMessage,
  followUpMessage,
  exportOrdersCSV,
  downloadCSV,
  printOrderSlip,
} from "@/data/admin";
import { type Product, products as staticProducts, reviews as initialReviews } from "@/data/products";
import { deliveryPrices } from "@/data/config";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Tab = "commandes" | "produits" | "parametres" | "avis";

const allStatuses: OrderStatus[] = [
  "new",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
];

type DateFilter = "all" | "today" | "week" | "month";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-MA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-MA", {
    day: "2-digit",
    month: "short",
  });
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

function isThisWeek(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return d >= startOfWeek;
}

function isThisMonth(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function getDayLabel(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toLocaleDateString("fr-MA", { weekday: "short", day: "numeric" });
}

/* ------------------------------------------------------------------ */
/*  Review type for admin                                              */
/* ------------------------------------------------------------------ */

interface AdminReview {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  product: string;
  verified: boolean;
  visible: boolean;
}

function loadReviews(): AdminReview[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("asrar-admin-reviews");
    if (raw) return JSON.parse(raw);
  } catch {}
  return initialReviews.map((r, i) => ({
    id: String(i),
    name: r.name,
    city: r.city,
    rating: r.rating,
    text: r.text,
    product: r.product,
    verified: r.verified,
    visible: true,
  }));
}

function saveReviews(revs: AdminReview[]) {
  try {
    localStorage.setItem("asrar-admin-reviews", JSON.stringify(revs));
  } catch {}
}

/* ------------------------------------------------------------------ */
/*  Toast component                                                    */
/* ------------------------------------------------------------------ */

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed bottom-6 right-6 z-[100] rounded-xl bg-green-600 px-5 py-3 text-sm font-medium text-white shadow-lg"
    >
      {message}
    </motion.div>
  );
}

/* ================================================================== */
/*  LOGIN SCREEN                                                       */
/* ================================================================== */

function LoginScreen({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const success = await authService.login(email, password);
    if (success) {
      onAuth();
    } else {
      setError(true);
      setShake(true);
      setLoading(false);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FFF8FB] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl bg-white p-8 shadow-card text-center">
          {/* Brand logo */}
          <div className="mx-auto mb-4">
            <img src="/brand/logos/icon-mark.svg" alt="ASRAR LALLA" className="w-16 h-16 mx-auto" />
          </div>

          <h1 className="mb-1 text-xl font-bold font-[family-name:var(--font-display)] text-text">
            Administration
          </h1>
          <p className="mb-6 text-sm text-text-light">
            Connectez-vous pour acc&eacute;der au tableau de bord
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* Email */}
            <div>
              <label className="mb-1 block text-xs font-medium text-text-light">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(false);
                }}
                placeholder="admin@asrarlalla.ma"
                className="w-full rounded-xl border-2 border-border px-4 py-3 text-sm outline-none transition-colors focus:border-pink"
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-xs font-medium text-text-light">
                Mot de passe
              </label>
              <motion.div animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Entrez votre mot de passe"
                  className={`w-full rounded-xl border-2 px-4 py-3 text-sm outline-none transition-colors ${
                    error
                      ? "border-red-400 bg-red-50"
                      : "border-border focus:border-pink"
                  }`}
                />
              </motion.div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">
                Email ou mot de passe incorrect
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-pink py-3 text-sm font-semibold text-white transition-colors hover:bg-pink-dark active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Connexion...
                </span>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

/* ================================================================== */
/*  ORDER DETAIL DRAWER                                                */
/* ================================================================== */

function OrderDrawer({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}) {
  const isCancelled = order.status === "cancelled";

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-bold font-[family-name:var(--font-display)] text-text">
              {order.ref}
            </h2>
            <p className="text-xs text-text-muted">{formatDate(order.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:bg-gray-50 hover:text-text cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Status timeline */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Statut de la commande
            </h3>
            {isCancelled ? (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center">
                <span className="text-2xl">&#10060;</span>
                <p className="mt-1 text-sm font-semibold text-red-700">Commande annul&eacute;e</p>
              </div>
            ) : (
              <div className="flex items-center gap-0">
                {statusTimeline.map((step, i) => {
                  const currentIdx = statusTimeline.indexOf(order.status);
                  const isActive = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={step} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                            isCurrent
                              ? "bg-pink text-white ring-4 ring-pink/20"
                              : isActive
                              ? "bg-pink text-white"
                              : "bg-gray-100 text-text-muted"
                          }`}
                        >
                          {isActive ? (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            i + 1
                          )}
                        </div>
                        <span className={`mt-1 text-[10px] text-center leading-tight ${isCurrent ? "font-semibold text-pink" : "text-text-muted"}`}>
                          {statusLabels[step]}
                        </span>
                      </div>
                      {i < statusTimeline.length - 1 && (
                        <div
                          className={`h-0.5 w-full min-w-[12px] ${
                            i < currentIdx ? "bg-pink" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status change */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-medium text-text-muted whitespace-nowrap">
              Changer le statut :
            </label>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-pink cursor-pointer"
            >
              {allStatuses.map((s) => (
                <option key={s} value={s}>
                  {statusEmoji[s]} {statusLabels[s]}
                </option>
              ))}
            </select>
          </div>

          {/* Customer info */}
          <div className="rounded-xl bg-gray-50 p-4 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Client
            </h3>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-text">{order.customer.fullName}</p>
              <p className="text-sm text-text-light">{order.customer.phone}</p>
              <p className="text-sm text-text-light">
                {order.customer.city} &mdash; {order.customer.address}
              </p>
              {order.customer.notes && (
                <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
                  <p className="text-xs text-amber-700">
                    <span className="font-semibold">Note :</span> {order.customer.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Items table */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
              Articles
            </h3>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-text-muted">Produit</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-text-muted">Qt&eacute;</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-text-muted">P.U.</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-text-muted">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="border-t border-border/50">
                      <td className="px-3 py-2 text-text">{item.name}</td>
                      <td className="px-3 py-2 text-center text-text-light">{item.quantity}</td>
                      <td className="px-3 py-2 text-right text-text-light">{item.price} DH</td>
                      <td className="px-3 py-2 text-right font-medium text-text">{item.price * item.quantity} DH</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t-2 border-pink bg-pink-soft/30 px-3 py-3 text-right">
                <span className="text-sm text-text-light">Total : </span>
                <span className="text-lg font-bold text-pink">{order.total} DH</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              Actions rapides
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={whatsappLink(order.customer.phone, confirmationMessage(order))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-3 py-3 text-xs font-semibold text-white transition-colors hover:bg-green-600 cursor-pointer"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Confirmer par WhatsApp
              </a>
              <a
                href={whatsappLink(order.customer.phone, shippedMessage(order))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-3 py-3 text-xs font-semibold text-white transition-colors hover:bg-purple-600 cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                Envoyer suivi livraison
              </a>
              <a
                href={whatsappLink(order.customer.phone, followUpMessage(order))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 py-3 text-xs font-semibold text-white transition-colors hover:bg-amber-600 cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Demander un avis
              </a>
              <button
                onClick={() => printOrderSlip(order)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gray-700 px-3 py-3 text-xs font-semibold text-white transition-colors hover:bg-gray-800 cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimer bon de livraison
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

/* ================================================================== */
/*  SALES CHARTS                                                       */
/* ================================================================== */

function SalesCharts({ orders }: { orders: Order[] }) {
  // Daily revenue for last 7 days
  const dailyRevenue = useMemo(() => {
    const days: { label: string; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);

      const revenue = orders
        .filter((o) => {
          const od = new Date(o.createdAt);
          return (
            od >= d &&
            od <= endOfDay &&
            ["confirmed", "preparing", "shipped", "delivered"].includes(o.status)
          );
        })
        .reduce((sum, o) => sum + o.total, 0);

      days.push({ label: getDayLabel(i), revenue });
    }
    return days;
  }, [orders]);

  const maxRevenue = Math.max(...dailyRevenue.map((d) => d.revenue), 1);

  // Top 5 products by quantity sold
  const topProducts = useMemo(() => {
    const productMap: Record<string, { name: string; qty: number }> = {};
    orders.forEach((o) => {
      if (o.status !== "cancelled") {
        o.items.forEach((item) => {
          if (!productMap[item.name]) {
            productMap[item.name] = { name: item.name, qty: 0 };
          }
          productMap[item.name].qty += item.quantity;
        });
      }
    });
    return Object.values(productMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders]);

  const maxQty = Math.max(...topProducts.map((p) => p.qty), 1);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Daily revenue chart */}
      <div className="rounded-2xl bg-white p-5 shadow-soft">
        <h3 className="mb-4 text-sm font-bold font-[family-name:var(--font-display)] text-text">
          Ventes des 7 derniers jours
        </h3>
        <div className="flex items-end gap-2 h-40">
          {dailyRevenue.map((day, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-semibold text-text-muted">
                {day.revenue > 0 ? `${day.revenue}` : ""}
              </span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max((day.revenue / maxRevenue) * 100, day.revenue > 0 ? 8 : 2)}%` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="w-full rounded-t-lg bg-pink/80 hover:bg-pink transition-colors min-h-[4px]"
              />
              <span className="text-[9px] text-text-muted whitespace-nowrap">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top products chart */}
      <div className="rounded-2xl bg-white p-5 shadow-soft">
        <h3 className="mb-4 text-sm font-bold font-[family-name:var(--font-display)] text-text">
          Produits les plus vendus
        </h3>
        <div className="space-y-3">
          {topProducts.length === 0 ? (
            <p className="text-sm text-text-muted py-4 text-center">Aucune vente</p>
          ) : (
            topProducts.map((product, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text truncate max-w-[70%]">{product.name}</span>
                  <span className="font-semibold text-text-muted">{product.qty} unit&eacute;s</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(product.qty / maxQty) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="h-full rounded-full bg-pink/70"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  COMMANDES TAB                                                      */
/* ================================================================== */

function CommandesTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [drawerOrder, setDrawerOrder] = useState<Order | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<OrderStatus>("confirmed");
  const [toast, setToast] = useState("");

  useEffect(() => {
    orderService.getAll().then(setOrders);
  }, []);

  /* Derived data */
  const stats = useMemo(() => {
    const total = orders.length;
    const newCount = orders.filter((o) => o.status === "new").length;
    const revenue = orders
      .filter((o) => ["delivered", "confirmed", "shipped", "preparing"].includes(o.status))
      .reduce((s, o) => s + o.total, 0);
    const today = orders.filter((o) => isToday(o.createdAt)).length;
    return { total, newCount, revenue, today };
  }, [orders]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allStatuses.forEach((s) => {
      counts[s] = orders.filter((o) => o.status === s).length;
    });
    return counts;
  }, [orders]);

  const filtered = useMemo(() => {
    let list = orders;

    // Status filter
    if (statusFilter !== "all") {
      list = list.filter((o) => o.status === statusFilter);
    }

    // Date filter
    if (dateFilter === "today") {
      list = list.filter((o) => isToday(o.createdAt));
    } else if (dateFilter === "week") {
      list = list.filter((o) => isThisWeek(o.createdAt));
    } else if (dateFilter === "month") {
      list = list.filter((o) => isThisMonth(o.createdAt));
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.phone.includes(q) ||
          o.ref.toLowerCase().includes(q)
      );
    }

    return list;
  }, [orders, statusFilter, dateFilter, search]);

  async function handleStatusChange(id: string, status: OrderStatus) {
    await orderService.updateStatus(id, status);
    const refreshed = await orderService.getAll();
    setOrders(refreshed);
    if (drawerOrder && drawerOrder.id === id) {
      const updated = refreshed.find((o) => o.id === id);
      if (updated) setDrawerOrder(updated);
    }
    setToast(`Statut mis a jour: ${statusLabels[status]}`);
  }

  async function handleBulkUpdate() {
    if (selectedIds.size === 0) return;
    await orderService.bulkUpdateStatus(Array.from(selectedIds), bulkStatus);
    const refreshed = await orderService.getAll();
    setOrders(refreshed);
    setToast(`${selectedIds.size} commande(s) mise(s) a jour`);
    setSelectedIds(new Set());
  }

  function toggleSelect(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((o) => o.id)));
    }
  }

  function handleExport() {
    downloadCSV(exportOrdersCSV(filtered), "commandes-asrar.csv");
    setToast("Export CSV telecharge");
  }

  const statCards = [
    {
      label: "Total commandes",
      value: stats.total,
      color: "bg-purple-50 text-purple-700",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: "Nouvelles",
      value: stats.newCount,
      color: "bg-blue-50 text-blue-700",
      badgeColor: "bg-blue-500",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Revenu total",
      value: `${stats.revenue} DH`,
      color: "bg-green-50 text-green-700",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Commandes du jour",
      value: stats.today,
      color: "bg-pink-50 text-pink-700",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const dateFilters: { label: string; value: DateFilter }[] = [
    { label: "Tout", value: "all" },
    { label: "Aujourd'hui", value: "today" },
    { label: "Cette semaine", value: "week" },
    { label: "Ce mois", value: "month" },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {statCards.map((c) => (
          <div key={c.label} className="rounded-2xl bg-white p-4 shadow-soft">
            <div className={`mb-2 inline-flex rounded-lg p-2 ${c.color}`}>
              {c.icon}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-text">{c.value}</p>
              {"badgeColor" in c && stats.newCount > 0 && (
                <span className={`rounded-full ${c.badgeColor} px-2 py-0.5 text-[10px] font-bold text-white`}>
                  {stats.newCount}
                </span>
              )}
            </div>
            <p className="text-xs text-text-light">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Search + status filters */}
      <div className="space-y-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par nom, t&eacute;l&eacute;phone ou r&eacute;f&eacute;rence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-pink"
          />
        </div>

        {/* Status pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              statusFilter === "all"
                ? "bg-pink text-white"
                : "bg-gray-100 text-text-light hover:bg-gray-200"
            }`}
          >
            Toutes ({orders.length})
          </button>
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === s
                  ? "bg-pink text-white"
                  : "bg-gray-100 text-text-light hover:bg-gray-200"
              }`}
            >
              {statusEmoji[s]} {statusLabels[s]} ({statusCounts[s] || 0})
            </button>
          ))}
        </div>

        {/* Date filter pills */}
        <div className="flex flex-wrap gap-2">
          {dateFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setDateFilter(f.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                dateFilter === f.value
                  ? "bg-text text-white"
                  : "bg-gray-100 text-text-light hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-3 shadow-soft">
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-text-light transition-colors hover:bg-gray-200 cursor-pointer"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </button>

        <div className="h-5 w-px bg-border" />

        <label className="flex items-center gap-2 text-xs text-text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={selectedIds.size > 0 && selectedIds.size === filtered.length}
            onChange={toggleSelectAll}
            className="h-4 w-4 rounded accent-pink cursor-pointer"
          />
          Tout s&eacute;lectionner
        </label>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-text-muted">
              {selectedIds.size} s&eacute;lectionn&eacute;e(s)
            </span>
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as OrderStatus)}
              className="rounded-lg border border-border px-2 py-1.5 text-xs outline-none focus:border-pink cursor-pointer"
            >
              {allStatuses.map((s) => (
                <option key={s} value={s}>
                  {statusLabels[s]}
                </option>
              ))}
            </select>
            <button
              onClick={handleBulkUpdate}
              className="rounded-lg bg-pink px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-pink-dark cursor-pointer"
            >
              Mettre &agrave; jour le statut
            </button>
          </div>
        )}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-soft">
          <p className="text-text-light">Aucune commande trouv&eacute;e</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <motion.div
              key={order.id}
              layout
              className="rounded-2xl bg-white shadow-soft overflow-hidden transition-shadow hover:shadow-card"
            >
              <div className="flex items-center gap-3 p-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedIds.has(order.id)}
                  onChange={() => toggleSelect(order.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-4 w-4 shrink-0 rounded accent-pink cursor-pointer"
                />

                {/* Card content (clickable) */}
                <button
                  onClick={() => setDrawerOrder(order)}
                  className="flex flex-1 items-center gap-3 text-left min-w-0 cursor-pointer"
                >
                  <div className="hidden sm:block min-w-[100px]">
                    <span className="text-xs font-mono font-semibold text-text">
                      {order.ref}
                    </span>
                    <p className="text-[10px] text-text-muted">
                      {formatShortDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text truncate">
                      {order.customer.fullName}
                    </p>
                    <p className="text-xs text-text-muted sm:hidden">
                      {order.ref} &middot; {formatShortDate(order.createdAt)}
                    </p>
                    <p className="text-xs text-text-muted">
                      {order.customer.city}
                    </p>
                  </div>

                  <div className="hidden md:block text-xs text-text-muted text-center">
                    <span>{order.items.length} article{order.items.length > 1 ? "s" : ""}</span>
                  </div>

                  <div className="text-sm font-bold text-text whitespace-nowrap">
                    {order.total} DH
                  </div>

                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${statusColors[order.status]}`}>
                    {statusEmoji[order.status]} {statusLabels[order.status]}
                  </span>

                  <svg
                    className="h-4 w-4 text-text-muted shrink-0 hidden sm:block"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Sales Charts */}
      <SalesCharts orders={orders} />

      {/* Order Drawer */}
      <AnimatePresence>
        {drawerOrder && (
          <OrderDrawer
            order={drawerOrder}
            onClose={() => setDrawerOrder(null)}
            onStatusChange={(id, status) => {
              handleStatusChange(id, status);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast("")} />}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/*  PRODUITS TAB                                                       */
/* ================================================================== */

function ProduitsTab() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({ price: 0, stock: 0, is_trending: false, is_best_seller: false });
  const [toast, setToast] = useState("");

  useEffect(() => {
    productService.getAllProducts().then(setAllProducts);
  }, []);

  const outOfStock = allProducts.filter((p) => p.stock === 0);
  const lowStock = allProducts.filter((p) => p.stock > 0 && p.stock <= 5);

  function openEdit(p: (typeof allProducts)[number]) {
    setEditingProduct(p);
    setEditForm({
      price: p.price,
      stock: p.stock,
      is_trending: p.is_trending,
      is_best_seller: p.is_best_seller,
    });
  }

  async function handleSaveEdit() {
    if (!editingProduct) return;
    await productService.update(editingProduct.id, {
      price: editForm.price,
      stock: editForm.stock,
      is_trending: editForm.is_trending,
      is_best_seller: editForm.is_best_seller,
    });
    const refreshed = await productService.getAllProducts();
    setAllProducts(refreshed);
    setEditingProduct(null);
    setToast("Modifications sauvegardees");
  }

  function stockColor(stock: number): string {
    if (stock === 0) return "bg-red-100 text-red-700";
    if (stock <= 5) return "bg-red-100 text-red-700";
    if (stock <= 20) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  }

  return (
    <div className="space-y-4">
      {/* Out of stock alert */}
      {outOfStock.length > 0 && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-center gap-3">
          <span className="text-lg">&#9888;&#65039;</span>
          <div>
            <p className="text-sm font-semibold text-red-700">Produits en rupture de stock</p>
            <p className="text-xs text-red-600">
              {outOfStock.map((p) => p.name_fr).join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Low stock warning */}
      {lowStock.length > 0 && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-3">
          <span className="text-lg">&#9888;&#65039;</span>
          <div>
            <p className="text-sm font-semibold text-amber-700">Stock faible</p>
            <p className="text-xs text-amber-600">
              {lowStock.map((p) => `${p.name_fr} (${p.stock})`).join(", ")}
            </p>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-2.5 text-xs text-blue-700">
        Les modifications sont sauvegard&eacute;es dans la base de donn&eacute;es
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allProducts.map((p) => (
          <div
            key={p.id}
            className="group relative rounded-2xl bg-white p-4 shadow-soft transition-shadow hover:shadow-card"
          >
            {/* Color accent bar */}
            <div
              className="mb-3 h-2 w-12 rounded-full"
              style={{ background: p.color }}
            />
            <h3 className="text-sm font-semibold text-text mb-0.5">{p.name_fr}</h3>
            <p className="text-[10px] text-text-muted capitalize mb-2">{p.category}</p>
            <p className="text-lg font-bold text-pink">{p.price} DH</p>

            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stockColor(p.stock)}`}>
                {p.stock === 0 ? "RUPTURE" : `Stock: ${p.stock}`}
              </span>
              {p.is_trending && (
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
                  Trending
                </span>
              )}
              {p.is_best_seller && (
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs text-pink-700">
                  Best-seller
                </span>
              )}
            </div>

            <button
              onClick={() => openEdit(p)}
              className="mt-3 w-full rounded-lg border border-border py-2 text-xs font-medium text-text-light transition-colors hover:border-pink hover:text-pink cursor-pointer"
            >
              Modifier
            </button>
          </div>
        ))}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setEditingProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <h3 className="mb-4 text-lg font-bold font-[family-name:var(--font-display)] text-text">
                Modifier : {editingProduct.name_fr}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-text-light">
                    Prix (DH)
                  </label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-pink"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-text-light">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={editForm.stock}
                    onChange={(e) =>
                      setEditForm({ ...editForm, stock: Number(e.target.value) })
                    }
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-pink"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.is_trending}
                      onChange={(e) =>
                        setEditForm({ ...editForm, is_trending: e.target.checked })
                      }
                      className="h-4 w-4 rounded accent-pink cursor-pointer"
                    />
                    Trending
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.is_best_seller}
                      onChange={(e) =>
                        setEditForm({ ...editForm, is_best_seller: e.target.checked })
                      }
                      className="h-4 w-4 rounded accent-pink cursor-pointer"
                    />
                    Best-seller
                  </label>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-text-light transition-colors hover:bg-gray-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 rounded-xl bg-pink py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-dark cursor-pointer"
                >
                  Sauvegarder
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast("")} />}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/*  PARAMETRES TAB                                                     */
/* ================================================================== */

function ParametresTab() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    settingsService.get().then(setSettings);
  }, []);

  if (!settings) return null;

  async function handleSave() {
    if (!settings) return;
    await settingsService.update(settings);
    setToast("Parametres sauvegardes");
  }

  return (
    <div className="space-y-6">
      {/* Settings form */}
      <div className="rounded-2xl bg-white p-5 shadow-soft space-y-4">
        <h3 className="text-base font-bold font-[family-name:var(--font-display)] text-text">
          Param&egrave;tres g&eacute;n&eacute;raux
        </h3>

        <div>
          <label className="mb-1 block text-xs font-medium text-text-light">
            Num&eacute;ro WhatsApp
          </label>
          <input
            type="text"
            value={settings.whatsappNumber}
            onChange={(e) =>
              setSettings({ ...settings, whatsappNumber: e.target.value })
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-pink"
            placeholder="212600000000"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text-light">
            Seuil livraison gratuite (DH)
          </label>
          <input
            type="number"
            value={settings.freeShippingThreshold}
            onChange={(e) =>
              setSettings({
                ...settings,
                freeShippingThreshold: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-pink"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-text-light">
            Texte banni&egrave;re promo
          </label>
          <input
            type="text"
            value={settings.promoBannerText}
            onChange={(e) =>
              setSettings({ ...settings, promoBannerText: e.target.value })
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-pink"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm text-text">
            Banni&egrave;re promo activ&eacute;e
          </label>
          <button
            onClick={() =>
              setSettings({
                ...settings,
                promoBannerEnabled: !settings.promoBannerEnabled,
              })
            }
            className={`relative h-7 w-12 rounded-full transition-colors cursor-pointer ${
              settings.promoBannerEnabled ? "bg-pink" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                settings.promoBannerEnabled
                  ? "translate-x-[22px]"
                  : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleSave}
          className="w-full rounded-xl bg-pink py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pink-dark active:scale-[0.98] cursor-pointer"
        >
          Sauvegarder
        </button>
      </div>

      {/* Delivery prices table */}
      <div className="rounded-2xl bg-white p-5 shadow-soft">
        <h3 className="mb-4 text-base font-bold font-[family-name:var(--font-display)] text-text">
          Tarifs de livraison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Ville
                </th>
                <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Prix
                </th>
                <th className="pb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                  D&eacute;lai
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveryPrices.map((d) => (
                <tr
                  key={d.city}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-2.5 pr-4 text-text">{d.city}</td>
                  <td className="py-2.5 pr-4 font-medium text-text">
                    {d.price === 0 ? (
                      <span className="text-green-600">Gratuit</span>
                    ) : (
                      `${d.price} DH`
                    )}
                  </td>
                  <td className="py-2.5 text-text-light">{d.delay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast("")} />}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/*  AVIS TAB                                                           */
/* ================================================================== */

function AvisTab() {
  const [revs, setRevs] = useState<AdminReview[]>([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setRevs(loadReviews());
  }, []);

  const productName = useCallback((pid: string) => {
    const p = staticProducts.find((pr) => pr.id === pid);
    return p ? p.name_fr : pid;
  }, []);

  function toggleVisibility(id: string) {
    const updated = revs.map((r) =>
      r.id === id ? { ...r, visible: !r.visible } : r
    );
    setRevs(updated);
    saveReviews(updated);
    setToast("Visibilite mise a jour");
  }

  const visibleCount = revs.filter((r) => r.visible).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-light">
          {revs.length} avis au total &middot; {visibleCount} visibles
        </p>
        <div className="flex gap-2">
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            {visibleCount} visibles
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-text-muted">
            {revs.length - visibleCount} masqu&eacute;s
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {revs.map((rev) => (
          <div
            key={rev.id}
            className={`rounded-2xl bg-white p-4 shadow-soft transition-opacity ${
              !rev.visible ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-text">
                    {rev.name}
                  </span>
                  <span className="text-xs text-text-muted">{rev.city}</span>
                  {rev.verified && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                      V&eacute;rifi&eacute;
                    </span>
                  )}
                </div>

                {/* Stars */}
                <div className="mb-1.5 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < rev.rating ? "text-amber-400" : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-sm text-text-light leading-relaxed">
                  {rev.text}
                </p>
                <p className="mt-1.5 text-xs text-text-muted">
                  Produit : {productName(rev.product)}
                </p>
              </div>

              <button
                onClick={() => toggleVisibility(rev.id)}
                className={`shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  rev.visible
                    ? "border-border text-text-light hover:border-red-300 hover:text-red-500"
                    : "border-green-300 text-green-600 hover:bg-green-50"
                }`}
              >
                {rev.visible ? "Masquer" : "Afficher"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {toast && <Toast message={toast} onDone={() => setToast("")} />}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/*  TAB CONFIG                                                         */
/* ================================================================== */

const tabConfig: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "commandes",
    label: "Commandes",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    id: "produits",
    label: "Produits",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    id: "parametres",
    label: "Parametres",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "avis",
    label: "Avis",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
];

/* ================================================================== */
/*  MAIN ADMIN PAGE                                                    */
/* ================================================================== */

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("commandes");

  // Counters for tab badges
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  /* Check session auth on mount */
  useEffect(() => {
    const isAuth = authService.isAuthenticated();
    if (isAuth) setAuthed(true);
    setHydrated(true);
  }, []);

  /* Session check every 60 seconds */
  useEffect(() => {
    if (!authed) return;

    const interval = setInterval(() => {
      if (!authService.isAuthenticated()) {
        setAuthed(false);
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, [authed]);

  /* Refresh session on interaction */
  useEffect(() => {
    if (!authed) return;

    function refresh() {
      authService.refreshSession();
    }

    window.addEventListener("click", refresh);
    window.addEventListener("keydown", refresh);
    window.addEventListener("scroll", refresh);
    window.addEventListener("touchstart", refresh);

    return () => {
      window.removeEventListener("click", refresh);
      window.removeEventListener("keydown", refresh);
      window.removeEventListener("scroll", refresh);
      window.removeEventListener("touchstart", refresh);
    };
  }, [authed]);

  /* Load tab badge counters */
  useEffect(() => {
    if (!authed || !hydrated) return;

    orderService.getAll().then((orders) => {
      setNewOrderCount(orders.filter((o) => o.status === "new").length);
    });
    productService.getAllProducts().then((prods) => {
      setLowStockCount(prods.filter((p) => p.stock <= 5).length);
    });
  }, [authed, hydrated, activeTab]);

  function handleLogout() {
    authService.logout();
    setAuthed(false);
  }

  /* Loading state */
  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8FB]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink border-t-transparent" />
      </div>
    );
  }

  /* Auth gate */
  if (!authed) {
    return <LoginScreen onAuth={() => setAuthed(true)} />;
  }

  const currentTabLabel = tabConfig.find((t) => t.id === activeTab)?.label || "";

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Admin header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/brand/logos/icon-mark.svg" alt="ASRAR LALLA" className="w-8 h-8" />
            <div>
              <h1 className="text-sm font-bold font-[family-name:var(--font-display)] text-text">
                ASRAR LALLA &mdash; Administration
              </h1>
              <p className="text-[10px] text-text-muted">{currentTabLabel}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-text-light transition-colors hover:border-red-300 hover:text-red-500 cursor-pointer"
          >
            D&eacute;connexion
          </button>
        </div>
      </header>

      {/* Tab navigation */}
      <div className="fixed top-[57px] left-0 right-0 z-30 border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="hide-scrollbar -mb-px flex gap-1 overflow-x-auto">
            {tabConfig.map((tab) => {
              const badge =
                tab.id === "commandes" && newOrderCount > 0
                  ? newOrderCount
                  : tab.id === "produits" && lowStockCount > 0
                  ? lowStockCount
                  : null;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "text-pink"
                      : "text-text-muted hover:text-text-light"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {badge !== null && (
                    <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-pink px-1 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="admin-tab-underline"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-pink"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <main className="mx-auto max-w-7xl px-4 pt-[114px] pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "commandes" && <CommandesTab />}
            {activeTab === "produits" && <ProduitsTab />}
            {activeTab === "parametres" && <ParametresTab />}
            {activeTab === "avis" && <AvisTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
