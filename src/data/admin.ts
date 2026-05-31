import type { Product } from "./products";
import { products as staticProducts } from "./products";

// ==================== Types ====================

export type OrderStatus = "new" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  ref: string;
  customer: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    notes?: string;
  };
  items: { productId: string; name: string; price: number; quantity: number }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  productId: string;
  verified: boolean;
  visible: boolean;
  createdAt: string;
}

export interface SiteSettings {
  whatsappNumber: string;
  freeShippingThreshold: number;
  promoBannerText: string;
  promoBannerEnabled: boolean;
}

export interface AdminCredentials {
  email: string;
  password: string;
}

// ==================== Constants ====================

export const statusLabels: Record<OrderStatus, string> = {
  new: "Nouvelle",
  confirmed: "Confirmée",
  preparing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export const statusColors: Record<OrderStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-yellow-100 text-yellow-700",
  preparing: "bg-orange-100 text-orange-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export const statusEmoji: Record<OrderStatus, string> = {
  new: "🆕",
  confirmed: "✅",
  preparing: "📦",
  shipped: "🚚",
  delivered: "🎉",
  cancelled: "❌",
};

export const statusTimeline: OrderStatus[] = ["new", "confirmed", "preparing", "shipped", "delivered"];

export const ADMIN_EMAIL = "admin@asrarlalla.ma";
export const ADMIN_PASSWORD = "asrar2026";
const AUTH_KEY = "asrar-admin-session";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// ==================== Mock Data ====================

const MOCK_ORDERS: Order[] = [
  {
    id: "1", ref: "AL-2026-0001",
    customer: { fullName: "Fatima Zahra", phone: "+212661234567", city: "Casablanca", address: "Bd Mohammed V, Maârif" },
    items: [
      { productId: "rose-water", name: "Eau de Rose Distillée", price: 15, quantity: 2 },
      { productId: "blush", name: "Blush Cloud Tint", price: 20, quantity: 1 },
    ],
    total: 50, status: "new", createdAt: "2026-05-30T10:30:00Z", updatedAt: "2026-05-30T10:30:00Z",
  },
  {
    id: "2", ref: "AL-2026-0002",
    customer: { fullName: "Nour El Houda", phone: "+212662345678", city: "Rabat", address: "Hay Riad, Rue 12" },
    items: [
      { productId: "tbrima", name: "Tbrima Glow Mask", price: 13, quantity: 1 },
      { productId: "savon-beldi", name: "Savon Beldi Naturel", price: 5, quantity: 3 },
      { productId: "gommage", name: "Gommage Éclat", price: 10, quantity: 1 },
    ],
    total: 38, status: "confirmed", createdAt: "2026-05-29T14:15:00Z", updatedAt: "2026-05-29T15:00:00Z",
  },
  {
    id: "3", ref: "AL-2026-0003",
    customer: { fullName: "Amina Belhaj", phone: "+212663456789", city: "Marrakech", address: "Guéliz, Av Hassan II", notes: "Appeler avant livraison" },
    items: [
      { productId: "rose-cream", name: "Crème de Rose Grand Format", price: 13, quantity: 2 },
      { productId: "beauty-oil", name: "Huile de Beauté Naturelle", price: 10, quantity: 1 },
    ],
    total: 36, status: "shipped", createdAt: "2026-05-28T09:00:00Z", updatedAt: "2026-05-29T08:00:00Z",
  },
  {
    id: "4", ref: "AL-2026-0004",
    customer: { fullName: "Salma Bennani", phone: "+212664567890", city: "Fès", address: "Ville Nouvelle, Rue 8" },
    items: [{ productId: "kohl", name: "Khôl Traditionnel", price: 5, quantity: 2 }],
    total: 10, status: "delivered", createdAt: "2026-05-27T16:45:00Z", updatedAt: "2026-05-28T12:00:00Z",
  },
  {
    id: "5", ref: "AL-2026-0005",
    customer: { fullName: "Rania Chakir", phone: "+212665678901", city: "Tanger", address: "Av. des FAR, Apt 3" },
    items: [
      { productId: "lip-balm", name: "Baume à Lèvres Glowy", price: 5, quantity: 2 },
      { productId: "rose-water", name: "Eau de Rose Distillée", price: 15, quantity: 1 },
    ],
    total: 25, status: "preparing", createdAt: "2026-05-30T08:00:00Z", updatedAt: "2026-05-30T09:00:00Z",
  },
  {
    id: "6", ref: "AL-2026-0006",
    customer: { fullName: "Khadija Moussaoui", phone: "+212666789012", city: "Agadir", address: "Quartier Talborjt" },
    items: [
      { productId: "savon-beldi", name: "Savon Beldi Naturel", price: 5, quantity: 2 },
      { productId: "gommage", name: "Gommage Éclat", price: 10, quantity: 1 },
      { productId: "beauty-oil", name: "Huile de Beauté Naturelle", price: 10, quantity: 1 },
    ],
    total: 30, status: "new", createdAt: "2026-05-31T07:00:00Z", updatedAt: "2026-05-31T07:00:00Z",
  },
];

