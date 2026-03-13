import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Profiline GM25 — Professional Dual Action Polisher',
    short_name: 'Profiline GM25',
    description: 'Professional dual-action orbital polisher with 1200W motor and 25mm throw. Engineered in Bulgaria.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#A3E635',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
