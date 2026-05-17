export default function QuestionLoading() {
  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-16 max-w-4xl animate-pulse">
      <nav aria-label="Breadcrumb" className="mb-8">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-surface-container rounded" />
          <div className="h-4 w-4 bg-surface-container rounded" />
          <div className="h-4 w-20 bg-surface-container rounded" />
          <div className="h-4 w-4 bg-surface-container rounded" />
          <div className="h-4 w-40 bg-surface-container rounded" />
        </div>
      </nav>

      <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 md:p-10 shadow-sm">
        <header className="mb-8 border-b border-outline-variant/20 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-surface-container rounded-full shrink-0" />
            <div className="h-8 w-3/4 bg-surface-container rounded-lg" />
          </div>
        </header>

        <div className="space-y-4 mb-10">
          <div className="h-6 w-1/4 bg-surface-container rounded-lg" />
          <div className="h-24 bg-surface-container rounded-xl" />
        </div>

        <div className="space-y-4 mt-10">
          <div className="h-6 w-1/3 bg-surface-container rounded-lg" />
          <div className="h-32 bg-surface-container rounded-xl" />
          <div className="h-32 bg-surface-container rounded-xl" />
        </div>
      </article>
    </div>
  );
}
