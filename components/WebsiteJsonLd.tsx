import { SITE_URL } from "@/lib/types";

export default function WebsiteJsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "كوماندو - البوابة المعرفية العسكرية",
    alternateName: "Komando",
    url: SITE_URL,
    description:
      "دليل شامل ومرجع معرفي عن التجنيد والخدمة العسكرية في مصر. أسئلة وأجوبة موثوقة عن شروط التجنيد، مدة الخدمة، الإعفاءات، والأوراق المطلوبة.",
    inLanguage: "ar",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/tajneed?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "كوماندو - البوابة المعرفية العسكرية",
    url: SITE_URL,
    logo: `${SITE_URL}/commando.png`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
