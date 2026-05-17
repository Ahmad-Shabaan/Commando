/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://komando.store",
  generateRobotsTxt: false,
  changefreq: "daily",
  priority: 1.0,
  sitemapSize: 5000,
  exclude: ["/api/*", "/design/*", "/tajneed/*"],
  additionalPaths: async () => [
    {
      loc: "/",
      changefreq: "daily",
      priority: 1.0,
      lastmod: new Date().toISOString(),
    },
    {
      loc: "/tajneed",
      changefreq: "daily",
      priority: 0.9,
      lastmod: new Date().toISOString(),
    },
  ],
};