// ==================== Storage Helpers ====================

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save(key: string, data: unknown) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

// ==================== Auth Service ====================

export const authService = {
  login(email: string, password: string): boolean {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      save(AUTH_KEY, { authenticated: true, loginAt: Date.now() });
      return true;
    }
    return false;
  },
  isAuthenticated(): boolean {
    const session = load<{ authenticated: boolean; loginAt: number } | null>(AUTH_KEY, null);
    if (!session?.authenticated) return false;
    if (Date.now() - session.loginAt > SESSION_TIMEOUT) {
      this.logout();
      return false;
    }
    return true;
  },
  refreshSession() {
    const session = load<{ authenticated: boolean; loginAt: number } | null>(AUTH_KEY, null);
    if (session?.authenticated) {
      save(AUTH_KEY, { ...session, loginAt: Date.now() });
    }
  },
  logout() {
    if (typeof window !== "undefined") localStorage.removeItem(AUTH_KEY);
  },
};

// ==================== Order Service ====================

export const orderService = {
  getAll(): Order[] {
    return load("asrar-orders", MOCK_ORDERS);
  },
  getById(id: string): Order | undefined {
    return this.getAll().find((o) => o.id === id);
  },
  create(order: Omit<Order, "id" | "ref" | "createdAt" | "updatedAt" | "status">): Order {
    const orders = this.getAll();
    const maxNum = orders.reduce((max, o) => {
      const n = parseInt(o.ref.split("-").pop() || "0");
      return n > max ? n : max;
    }, 0);
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...order,
      id: String(Date.now()),
      ref: `AL-2026-${String(maxNum + 1).padStart(4, "0")}`,
      status: "new",
      createdAt: now,
      updatedAt: now,
    };
    orders.unshift(newOrder);
    save("asrar-orders", orders);
    return newOrder;
  },
  updateStatus(id: string, status: OrderStatus): Order | undefined {
    const orders = this.getAll();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) return undefined;
    orders[idx] = { ...orders[idx], status, updatedAt: new Date().toISOString() };
    save("asrar-orders", orders);

    if (status === "confirmed") {
      inventoryService.reduceStock(orders[idx].items);
    }
    return orders[idx];
  },
  bulkUpdateStatus(ids: string[], status: OrderStatus) {
    const orders = this.getAll();
    const now = new Date().toISOString();
    const updated: Order[] = [];
    ids.forEach((id) => {
      const idx = orders.findIndex((o) => o.id === id);
      if (idx !== -1) {
        if (status === "confirmed" && orders[idx].status === "new") {
          inventoryService.reduceStock(orders[idx].items);
        }
        orders[idx] = { ...orders[idx], status, updatedAt: now };
        updated.push(orders[idx]);
      }
    });
    save("asrar-orders", orders);
    return updated;
  },
  delete(id: string) {
    const orders = this.getAll().filter((o) => o.id !== id);
    save("asrar-orders", orders);
  },
};

// ==================== Inventory Service ====================

export const inventoryService = {
  getStockOverrides(): Record<string, number> {
    return load("asrar-stock-overrides", {});
  },
  getStock(productId: string): number {
    const overrides = this.getStockOverrides();
    if (productId in overrides) return overrides[productId];
    const p = staticProducts.find((p) => p.id === productId);
    return p?.stock ?? 0;
  },
  setStock(productId: string, stock: number) {
    const overrides = this.getStockOverrides();
    overrides[productId] = Math.max(0, stock);
    save("asrar-stock-overrides", overrides);
  },
  reduceStock(items: { productId: string; quantity: number }[]) {
    items.forEach((item) => {
      const current = this.getStock(item.productId);
      this.setStock(item.productId, current - item.quantity);
    });
  },
  isInStock(productId: string): boolean {
    return this.getStock(productId) > 0;
  },
  isLowStock(productId: string): boolean {
    return this.getStock(productId) <= 5 && this.getStock(productId) > 0;
  },
};

