export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "212600000000";

export const deliveryPrices: { city: string; price: number; delay: string }[] = [
  { city: "Casablanca", price: 0, delay: "24h" },
  { city: "Rabat", price: 0, delay: "24h" },
  { city: "Marrakech", price: 0, delay: "24-48h" },
  { city: "Fès", price: 10, delay: "48h" },
  { city: "Tanger", price: 10, delay: "48h" },
  { city: "Agadir", price: 10, delay: "48-72h" },
  { city: "Meknès", price: 10, delay: "48h" },
  { city: "Oujda", price: 15, delay: "72h" },
  { city: "Tétouan", price: 10, delay: "48-72h" },
  { city: "Kénitra", price: 0, delay: "24-48h" },
  { city: "Autres villes", price: 15, delay: "48-72h" },
];

export const FREE_SHIPPING_THRESHOLD = 99;

export const promoBannerText = "🚚 Livraison offerte à partir de 99 DH · Paiement à la livraison 💵";

export interface Pack {
  id: string;
  name: string;
  emoji: string;
  description: string;
  productIds: string[];
  discount: number;
  badge?: string;
  color: string;
  gradient: [string, string];
}

export const packs: Pack[] = [
  {
    id: "debutante",
    name: "Pack Débutante",
    emoji: "🌸",
    description: "L'essentiel pour commencer votre routine beauté marocaine. Parfait pour découvrir nos incontournables.",
    productIds: ["savon-beldi", "rose-water", "lip-balm"],
    discount: 10,
    badge: "POPULAIRE",
    color: "#FFCFE1",
    gradient: ["#FFCFE1", "#FFB5D0"],
  },
  {
    id: "glow-visage",
    name: "Pack Glow Visage",
    emoji: "✨",
    description: "La routine complète pour un teint éclatant et une peau glass skin. Les best-sellers visage réunis.",
    productIds: ["tbrima", "rose-water", "rose-cream", "peel-mask"],
    discount: 15,
    badge: "BEST SELLER",
    color: "#FECDD3",
    gradient: ["#FECDD3", "#FDA4AF"],
  },
  {
    id: "cheveux",
    name: "Pack Cheveux de Rêve",
    emoji: "💆‍♀️",
    description: "Tout pour des cheveux brillants, forts et soyeux. La routine capillaire complète.",
    productIds: ["shampoo", "hair-herbs", "hair-cream", "beauty-oil"],
    discount: 15,
    color: "#E8DEFF",
    gradient: ["#E8DEFF", "#D4C5FF"],
  },
  {
    id: "mariee",
    name: "Pack Mariée",
    emoji: "👰",
    description: "Préparez votre peau pour le plus beau jour. Le coffret complet pour briller comme une princesse.",
    productIds: ["tbrima", "savon-beldi", "gommage", "rose-water", "rose-cream", "blush", "kohl", "lip-balm"],
    discount: 20,
    badge: "EXCLUSIF",
    color: "#FDE68A",
    gradient: ["#FDE68A", "#FCD34D"],
  },
  {
    id: "budget",
    name: "Pack Moins de 50 DH",
    emoji: "💰",
    description: "Des produits premium à petit prix. Prouvez que la beauté n'a pas besoin d'être chère.",
    productIds: ["savon-beldi", "lip-balm", "kohl", "vaseline"],
    discount: 10,
    badge: "PETIT PRIX",
    color: "#D1FAE5",
    gradient: ["#D1FAE5", "#A7F3D0"],
  },
];

export const trustBadges = [
  { icon: "💵", title: "Paiement à la livraison", desc: "Payez uniquement quand vous recevez votre commande. Zéro risque." },
  { icon: "💬", title: "Confirmation WhatsApp", desc: "Chaque commande est confirmée par WhatsApp avec suivi personnalisé." },
  { icon: "🚚", title: "Livraison partout au Maroc", desc: "De Tanger à Agadir, nous livrons dans toutes les villes du Royaume." },
  { icon: "🧕", title: "Service client humain", desc: "Une vraie personne vous répond sur WhatsApp, pas un robot." },
  { icon: "🔄", title: "Satisfait ou remplacé", desc: "Produit endommagé ? On vous le remplace gratuitement, sans questions." },
];

export const tiktokVideos = [
  { id: "1", username: "@beautybynour", caption: "POV: tu découvres le savon beldi marocain 🫧✨", views: "2.3M", product: "savon-beldi", color: "#B8E6C8" },
  { id: "2", username: "@glowwithyasmine", caption: "Glass skin avec UN SEUL produit?! 🧴", views: "1.8M", product: "rose-cream", color: "#FBCFE8" },
  { id: "3", username: "@skincaremaroc", caption: "Le khôl qui a cassé TikTok 👁️", views: "3.1M", product: "kohl", color: "#9CA3AF" },
  { id: "4", username: "@labeautebeldi", caption: "L'eau de rose qui change TOUT 🌹", views: "950K", product: "rose-water", color: "#FECDD3" },
  { id: "5", username: "@moroccanbeauty", caption: "Ce blush naturel wallah 🩷", views: "1.5M", product: "blush", color: "#FDA4AF" },
  { id: "6", username: "@astuces.beaute", caption: "Routine hammam à la maison 🧖‍♀️", views: "2.7M", product: "gommage", color: "#FDBA74" },
];

export const instagramReviews = [
  { username: "@fatima.beauty", text: "J'ai commandé lundi, reçu mercredi. Top qualité wallah 😍", likes: 234, product: "Rose Water Mist" },
  { username: "@nour_skincare", text: "Le gommage + savon beldi = peau de bébé. Je recommande à 1000% 🫧", likes: 456, product: "Gommage Éclat" },
  { username: "@sara.glow", text: "Meilleur blush que j'ai jamais essayé. La couleur est PARFAITE 🩷", likes: 312, product: "Cloud Blush Tint" },
  { username: "@beauty.maroc", text: "3ème commande déjà. Addictive cette marque 💕", likes: 189, product: "Beauty Box" },
  { username: "@leila.casa", text: "Le khôl beldi authentique, enfin ! Mes yeux n'ont jamais été aussi beaux 👁️✨", likes: 567, product: "Khôl Traditionnel" },
  { username: "@amina.rabat", text: "L'huile de beauté a sauvé ma peau cet hiver. Merci ASRAR LALLA 🌸", likes: 298, product: "Huile de Beauté" },
];
