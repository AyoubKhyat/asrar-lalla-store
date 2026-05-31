import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ paddingTop: "var(--total-header)" }}>
      <div className="text-center max-w-md">
        <span className="text-7xl block mb-6">🌸</span>
        <h1 className="text-3xl font-bold text-text font-[family-name:var(--font-display)] mb-3">
          Page introuvable
        </h1>
        <p className="text-text-muted text-sm mb-8">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-full gradient-pink text-white font-bold text-sm shadow-glow"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 rounded-full border-2 border-pink-soft text-pink font-bold text-sm"
          >
            Voir les produits
          </Link>
        </div>
      </div>
    </div>
  );
}
