/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.shubukanindia.org',
  generateRobotsText: true,
  exclude: [
    '/admin/*',
    '/api/*',
    '/registration/*',
    '/membership/*',
    '/marksheet/*',
    '/dev/*',
  ],
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/blog'),
    await config.transform(config, '/gallery'),
    await config.transform(config, '/contact'),
    await config.transform(config, '/help-and-faqs'),
    await config.transform(config, '/history'),
    await config.transform(config, '/karate-and-kobudo'),
    await config.transform(config, '/lineage-and-dojokun'),
    await config.transform(config, '/contributors'),
    await config.transform(config, '/shubukan-india'),
    await config.transform(config, '/shubukan-okinawa'),
    await config.transform(config, '/shubukan-world'),
    await config.transform(config, '/shuri-karate-kobudo-hozonkai'),
    await config.transform(config, '/term-and-condition'),
    await config.transform(config, '/services'),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/registration/', '/membership/', '/marksheet/', '/dev/'],
      },
    ],
  },
}