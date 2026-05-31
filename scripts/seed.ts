/**
 * Seed PostgreSQL with products, reviews, and delivery prices.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires DATABASE_URL in .env.local
 */

import postgresLib from "postgres";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env.local") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Missing DATABASE_URL in .env.local");
  process.exit(1);
}

const sql = postgresLib(connectionString, { ssl: "prefer" });

const products = [
  { id: "tbrima", name_fr: "Tbrima Glow Mask", name_ar: "تبريمة", slug: "tbrima-glow-mask", category: "visage", price: 13, old_price: 18, tagline: "Your instant glow moment", description: "Un masque traditionnel luxueux, fabriqué à la main avec des recettes ancestrales transmises de génération en génération.", benefits: ["Éclat instantané","Nutrition profonde","Teint lumineux","Peau douce comme la soie"], ingredients: ["Extrait de Rose","Safran","Huile d'Amande Douce","Miel Naturel"], how_to_use: "Appliquez une couche uniforme sur le visage propre. Laissez poser 10-15 minutes. Rincez à l'eau tiède.", stock: 150, is_trending: true, is_best_seller: true, badge: "POPULAIRE", color: "#FFB5C2", gradient: ["#FFB5C2","#FF8FAB"], packaging: "jar" },
  { id: "savon-beldi", name_fr: "Savon Beldi Naturel", name_ar: "صابون بلدي", slug: "savon-beldi-naturel", category: "corps", price: 5, old_price: null, tagline: "Nettoyage profond, zéro irritation", description: "Le savon noir iconique du Maroc, enrichi en huile d'olive.", benefits: ["Nettoyage en profondeur","Peau soyeuse","Détox naturelle","Prépare la peau au gommage"], ingredients: ["Huile d'Olive Pure","Eucalyptus","Potasse Naturelle"], how_to_use: "Appliquez sur peau humide. Massez en mouvements circulaires. Laissez poser 5 minutes puis rincez.", stock: 300, is_trending: true, is_best_seller: true, badge: "ESSENTIEL", color: "#B8E6C8", gradient: ["#C8EDD5","#A3D9B5"], packaging: "pot" },
  { id: "shampoo", name_fr: "Shampooing aux Herbes", name_ar: "شامبوان", slug: "shampooing-herbes", category: "cheveux", price: 15, old_price: null, tagline: "Des cheveux dignes d'une star", description: "Un shampooing botanique marocain qui transforme les cheveux ternes en perfection brillante.", benefits: ["Brillance extrême","Volume boosté","Santé du cuir chevelu","Cheveux plus forts"], ingredients: ["Huile d'Argan","Romarin","Lavande","Huile de Ricin"], how_to_use: "Mouillez les cheveux. Appliquez et massez le cuir chevelu. Laissez poser 2-3 minutes. Rincez.", stock: 200, is_trending: false, is_best_seller: false, badge: null, color: "#C4B5FD", gradient: ["#D4C5FF","#B5A3F0"], packaging: "bottle" },
  { id: "rose-water", name_fr: "Eau de Rose Distillée", name_ar: "ماء الورد المقطر", slug: "eau-de-rose-distillee", category: "visage", price: 15, old_price: 22, tagline: "Fraîcheur et éclat toute la journée", description: "Eau de rose pure distillée de la Vallée des Roses de Kelaat M'Gouna.", benefits: ["Hydratation instantanée","Pores resserrés","Éclat naturel","Apaise la peau"], ingredients: ["Distillat de Rose de Damas"], how_to_use: "Vaporisez directement sur le visage à 20cm de distance.", stock: 250, is_trending: true, is_best_seller: true, badge: "INCONTOURNABLE", color: "#FECDD3", gradient: ["#FFD5DB","#FBB5C0"], packaging: "spray" },
  { id: "heart-soap", name_fr: "Savon Cœur", name_ar: "صابون القلب الكبير", slug: "savon-coeur", category: "corps", price: 10, old_price: null, tagline: "Un soin que vous pouvez offrir", description: "Un savon en forme de cœur presque trop joli pour être utilisé.", benefits: ["Ultra hydratant","Formule douce","Parfum envoûtant","Idée cadeau parfaite"], ingredients: ["Beurre de Karité","Pétales de Rose","Glycérine Végétale"], how_to_use: "Faites mousser entre les mains avec de l'eau tiède. Appliquez sur tout le corps. Rincez.", stock: 180, is_trending: false, is_best_seller: false, badge: null, color: "#FCA5A5", gradient: ["#FDBBBB","#F89898"], packaging: "bar" },
  { id: "rose-cream", name_fr: "Crème de Rose Grand Format", name_ar: "كريم الورد الكبير", slug: "creme-de-rose", category: "visage", price: 13, old_price: 19, tagline: "L'effet glass skin en un pot", description: "Une crème hydratante somptueuse infusée à la rose.", benefits: ["Effet glass skin","Hydratation 24h","Anti-âge","Teint unifié"], ingredients: ["Extrait de Rose","Vitamine E","Acide Hyaluronique","Huile d'Argan"], how_to_use: "Appliquez matin et soir sur un visage propre et tonifié.", stock: 120, is_trending: true, is_best_seller: true, badge: "POPULAIRE", color: "#FBCFE8", gradient: ["#FDDAEE","#F9B5D8"], packaging: "jar" },
  { id: "lip-balm", name_fr: "Baume à Lèvres Glowy", name_ar: "مرطب الشفاه", slug: "baume-levres-glowy", category: "lèvres", price: 5, old_price: null, tagline: "Des lèvres juteuses sans effort", description: "L'huile d'argan rencontre la cire d'abeille dans le baume à lèvres le plus addictif.", benefits: ["Repulpant instantané","Hydratation longue durée","Teinte naturelle","Protection SPF"], ingredients: ["Huile d'Argan","Cire d'Abeille","Vitamine E","Beurre de Cacao"], how_to_use: "Appliquez directement sur les lèvres. Réappliquez autant que nécessaire.", stock: 400, is_trending: true, is_best_seller: false, badge: "FAN FAVE", color: "#FDE68A", gradient: ["#FEEDA6","#FCD34D"], packaging: "stick" },
  { id: "hair-herbs", name_fr: "Masque aux Herbes Capillaires", name_ar: "أعشاب الشعر", slug: "masque-herbes-capillaires", category: "cheveux", price: 15, old_price: null, tagline: "Résultats salon à la maison", description: "Un mélange puissant d'herbes marocaines qui renforce et répare.", benefits: ["Réparation des dommages","Renforcement","Brillance incroyable","Anti-chute"], ingredients: ["Henné Neutre","Romarin","Thym","Huile de Nigelle"], how_to_use: "Mélangez avec de l'eau tiède. Appliquez sur cheveux mouillés. Laissez 30-45 min. Rincez.", stock: 160, is_trending: false, is_best_seller: false, badge: null, color: "#A7F3D0", gradient: ["#B8F5DA","#86EDBE"], packaging: "pot" },
  { id: "gommage", name_fr: "Gommage Éclat", name_ar: "كوماج", slug: "gommage-eclat", category: "corps", price: 10, old_price: null, tagline: "Exfoliez, révélez, brillez", description: "Un gommage exfoliant doux qui révèle une peau douce comme celle d'un bébé.", benefits: ["Peau de bébé","Teint unifié","Éclat lumineux","Stimule le renouvellement"], ingredients: ["Poudre de Coquille de Noix","Huile d'Argan","Eucalyptus"], how_to_use: "Après le savon beldi, appliquez sur peau humide. Frottez en mouvements circulaires. Rincez.", stock: 220, is_trending: false, is_best_seller: false, badge: null, color: "#FDBA74", gradient: ["#FDC98F","#FAA85B"], packaging: "pot" },
  { id: "beauty-oil", name_fr: "Huile de Beauté Naturelle", name_ar: "زيت التجميل", slug: "huile-beaute-naturelle", category: "corps", price: 10, old_price: 15, tagline: "L'or liquide pour votre peau", description: "Une huile précieuse multi-usage mélangeant argan + amande douce.", benefits: ["Multi-usage","Nutrition profonde","Éclat naturel","Anti-vergetures"], ingredients: ["Huile d'Argan","Huile d'Amande Douce","Vitamine E"], how_to_use: "Appliquez quelques gouttes sur la peau humide après la douche.", stock: 190, is_trending: true, is_best_seller: false, badge: "MULTI-USAGE", color: "#FDE68A", gradient: ["#FEEDA6","#F5C842"], packaging: "dropper" },
  { id: "vaseline", name_fr: "Baume Protecteur", name_ar: "فازلين", slug: "baume-protecteur", category: "corps", price: 6, old_price: null, tagline: "Le garde du corps de votre peau", description: "Un baume protecteur infusé aux plantes marocaines.", benefits: ["Barrière protectrice","Verrouillage hydratation","Cicatrisant","Multi-zone"], ingredients: ["Vaseline Pure","Vitamine E","Lavande","Calendula"], how_to_use: "Appliquez sur les zones sèches : lèvres, coudes, talons, mains.", stock: 280, is_trending: false, is_best_seller: false, badge: null, color: "#E0E7FF", gradient: ["#EBF0FF","#CDD5FE"], packaging: "pot" },
  { id: "beauty-milk", name_fr: "Lait de Beauté Velouté", name_ar: "حليب التجميل", slug: "lait-beaute-veloute", category: "corps", price: 15, old_price: null, tagline: "Hydratez comme vous le pensez", description: "Un lait corporel velouté qui s'absorbe instantanément.", benefits: ["Absorption instantanée","Hydratation 48h","Fini soyeux","Parfum délicat"], ingredients: ["Lait de Chèvre","Rose","Huile d'Argan","Aloe Vera"], how_to_use: "Appliquez généreusement sur tout le corps après la douche.", stock: 170, is_trending: false, is_best_seller: false, badge: null, color: "#FECDD3", gradient: ["#FFD9DE","#FBB8C2"], packaging: "bottle" },
  { id: "peel-mask", name_fr: "Masque Peel-Off Éclat", name_ar: "قناع مقشر", slug: "masque-peel-off-eclat", category: "visage", price: 10, old_price: null, tagline: "Pelez le terne, bonjour l'éclat", description: "Un masque peel-off satisfaisant qui soulève les impuretés.", benefits: ["Purifiant profond","Pores affinés","Éclat lumineux","Satisfaisant à retirer"], ingredients: ["Argile Kaolin","Extrait de Citron","Miel Brut","Charbon Actif"], how_to_use: "Appliquez une couche épaisse. Laissez sécher 15-20 minutes. Pelez du bas vers le haut.", stock: 140, is_trending: false, is_best_seller: false, badge: null, color: "#FDE68A", gradient: ["#FEEDA6","#FCD34D"], packaging: "tube" },
  { id: "kohl", name_fr: "Khôl Traditionnel", name_ar: "كحل بلدي", slug: "khol-traditionnel", category: "yeux", price: 5, old_price: null, tagline: "Des yeux qui racontent des histoires", description: "Khôl marocain authentique fabriqué à partir de minéraux naturels.", benefits: ["Pigment intense","Anti-bavure","Nourrit les yeux","Regard captivant"], ingredients: ["Minéraux Naturels","Huile de Ricin","Pierre d'Alun"], how_to_use: "Appliquez le long de la ligne des cils avec l'applicateur en bois traditionnel.", stock: 350, is_trending: true, is_best_seller: true, badge: "CLASSIQUE", color: "#6B7280", gradient: ["#9CA3AF","#6B7280"], packaging: "stick" },
  { id: "hair-cream", name_fr: "Crème Capillaire Soyeuse", name_ar: "كريم الشعر", slug: "creme-capillaire-soyeuse", category: "cheveux", price: 15, old_price: null, tagline: "Les frisottis ? Jamais entendu parler", description: "Une crème coiffante légère qui dompte les frisottis.", benefits: ["Anti-frisottis","Protection thermique","Brillance miroir","Cheveux disciplinés"], ingredients: ["Huile d'Argan","Kératine","Protéine de Soie","Panthénol"], how_to_use: "Sur cheveux humides, répartissez sur les longueurs et pointes. Coiffez normalement.", stock: 180, is_trending: false, is_best_seller: false, badge: null, color: "#DDD6FE", gradient: ["#E8E0FF","#C9BCFE"], packaging: "tube" },
  { id: "blush", name_fr: "Blush Cloud Tint", name_ar: "مورّد الخدود", slug: "blush-cloud-tint", category: "visage", price: 20, old_price: 28, tagline: "L'effet bonne mine naturel", description: "Un tint pour les joues aérien qui fond dans la peau.", benefits: ["Couleur modulable","Fini dewy","Tenue toute la journée","Texture aérienne"], ingredients: ["Pigment de Rose","Mica","Huile de Jojoba","Squalane"], how_to_use: "Tapotez une petite quantité sur les pommettes. Estompez avec les doigts.", stock: 90, is_trending: true, is_best_seller: true, badge: "NOUVEAU", color: "#FDA4AF", gradient: ["#FEB5BE","#FB8A98"], packaging: "jar" },
];

