"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ paddingTop: "var(--total-header)" }}>
      <div className="text-center max-w-md">
        <span className="text-7xl block mb-6">😔</span>
        <h1 className="text-2xl font-bold text-text font-[family-name:var(--font-display)] mb-3">
          Quelque chose s&apos;est mal passé
        </h1>
        <p className="text-text-muted text-sm mb-8">
          Une erreur est survenue. Veuillez réessayer.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-full gradient-pink text-white font-bold text-sm shadow-glow cursor-pointer"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
