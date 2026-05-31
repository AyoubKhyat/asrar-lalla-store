export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-bg animate-pulse" style={{ paddingTop: "var(--total-header)" }}>
      <div className="max-w-3xl mx-auto px-5 md:px-8 py-12">
        <div className="h-10 w-40 bg-border/50 rounded-2xl mb-8" />
        <div className="bg-white rounded-2xl shadow-soft p-6 space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-border/40 rounded-full" />
              <div className="h-12 w-full bg-border/30 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
