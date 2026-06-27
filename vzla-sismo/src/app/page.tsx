// src/app/page.tsx
import { FeedNoticias } from '@/components/FeedNoticias'

export const metadata = {
  title: 'Venezuela Sismo 24 jun — Feed verificado',
  description: 'Noticias verificadas en tiempo real sobre los sismos del 24 de junio de 2026 en Venezuela.',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <FeedNoticias />
    </main>
  )
}
