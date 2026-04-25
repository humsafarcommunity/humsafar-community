// next-sitemap.config.js
// Run: npx next-sitemap after build

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://humsafarcommunity.com",
  generateRobotsTxt: false, // We have our own custom robots.txt
  generateIndexSitemap: true,
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 7000,
  
  // Exclude pages that shouldn't be indexed
  exclude: [
    "/admin",
    "/admin/*",
    "/api/*",
    "/404",
    "/500",
    "/search",
  ],

  // Custom priorities for different page types
  transform: async (config, path) => {
    // Homepage — highest priority
    if (path === "/") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    // Tour package pages — very high priority
    if (path.startsWith("/packages/") && path !== "/packages") {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }

    // Package listing page
    if (path === "/packages") {
      return {
        loc: path,
        changefreq: "daily",
        priority: 0.85,
        lastmod: new Date().toISOString(),
      };
    }

    // Blog posts — high priority for SEO
    if (path.startsWith("/blog/") && path !== "/blog") {
      return {
        loc: path,
        changefreq: "monthly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      };
    }

    // Blog listing
    if (path === "/blog") {
      return {
        loc: path,
        changefreq: "weekly",
        priority: 0.75,
        lastmod: new Date().toISOString(),
      };
    }

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
