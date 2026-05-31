export default function CartLoading() {
  return (
    <div className="min-h-screen bg-bg animate-pulse" style={{ paddingTop: "var(--total-header)" }}>
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-12">
        <div className="h-10 w-32 bg-border/50 rounded-2xl mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-soft p-4 flex gap-4">
              <div className="w-16 h-20 bg-border/30 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-border/40 rounded-full" />
                <div className="h-4 w-1/3 bg-border/30 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
