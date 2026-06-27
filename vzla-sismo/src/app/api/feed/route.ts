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
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '30'), 50)

  let query = supabase
    .from('noticias')
    .select('id, titulo, descripcion, url, fuente, fuente_tipo, tag, publicado_at, factcheck_confianza')
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

  return Response.json({ noticias: data ?? [] })
}
