import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://profilinegm25.eu';
  const lastModified = new Date();

  return [
    { url: `${baseUrl}/bg`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/en`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
  ];
}