const reviews = [
  { product_id: "rose-water", customer_name: "Yasmine B.", customer_city: "Casablanca", rating: 5, text: "Wallah, l'Eau de Rose a changé ma routine. En deux semaines, mes pores se sont resserrés et mon teint est devenu lumineux.", is_verified: true },
  { product_id: "blush", customer_name: "Nour El Houda", customer_city: "Rabat", rating: 5, text: "Le Cloud Blush est incroyable. Un tout petit peu suffit pour un effet bonne mine très naturel.", is_verified: true },
  { product_id: "savon-beldi", customer_name: "Amira K.", customer_city: "Marrakech", rating: 5, text: "J'ai essayé le Savon Beldi avec le gant de gommage un dimanche matin, comme au hammam. Ma peau est restée douce pendant 3 jours.", is_verified: true },
  { product_id: "rose-cream", customer_name: "Salma R.", customer_city: "Fès", rating: 5, text: "La Crème de Rose, c'est mon secret. Après un mois d'utilisation, les petites rides ont diminué et ma peau a cet éclat glass skin.", is_verified: true },
  { product_id: "lip-balm", customer_name: "Khadija M.", customer_city: "Tanger", rating: 4, text: "Le Baume à Lèvres est très hydratant, mes lèvres ne sont plus sèches même avec le vent de Tanger.", is_verified: true },
  { product_id: "kohl", customer_name: "Fatima Zahra", customer_city: "Marrakech", rating: 5, text: "Le Khôl Traditionnel, c'est celui que ma grand-mère utilisait. La tenue est excellente, pas de bavures.", is_verified: true },
  { product_id: "beauty-oil", customer_name: "Hajar", customer_city: "Agadir", rating: 5, text: "L'Huile de Beauté, je l'utilise partout : visage le soir, pointes de cheveux, cuticules. Rapport qualité-prix imbattable.", is_verified: true },
  { product_id: "gommage", customer_name: "Zineb", customer_city: "Casablanca", rating: 4, text: "Le Gommage Éclat est efficace sans agresser la peau. Je l'utilise après le savon beldi une fois par semaine.", is_verified: true },
  { product_id: "tbrima", customer_name: "Imane L.", customer_city: "Rabat", rating: 5, text: "On a testé la Tbrima un vendredi soir. Après 15 minutes, la différence était visible immédiatement. Teint frais, peau nourrie.", is_verified: true },
  { product_id: "hair-cream", customer_name: "Rania S.", customer_city: "Fès", rating: 5, text: "La Crème Capillaire a sauvé mes cheveux après des années de lissage. Moins de frisottis, plus de brillance.", is_verified: true },
];

