/**
 * Static WebSite + Organization structured data (JSON-LD).
 * Helps Google understand the site identity, enables sitelinks search box,
 * and associates the brand with the domain.
 */
export default function WebsiteJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://komando.store";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "كوماندو - البوابة المعرفية العسكرية",
    alternateName: "Komando",
    url: siteUrl,
    description:
      "دليل شامل ومرجع معرفي عن التجنيد والخدمة العسكرية في مصر. أسئلة وأجوبة موثوقة عن شروط التجنيد، مدة الخدمة، الإعفاءات، والأوراق المطلوبة.",
    inLanguage: "ar",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "كوماندو - البوابة المعرفية العسكرية",
    url: siteUrl,
    logo: `${siteUrl}/commando.png`,
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
