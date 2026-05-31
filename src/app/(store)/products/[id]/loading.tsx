export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-bg animate-pulse" style={{ paddingTop: "var(--total-header)" }}>
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-border/30 rounded-3xl" />
          <div className="space-y-4 py-4">
            <div className="h-5 w-24 bg-border/40 rounded-full" />
            <div className="h-8 w-3/4 bg-border/50 rounded-2xl" />
            <div className="h-6 w-1/3 bg-border/40 rounded-full" />
            <div className="h-4 w-full bg-border/30 rounded-full" />
            <div className="h-4 w-5/6 bg-border/30 rounded-full" />
            <div className="h-12 w-full bg-border/40 rounded-2xl mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
