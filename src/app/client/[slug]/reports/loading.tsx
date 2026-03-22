export default function ClientReportsLoading() {
  return (
    <div className="space-y-4">
      <div className="h-32 animate-pulse rounded-2xl bg-white/[0.04]" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl bg-white/[0.04]" />
        ))}
      </div>
    </div>
  );
}
