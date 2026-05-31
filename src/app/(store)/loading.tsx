export default function Loading() {
  return (
    <div className="min-h-screen bg-bg animate-pulse" style={{ paddingTop: "var(--total-header)" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
        <div className="h-10 w-64 bg-border/50 rounded-2xl mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-soft p-4 space-y-3">
              <div className="aspect-square bg-border/30 rounded-xl" />
              <div className="h-4 w-3/4 bg-border/40 rounded-full" />
              <div className="h-4 w-1/2 bg-border/30 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
