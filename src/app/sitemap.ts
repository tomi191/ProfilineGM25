import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://profilinegm25.eu';
  const lastModified = new Date();

  return [
    // Main pages
    { url: `${baseUrl}/bg`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/en`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    // AI discovery
    { url: `${baseUrl}/llms.txt`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/llms-full.txt`, lastModified, changeFrequency: 'monthly', priority: 0.4 },
  ];
}
