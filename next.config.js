// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // PWA solo en prod
  runtimeCaching: [
    {
      // Cache del feed API por 30 segundos
      urlPattern: /^https?.*\/api\/feed/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-feed',
        expiration: { maxEntries: 10, maxAgeSeconds: 30 },
      },
    },
    {
      // Cache de assets estáticos
      urlPattern: /^https?.*\.(js|css|png|jpg|svg|ico)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: { maxEntries: 50, maxAgeSeconds: 86400 },
      },
    },
  ],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withPWA(nextConfig)
