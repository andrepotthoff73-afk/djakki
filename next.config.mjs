/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Bilder von djakki.de werden von next/image verkleinert und als AVIF/WebP ausgeliefert
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'www.djakki.de', pathname: '/bilder/**' },
      // Flyer aus dem Adminbereich liegen im Vercel-Blob-Speicher
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com', pathname: '/events/**' },
    ],
  },
  // Flyer werden im Browser verkleinert, die Grenze ist nur ein Sicherheitsnetz
  experimental: { serverActions: { bodySizeLimit: '5mb' } },
}

export default nextConfig
