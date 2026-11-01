/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Bilder von djakki.de werden von next/image verkleinert und als AVIF/WebP ausgeliefert
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'www.djakki.de', pathname: '/bilder/**' }],
  },
}

export default nextConfig
