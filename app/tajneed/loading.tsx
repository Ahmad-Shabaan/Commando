import { HelpCircle } from "lucide-react";

export default function TajneedLoading() {
  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 max-w-5xl">
      <nav aria-label="Breadcrumb" className="mb-6 md:mb-10">
        <ol className="flex items-center space-x-2 space-x-reverse text-body-sm md:text-body-md text-on-surface-variant">
          <li>الرئيسية</li>
          <li className="opacity-50 mx-2">/</li>
          <li className="text-on-surface font-medium">دليل التجنيد</li>
        </ol>
      </nav>

      <div className="mb-12 md:mb-16 text-center bg-gradient-to-br from-primary/10 via-surface-container-low to-transparent rounded-3xl p-8 md:p-12 border border-primary/10 shadow-sm animate-pulse">
        <div className="w-16 h-16 bg-surface-container rounded-full mx-auto mb-6" />
        <div className="h-10 w-3/4 bg-surface-container rounded-lg mx-auto mb-4" />
        <div className="h-6 w-2/3 bg-surface-container rounded-lg mx-auto" />
      </div>

      <div className="space-y-4 md:space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-4 items-start md:items-center animate-pulse"
          >
            <div className="w-12 h-12 bg-surface-container rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-6 w-3/4 bg-surface-container rounded-lg" />
              <div className="h-4 w-1/2 bg-surface-container rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
