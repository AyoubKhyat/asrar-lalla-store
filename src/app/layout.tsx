import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/ui/Analytics";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ASRAR LALLA — La Beauté Marocaine, Réinventée",
  description:
    "Produits de beauté naturels marocains. Ingrédients purs, résultats réels. Livraison partout au Maroc. Paiement à la livraison.",
  keywords: ["beauté marocaine", "skincare naturel", "huile d'argan", "eau de rose", "cosmétique naturel", "beauty maroc"],
  openGraph: {
    title: "ASRAR LALLA — La Beauté Marocaine, Réinventée",
    description:
      "Produits de beauté naturels marocains. Ingrédients purs, résultats réels. Livraison partout au Maroc. Paiement à la livraison.",
    type: "website",
    siteName: "ASRAR LALLA",
    locale: "fr_MA",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
  },
  authors: [{ name: "ASRAR LALLA" }],
  creator: "ASRAR LALLA",
  publisher: "ASRAR LALLA",
  metadataBase: new URL("https://asrarlalla.ma"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${outfit.variable} ${dmSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased font-[family-name:var(--font-body)]">
        <a href="#main-content" className="sr-only">Aller au contenu principal</a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
