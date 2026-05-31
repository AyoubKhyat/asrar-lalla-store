import type { Product } from "./products";

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

const AUTH_KEY = "asrar-admin-session";
const SESSION_TIMEOUT = 30 * 60 * 1000;

// ==================== Auth Service ====================

export const authService = {
  async login(email: string, password: string): Promise<boolean> {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        if (typeof window !== "undefined") {
          localStorage.setItem(AUTH_KEY, JSON.stringify({ authenticated: true, loginAt: Date.now() }));
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return false;
      const session = JSON.parse(raw);
      if (!session?.authenticated) return false;
      if (Date.now() - session.loginAt > SESSION_TIMEOUT) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },
  refreshSession() {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return;
      const session = JSON.parse(raw);
      if (session?.authenticated) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ ...session, loginAt: Date.now() }));
      }
    } catch {}
  },
  logout() {
    if (typeof window !== "undefined") localStorage.removeItem(AUTH_KEY);
  },
};

// ==================== Order Service ====================

export const orderService = {
  async getAll(status?: string): Promise<Order[]> {
    const params = status && status !== "all" ? `?status=${status}` : "";
    const res = await fetch(`/api/orders${params}`);
    if (!res.ok) return [];
    return res.json();
  },

  async getById(id: string): Promise<Order | undefined> {
    const orders = await this.getAll();
    return orders.find((o) => o.id === id);
  },

  async create(order: Omit<Order, "id" | "ref" | "createdAt" | "updatedAt" | "status">): Promise<Order> {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    return res.json();
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order | undefined> {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return undefined;
    return res.json();
  },

  async bulkUpdateStatus(ids: string[], status: OrderStatus): Promise<void> {
    await Promise.all(ids.map((id) => this.updateStatus(id, status)));
  },

  async delete(id: string): Promise<void> {
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
  },
};

// ==================== Inventory Service ====================

export const inventoryService = {
  async getStock(productId: string): Promise<number> {
    const res = await fetch("/api/products");
    if (!res.ok) return 0;
    const products: Product[] = await res.json();
    const p = products.find((p) => p.id === productId);
    return p?.stock ?? 0;
  },

  async setStock(productId: string, stock: number): Promise<void> {
    await fetch(`/api/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: Math.max(0, stock) }),
    });
  },

  async isInStock(productId: string): Promise<boolean> {
    return (await this.getStock(productId)) > 0;
  },

  async isLowStock(productId: string): Promise<boolean> {
    const stock = await this.getStock(productId);
    return stock <= 5 && stock > 0;
  },
};

// ==================== Product Service ====================

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    const res = await fetch("/api/products");
    if (!res.ok) return [];
    return res.json();
  },

  async getProduct(id: string): Promise<Product | undefined> {
    const products = await this.getAllProducts();
    return products.find((p) => p.id === id);
  },

  async update(id: string, updates: Partial<Product>): Promise<void> {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  },
};

// ==================== Settings Service ====================

export const settingsService = {
  async get(): Promise<SiteSettings> {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) return res.json();
    } catch {}
    return {
      whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "212600000000",
      freeShippingThreshold: 99,
      promoBannerText: "🚚 Livraison offerte à partir de 99 DH · Paiement à la livraison 💵",
      promoBannerEnabled: true,
    };
  },

  async update(settings: Partial<SiteSettings>): Promise<void> {
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
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