// ==================== Product Service ====================

export const productService = {
  getOverrides(): Record<string, Partial<Product>> {
    return load("asrar-products-overlay", {});
  },
  getProduct(id: string): Product | undefined {
    const base = staticProducts.find((p) => p.id === id);
    if (!base) return undefined;
    const overrides = this.getOverrides();
    const stock = inventoryService.getStock(id);
    return { ...base, ...overrides[id], stock };
  },
  getAllProducts(): Product[] {
    const overrides = this.getOverrides();
    return staticProducts.map((p) => ({
      ...p,
      ...overrides[p.id],
      stock: inventoryService.getStock(p.id),
    }));
  },
  update(id: string, updates: Partial<Product>) {
    const overrides = this.getOverrides();
    overrides[id] = { ...overrides[id], ...updates };
    if ("stock" in updates && updates.stock !== undefined) {
      inventoryService.setStock(id, updates.stock);
      delete overrides[id].stock;
    }
    save("asrar-products-overlay", overrides);
  },
};

// ==================== Settings Service ====================

export const settingsService = {
  get(): SiteSettings {
    return load("asrar-settings", {
      whatsappNumber: "212600000000",
      freeShippingThreshold: 99,
      promoBannerText: "🚚 Livraison offerte à partir de 99 DH · Paiement à la livraison 💵",
      promoBannerEnabled: true,
    });
  },
  update(settings: Partial<SiteSettings>) {
    const current = this.get();
    save("asrar-settings", { ...current, ...settings });
  },
};

// ==================== WhatsApp Messages ====================

export function whatsappLink(phone: string, text: string) {
  const clean = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(text)}`;
}

export function confirmationMessage(order: Order): string {
  let msg = `Salam 👋 ${order.customer.fullName} !\n\n`;
  msg += `Merci pour votre commande *${order.ref}* chez ASRAR LALLA 🌸\n\n`;
  msg += `📦 *Récapitulatif :*\n`;
  order.items.forEach((item) => {
    msg += `  • ${item.name} ×${item.quantity} — ${item.price * item.quantity} DH\n`;
  });
  msg += `\n💰 *Total : ${order.total} DH*\n`;
  msg += `💵 Paiement à la livraison\n\n`;
  msg += `📍 Livraison à : ${order.customer.city}\n`;
  msg += `⏰ Délai estimé : 24-72h\n\n`;
  msg += `Votre commande est *confirmée* ✅\nNous vous tiendrons informée de l'expédition inchallah !\n\n`;
  msg += `ASRAR LALLA 🌸`;
  return msg;
}

export function shippedMessage(order: Order): string {
  let msg = `Salam ${order.customer.fullName} ! 🚚\n\n`;
  msg += `Bonne nouvelle ! Votre commande *${order.ref}* a été *expédiée* aujourd'hui !\n\n`;
  msg += `📍 Destination : ${order.customer.city}\n`;
  msg += `📦 ${order.items.length} article${order.items.length > 1 ? "s" : ""}\n`;
  msg += `💰 Total : ${order.total} DH (paiement à la livraison)\n\n`;
  msg += `Le livreur vous contactera avant la livraison inchallah.\n`;
  if (order.customer.notes) msg += `📝 Note : ${order.customer.notes}\n`;
  msg += `\nMerci de votre confiance ! 🌸\nASRAR LALLA`;
  return msg;
}

export function followUpMessage(order: Order): string {
  let msg = `Salam ${order.customer.fullName} ! 🌸\n\n`;
  msg += `On espère que vous adorez vos produits ASRAR LALLA !\n\n`;
  msg += `Ça nous ferait très plaisir d'avoir votre avis 💕\n`;
  msg += `Comment trouvez-vous `;
  if (order.items.length === 1) {
    msg += `votre *${order.items[0].name}* ?`;
  } else {
    msg += `vos produits ?`;
  }
  msg += `\n\nVotre retour nous aide énormément et inspire d'autres femmes 🙏\n\n`;
  msg += `Merci et à très bientôt !\nASRAR LALLA 🌸`;
  return msg;
}

