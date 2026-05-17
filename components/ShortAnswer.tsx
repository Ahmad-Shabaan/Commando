import { ScrollText } from "lucide-react";

export default function ShortAnswer({ content }: { content: string }) {
  return (
    <section className="mb-10">
      <div className="bg-surface-container border border-primary/20 rounded-xl p-6 md:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-1.5 h-full bg-primary" />
        <div className="flex items-center gap-2 mb-4">
          <ScrollText size={20} className="text-primary" aria-hidden="true" />
          <h2 className="text-title-md text-primary font-bold">إجابة سريعة:</h2>
        </div>
        <div className="text-body-lg text-on-surface leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </section>
  );
}
