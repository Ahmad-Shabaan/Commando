/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://komando.store",
  generateRobotsTxt: false, // We use app/robots.ts instead
  changefreq: "daily",
  priority: 1.0,
  sitemapSize: 5000,
  exclude: ["/api/*", "/design/*"],
  additionalPaths: async () => [
    {
      loc: "/",
      changefreq: "daily",
      priority: 1.0,
      lastmod: new Date().toISOString(),
    },
  ],
};