// ==================== CSV Export ====================

export function exportOrdersCSV(orders: Order[]): string {
  const header = "Référence;Nom;Téléphone;Ville;Adresse;Produits;Total;Statut;Date;Notes";
  const rows = orders.map((o) => {
    const prods = o.items.map((i) => `${i.name} x${i.quantity}`).join(", ");
    const date = new Date(o.createdAt).toLocaleDateString("fr-MA");
    const notes = o.customer.notes?.replace(/;/g, ",") || "";
    return [
      o.ref,
      o.customer.fullName,
      o.customer.phone,
      o.customer.city,
      `"${o.customer.address}"`,
      `"${prods}"`,
      `${o.total} DH`,
      statusLabels[o.status],
      date,
      `"${notes}"`,
    ].join(";");
  });
  return [header, ...rows].join("\n");
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ==================== Print Slip ====================

export function printOrderSlip(order: Order) {
  const itemsHtml = order.items
    .map((i) => `<tr><td style="padding:4px 8px">${i.name}</td><td style="padding:4px 8px;text-align:center">${i.quantity}</td><td style="padding:4px 8px;text-align:right">${i.price * i.quantity} DH</td></tr>`)
    .join("");

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Bon de livraison ${order.ref}</title>
<style>
  body{font-family:'Segoe UI',sans-serif;margin:0;padding:20px;color:#1a1a1a;max-width:500px;margin:auto}
  .header{text-align:center;border-bottom:2px solid #FF5FA2;padding-bottom:12px;margin-bottom:16px}
  .logo{font-size:22px;font-weight:800;color:#FF5FA2;letter-spacing:1px}
  .ref{font-size:13px;color:#666;margin-top:4px}
  .section{margin:12px 0}
  .label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#999;margin-bottom:4px}
  .value{font-size:14px;font-weight:500}
  table{width:100%;border-collapse:collapse;margin:8px 0}
  th{background:#FFF0F5;padding:6px 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:#FF5FA2;text-align:left}
  td{border-bottom:1px solid #f0f0f0;font-size:13px}
  .total{text-align:right;font-size:18px;font-weight:800;color:#FF5FA2;padding:12px 0;border-top:2px solid #FF5FA2}
  .payment{background:#FFF0F5;padding:8px 12px;border-radius:8px;text-align:center;font-size:12px;color:#FF5FA2;font-weight:600;margin:12px 0}
  .footer{text-align:center;font-size:10px;color:#999;margin-top:20px;padding-top:12px;border-top:1px solid #eee}
  @media print{body{padding:10px}@page{size:A5;margin:10mm}}
</style></head><body>
<div class="header"><div class="logo">✿ ASRAR LALLA</div><div class="ref">Bon de livraison — ${order.ref}</div><div style="font-size:11px;color:#999">${new Date(order.createdAt).toLocaleDateString("fr-MA",{day:"2-digit",month:"long",year:"numeric"})}</div></div>
<div class="section"><div class="label">Client</div><div class="value">${order.customer.fullName}</div><div style="font-size:12px;color:#666">${order.customer.phone}</div></div>
<div class="section"><div class="label">Adresse de livraison</div><div class="value">${order.customer.address}</div><div style="font-size:12px;color:#666">${order.customer.city}</div></div>
${order.customer.notes ? `<div class="section"><div class="label">Notes</div><div style="font-size:12px;color:#666">${order.customer.notes}</div></div>` : ""}
<div class="section"><div class="label">Produits</div><table><thead><tr><th>Produit</th><th style="text-align:center">Qté</th><th style="text-align:right">Prix</th></tr></thead><tbody>${itemsHtml}</tbody></table></div>
<div class="total">Total : ${order.total} DH</div>
<div class="payment">💵 PAIEMENT À LA LIVRAISON</div>
<div class="footer">ASRAR LALLA — La Beauté Marocaine, Réinventée<br>WhatsApp: +212 6 00 00 00 00 · Instagram: @asrarlalla</div>
</body></html>`;

  const win = window.open("", "_blank", "width=500,height=700");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.onload = () => win.print();
  }
}
