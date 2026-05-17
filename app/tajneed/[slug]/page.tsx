import { notFound } from "next/navigation";
import sql from "@/lib/db";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import RelatedQuestions from "@/components/RelatedQuestions";
import QuestionDetail from "@/components/QuestionDetail";
import { SITE_URL, flattenAnswerItems } from "@/lib/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const questions = await sql`SELECT * FROM questions WHERE slug = ${slug}`;
  const question = questions[0];

  if (!question) return {};

  return {
    title: question.seo_title || `${question.title} | كوماندو - التجنيد في مصر`,
    description: question.seo_description || `إجابة شاملة عن: ${question.title}. دليل التجنيد في مصر.`,
    keywords: [question.primary_keyword, "التجنيد في مصر", "الخدمة العسكرية"].filter(Boolean),
    alternates: { canonical: `/tajneed/${slug}` },
  };
}

export async function generateStaticParams() {
  const questions = await sql`SELECT slug FROM questions WHERE slug IS NOT NULL`;
  return questions.map((q: any) => ({ slug: q.slug }));
}

export default async function QuestionPage({ params }: Props) {
  const { slug } = await params;

  const questions = await sql`SELECT * FROM questions WHERE slug = ${slug}`;
  const question = questions[0] as any;

  if (!question) {
    notFound();
  }

  const answers = await sql`
    SELECT id, question_id, content, content_items, is_short, created_at
    FROM answers
    WHERE question_id = ${question.id}
    ORDER BY is_short DESC, created_at ASC
  `;

  const shortAnswer = answers.find((a: any) => a.is_short) as any ?? null;
  const detailedAnswers = answers.filter((a: any) => !a.is_short) as any[];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": question.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": shortAnswer ? flattenAnswerItems(shortAnswer) : "جاري تحديث الإجابة"
      }
    }]
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "التجنيد",
        "item": `${SITE_URL}/tajneed`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": question.title,
        "item": `${SITE_URL}/tajneed/${slug}`
      }
    ]
  };

  return (
    <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-16 max-w-4xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 space-x-reverse text-body-sm md:text-body-md text-on-surface-variant overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <li>
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              الرئيسية
            </Link>
          </li>
          <li><ChevronLeft size={16} className="opacity-50" aria-hidden="true" /></li>
          <li>
            <Link href="/tajneed" className="hover:text-primary transition-colors">
              دليل التجنيد
            </Link>
          </li>
          <li><ChevronLeft size={16} className="opacity-50" aria-hidden="true" /></li>
          <li className="text-on-surface font-medium truncate max-w-[200px] md:max-w-md" aria-current="page">
            {question.title}
          </li>
        </ol>
      </nav>

      <QuestionDetail
        question={question}
        shortAnswer={shortAnswer}
        detailedAnswers={detailedAnswers}
      />

      <RelatedQuestions currentQuestionId={question.id} />
    </div>
  );
}