async function seed() {
  console.log("Seeding products...");
  for (const p of products) {
    await sql`
      INSERT INTO products (id, name_fr, name_ar, slug, category, price, old_price, tagline, description, benefits, ingredients, how_to_use, stock, is_trending, is_best_seller, badge, color, gradient, packaging)
      VALUES (${p.id}, ${p.name_fr}, ${p.name_ar}, ${p.slug}, ${p.category}, ${p.price}, ${p.old_price}, ${p.tagline}, ${p.description}, ${p.benefits}, ${p.ingredients}, ${p.how_to_use}, ${p.stock}, ${p.is_trending}, ${p.is_best_seller}, ${p.badge}, ${p.color}, ${p.gradient}, ${p.packaging})
      ON CONFLICT (id) DO UPDATE SET
        name_fr = EXCLUDED.name_fr, price = EXCLUDED.price, old_price = EXCLUDED.old_price,
        stock = EXCLUDED.stock, is_trending = EXCLUDED.is_trending, is_best_seller = EXCLUDED.is_best_seller,
        badge = EXCLUDED.badge
    `;
  }
  console.log(`  ✓ ${products.length} products upserted`);

  console.log("Seeding reviews...");
  for (const r of reviews) {
    await sql`
      INSERT INTO reviews (product_id, customer_name, customer_city, rating, text, is_verified)
      VALUES (${r.product_id}, ${r.customer_name}, ${r.customer_city}, ${r.rating}, ${r.text}, ${r.is_verified})
    `;
  }
  console.log(`  ✓ ${reviews.length} reviews inserted`);

  console.log("\nDone! Your database is ready.");
  await sql.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
