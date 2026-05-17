import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";

export default function QuestionNotFound() {
  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-16 max-w-4xl text-center">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-10 md:p-16 shadow-sm">
        <div className="inline-flex items-center justify-center bg-primary/10 w-20 h-20 rounded-full mb-6 text-primary">
          <Search size={40} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h1 className="text-display-md text-primary font-bold mb-4">
          السؤال غير موجود
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-8 max-w-md mx-auto leading-relaxed">
          عذراً، لم نتمكن من العثور على السؤال الذي تبحث عنه. ربما تم حذفه أو أن الرابط غير صحيح.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/tajneed"
            className="inline-flex items-center justify-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-label-lg hover:bg-primary/90 transition-all shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
          >
            <ArrowRight size={20} aria-hidden="true" />
            تصفح جميع الأسئلة
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-primary/30 text-primary px-8 py-4 rounded-full font-bold text-label-lg hover:bg-primary/5 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
          >
            العودة إلى الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
