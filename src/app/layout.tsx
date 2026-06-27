import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Venezuela Sismo 24 jun — Feed verificado',
  description: 'Noticias verificadas en tiempo real sobre los sismos del 24 de junio de 2026 en Venezuela.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
  openGraph: {
    title: 'Venezuela Sismo 24 jun — Feed verificado',
    description: 'Noticias verificadas en tiempo real sobre los sismos del 24 de junio de 2026 en Venezuela.',
    type: 'website',
    images: [{ url: '/og.png' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // lang="es" porque toda la app es en español
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
