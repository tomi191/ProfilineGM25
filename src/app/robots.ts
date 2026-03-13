import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
      { userAgent: 'GPTBot', allow: ['/', '/llms.txt', '/llms-full.txt'] },
      { userAgent: 'ClaudeBot', allow: ['/', '/llms.txt', '/llms-full.txt'] },
      { userAgent: 'PerplexityBot', allow: ['/', '/llms.txt', '/llms-full.txt'] },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Googlebot', allow: '/' },
    ],
    sitemap: 'https://profilinegm25.eu/sitemap.xml',
  };
}
