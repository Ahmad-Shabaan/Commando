import sql from "@/lib/db";
import Link from "next/link";

export default async function Footer() {
  const topQuestions = await sql`
    SELECT id, title, slug 
    FROM questions 
    WHERE slug IS NOT NULL
    ORDER BY created_at DESC 
    LIMIT 5
  `;

  const hasQuestions = topQuestions.length > 0;

  return (
    <footer
      className="container w-full mx-auto bg-surface-container-lowest dark:bg-surface-container-low border-t border-outline-variant/20 mt-auto"
    >
      <div className="w-full p-6 md:p-8 max-w-container-max mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-b border-outline-variant/20 pb-10 mb-8">
          {hasQuestions && (
            <div>
              <h3 className="text-title-lg text-primary font-bold mb-4">أهم الأسئلة الشائعة</h3>
              <ul className="space-y-3">
                {topQuestions.map((q) => (
                  <li key={q.id}>
                    <Link
                      href={`/tajneed/${q.slug}`}
                      className="text-body-md text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100 line-clamp-1"
                    >
                      {q.title}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Link
                  href="/tajneed" //game3-el-as2ela
                  className="text-label-md text-primary font-bold hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 rounded-lg"
                >
                  تصفح جميع الأسئلة ←
                </Link>
              </div>
            </div>
          )}
          <div>
            <h3 className="text-title-lg text-primary font-bold mb-4">عن الموقع</h3>
            <p className="text-body-md text-on-surface-variant mb-4 leading-relaxed">
              كوماندو هي منصة معرفية شاملة تهدف إلى مساعدة الشباب المصري في فهم كل ما يتعلق بإجراءات وشروط التجنيد والخدمة العسكرية.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-6">
          <nav aria-label="روابط التذييل" className="flex flex-wrap justify-center gap-6">
            <a className="text-body-md text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">الخصوصية</a>
            <a className="text-body-md text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">الشروط والأحكام</a>
            <a className="text-body-md text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100" href="#">اتصل بنا</a>
          </nav>
          <div className="text-label-md text-primary font-bold">
            © ٢٠٢٦ البوابة المعرفية العسكرية. جميع الحقوق محفوظة.
          </div>
        </div>
      </div>
    </footer>
  );
}
