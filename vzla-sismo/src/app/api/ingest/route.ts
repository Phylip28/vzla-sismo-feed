// src/app/api/ingest/route.ts
// Cron cada 5 min: jala RSS → pre-filtra → Groq fact-check → Supabase

import { createClient } from '@supabase/supabase-js'
import Parser from 'rss-parser'
import { FUENTES, preFiltroPasa, calcularScoreVeracidad } from '@/lib/sources'
import { verificarNoticia } from '@/lib/factchecker'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const parser = new Parser()

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (
    process.env.NODE_ENV === 'production' &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response('Unauthorized', { status: 401 })
  }

  let procesadas = 0, aprobadas = 0, rechazadas = 0, duplicadas = 0

  for (const fuente of FUENTES) {
    if (fuente.url.includes('usgs.gov')) {
      await ingestUSGS(fuente)
      continue
    }

    try {
      const feed = await parser.parseURL(fuente.url)

      for (const item of feed.items.slice(0, 20)) {
        const titulo = item.title ?? ''
        const desc = item.contentSnippet ?? item.summary ?? ''
        const url = item.link ?? ''
        const pubDate = item.pubDate ? new Date(item.pubDate) : new Date()

        if (!url || !titulo) continue
        if (!preFiltroPasa(titulo, desc)) continue

        // Check duplicado
        const { data: existe } = await supabase
          .from('noticias')
          .select('id')
          .eq('url', url)
          .single()
        if (existe) { duplicadas++; continue }

        procesadas++

        // Groq fact-check
        const resultado = await verificarNoticia(titulo, desc, fuente.nombre, fuente.tipoFactcheck)

        // Score final combinando credibilidad de fuente + análisis de Groq
        const scoreVeracidad = calcularScoreVeracidad(
          fuente.credibilidadScore,
          resultado.confianza
        )

        await supabase.from('noticias').insert({
          titulo,
          descripcion: desc.slice(0, 500),
          url,
          fuente: fuente.nombre,
          fuente_tipo: fuente.tipo,
          credibilidad_fuente: fuente.credibilidad,
          credibilidad_score: fuente.credibilidadScore,
          tag: resultado.tag ?? 'sismo',
          factcheck_status: resultado.status,
          factcheck_razon: resultado.razon,
          factcheck_confianza: resultado.confianza,
          veracidad: resultado.veracidad,
          veracidad_score: scoreVeracidad,
          publicado_at: pubDate.toISOString(),
        })

        if (resultado.status === 'aprobado') aprobadas++
        else rechazadas++

        await new Promise(r => setTimeout(r, 200))
      }
    } catch (err) {
      console.error(`[ingest] Error ${fuente.nombre}:`, err)
    }
  }

  return Response.json({ ok: true, procesadas, aprobadas, rechazadas, duplicadas })
}

async function ingestUSGS(fuente: typeof FUENTES[0]) {
  try {
    const res = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson'
    )
    const data = await res.json()

    for (const feature of data.features) {
      const props = feature.properties
      const lugar: string = props.place ?? ''
      const mag: number = props.mag ?? 0

      if (!lugar.toLowerCase().includes('venezuela') && mag < 4.0) continue

      const url = props.url
      const titulo = `Sismo M${mag.toFixed(1)} — ${lugar}`
      const desc = `Magnitud ${mag}, profundidad ${feature.geometry?.coordinates?.[2] ?? '?'} km.`

      const { data: existe } = await supabase
        .from('noticias').select('id').eq('url', url).single()
      if (existe) continue

      await supabase.from('noticias').insert({
        titulo,
        descripcion: desc,
        url,
        fuente: fuente.nombre,
        fuente_tipo: 'oficial',
        credibilidad_fuente: 'maxima',
        credibilidad_score: 99,
        tag: mag >= 4.5 ? 'replicas' : 'sismo',
        factcheck_status: 'aprobado',
        factcheck_razon: 'Fuente oficial USGS',
        factcheck_confianza: 99,
        veracidad: 'confirmado',
        veracidad_score: 99,
        publicado_at: new Date(props.time).toISOString(),
      })
    }
  } catch (err) {
    console.error('[ingest] Error USGS:', err)
  }
}
