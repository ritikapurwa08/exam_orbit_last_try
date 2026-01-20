import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ExamOrbit',
    short_name: 'ExO',
    description: 'Intall to your mobile directly',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/wb192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/wb512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
