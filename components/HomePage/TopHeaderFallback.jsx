export default function TopHeaderFallback() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="text-4xl font-bold tracking-tight text-blue-500 shrink-0">
          <span className="text-blue-500">Re</span>
          <span className="text-gray-600">vend</span>
        </div>
        <div className="flex-1 max-w-3xl h-9 bg-amber-50/50 rounded-full border border-gray-200 animate-pulse" />
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse shrink-0" />
      </div>
    </header>
  );
}
