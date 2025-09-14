/** @type {import('next-sitemap').IConfig} */
const axios = require("axios");

module.exports = {
  siteUrl: "https://www.shubukanindia.org",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/admin/*", "/api/*", "/dev/*", "/404", "/500"],

  additionalPaths: async (config) => {
    // 1. Static pages
    const staticPages = [
      "/",
      "/blog",
      "/gallery",
      "/contact",
      "/membership",
      "/history",
      "/karate-and-kobudo",
      "/lineage-and-dojokun",
      "/contributors",
      "/shubukan-india",
      "/shubukan-okinawa",
      "/shubukan-world",
      "/shuri-karate-kobudo-hozonkai",
      "/services",
    ];

    // 2. Fetch blogs from your backend
    let blogPaths = [];
    try {
      const res = await axios.get(
        "https://shubukanindiabackend.vercel.app/slugs"
      );

      if (res.data?.blogs && Array.isArray(res.data.blogs)) {
        blogPaths = res.data.blogs.map((blog) =>
          config.transform(config, `/blogpost/${blog.slug}`, {
            changefreq: "weekly",
            priority: 0.9,
            // Google SEO loves rich sitemaps (images + lastmod)
            lastmod: new Date().toISOString(),
            images: blog.thumbnailImage
              ? [
                  {
                    loc: blog.thumbnailImage.url,
                    title: blog.title,
                    caption: blog.thumbnailImage.altText || blog.title,
                  },
                ]
              : [],
          })
        );
      }
    } catch (error) {
      console.error(
        "⚠️ Failed to fetch blog slugs for sitemap:",
        error.message
      );
    }

    // 3. Merge static + dynamic
    const staticPaths = await Promise.all(
      staticPages.map((url) =>
        config.transform(config, url, {
          changefreq: url === "/" ? "daily" : "monthly",
          priority: url === "/" ? 1.0 : 0.7,
        })
      )
    );

    return [...staticPaths, ...(await Promise.all(blogPaths))];
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/_next/",
          "/dev/",
          "/*.json$",
          "/*.config.js$",
          "/*.config.mjs$",
          "/.env",
          "/.env.*",
          "/package.json",
          "/package-lock.json",
          "/yarn.lock",
          "/.gitignore",
          "/README.md",
          "/registration",
          "/marksheet",
          "/help-and-faqs",
          "/contributors",
          "/term-and-condition",
        ],
      },
    ],
    additionalSitemaps: ["https://www.shubukanindia.org/sitemap.xml"],
  },
};
