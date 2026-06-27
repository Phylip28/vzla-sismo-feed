// src/app/api/feed/route.ts
// Endpoint REST del feed (para SSR inicial y filtros por tag)

import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const TAGS_VALIDOS = [
  'sismo', 'rescate', 'desaparecidos', 'puntos_acopio',
  'ayuda_humanitaria', 'replicas', 'donaciones', 'internacional',
]

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const tag = searchParams.get('tag')
  // parseInt devuelve NaN con input inválido (ej: 'abc'). Math.min(NaN, 50) también es NaN,
  // y supabase .limit(NaN) falla con error. El fallback a 30 mantiene el comportamiento por defecto.
  const raw = parseInt(searchParams.get('limit') ?? '30')
  const limit = Math.min(isNaN(raw) ? 30 : raw, 50)

  let query = supabase
    .from('noticias')
    // factcheck_status se incluye para que los datos sean consistentes con el tipo Noticia,
    // que lo requiere para el filtro de Realtime en el cliente (FeedNoticias.tsx).
    .select('id, titulo, descripcion, url, fuente, fuente_tipo, tag, publicado_at, factcheck_confianza, factcheck_status')
    .eq('factcheck_status', 'aprobado')
    .order('publicado_at', { ascending: false })
    .limit(limit)

  if (tag && TAGS_VALIDOS.includes(tag)) {
    query = query.eq('tag', tag)
  }

  const { data, error } = await query

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ noticias: data ?? [] }, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  })
}
