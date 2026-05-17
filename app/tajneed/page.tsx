import sql from "@/lib/db";
import Link from "next/link";
import { MessageSquare, ChevronLeft, Search, HelpCircle } from "lucide-react";

export const metadata = {
  title: "أسئلة شائعة عن التجنيد في مصر | كوماندو",
  description: "دليل الأسئلة الشائعة عن التجنيد في مصر. معلومات عن شروط الخدمة العسكرية، التأجيل، الإعفاء، والأوراق المطلوبة للتجنيد.",
  keywords: ["التجنيد في مصر", "شروط الخدمة العسكرية", "تأجيل التجنيد", "إعفاء التجنيد"],
  alternates: { canonical: "/tajneed" }
};

export default async function CategoryPage() {
  const questions = await sql`
    SELECT q.*, (
      SELECT CASE
        WHEN a.content_items IS NOT NULL AND jsonb_array_length(a.content_items) > 0
        THEN (a.content_items->0->>'text')
        ELSE a.content
      END
      FROM answers a WHERE a.question_id = q.id ORDER BY is_short DESC, created_at ASC LIMIT 1
    ) as snippet
    FROM questions q
    WHERE slug IS NOT NULL
    ORDER BY created_at ASC
  `;

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-16 max-w-5xl">
      <nav aria-label="Breadcrumb" className="mb-6 md:mb-10">
        <ol className="flex items-center space-x-2 space-x-reverse text-body-sm md:text-body-md text-on-surface-variant">
          <li>
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              الرئيسية
            </Link>
          </li>
          <li><ChevronLeft size={16} className="opacity-50" aria-hidden="true" /></li>
          <li className="text-on-surface font-medium" aria-current="page">
            دليل التجنيد
          </li>
        </ol>
      </nav>

      <header className="mb-12 md:mb-16 text-center bg-gradient-to-br from-primary/10 via-surface-container-low to-transparent rounded-3xl p-8 md:p-12 border border-primary/10 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="inline-flex justify-center items-center bg-surface-container p-4 rounded-full mb-6 text-primary shadow-sm">
          <HelpCircle size={32} strokeWidth={2} aria-hidden="true" />
        </div>
        <h1 className="text-display-md lg:text-display-lg text-primary font-bold mb-4">
          أسئلة وأجوبة عن التجنيد في مصر
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          تصفح أهم الأسئلة الشائعة التي تهم كل من يبدأ أو يؤدي خدمته العسكرية للحصول على إجابات واضحة وموثوقة، مباشرة من خبراء ومجتمع كوماندو.
        </p>
      </header>

      <div className="grid gap-4 md:gap-6" id="game3-el-as2ela">
        {questions.map((q: any, idx: number) => (
          <Link
            href={`/tajneed/${q.slug}`}
            key={q.id}
            className="block group"
            style={{ animationDelay: `${Math.min(idx * 50, 500)}ms` }}
          >
            <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 flex flex-col md:flex-row gap-4 items-start md:items-center animate-in fade-in slide-in-from-bottom-4 fill-mode-both">
              <div className="flex-1 min-w-0">
                <h2 className="text-title-md md:text-title-lg text-on-surface font-bold mb-2 group-hover:text-primary transition-colors leading-tight">
                  {q.title}
                </h2>
                {q.snippet && (
                  <p className="text-body-md text-on-surface-variant line-clamp-2 leading-relaxed">
                    {q.snippet}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 duration-300 hidden md:flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full font-medium">
                إجابة
                <ChevronLeft size={18} aria-hidden="true" />
              </div>
            </article>
          </Link>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-outline-variant/30" role="status">
          <Search size={48} className="mx-auto text-outline-variant mb-4" aria-hidden="true" />
          <p className="text-title-lg text-on-surface-variant">لا توجد أسئلة متاحة حالياً.</p>
        </div>
      )}
    </div>
  );
}
