'use client'
// src/components/FeedNoticias.tsx

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type VeracidadNivel = 'confirmado' | 'probable' | 'no_verificado' | 'dudoso'

type Noticia = {
  id: string
  titulo: string
  descripcion: string | null
  url: string
  fuente: string
  fuente_tipo: 'rss' | 'x_twitter' | 'oficial'
  credibilidad_fuente: 'maxima' | 'alta' | 'media' | 'baja'
  tag: string
  publicado_at: string
  veracidad: VeracidadNivel
  veracidad_score: number
  isNew?: boolean
}

const TAG_LABELS: Record<string, { label: string; color: string }> = {
  todos:             { label: 'Todos',             color: '' },
  sismo:             { label: 'Sismo',             color: 'bg-red-100 text-red-800' },
  rescate:           { label: 'Rescate',           color: 'bg-orange-100 text-orange-800' },
  desaparecidos:     { label: 'Desaparecidos',     color: 'bg-purple-100 text-purple-800' },
  puntos_acopio:     { label: 'Puntos de acopio',  color: 'bg-green-100 text-green-800' },
  ayuda_humanitaria: { label: 'Ayuda humanitaria', color: 'bg-blue-100 text-blue-800' },
  replicas:          { label: 'Réplicas',          color: 'bg-yellow-100 text-yellow-800' },
  donaciones:        { label: 'Donaciones',        color: 'bg-teal-100 text-teal-800' },
  internacional:     { label: 'Internacional',     color: 'bg-slate-100 text-slate-800' },
}

// Badge de veracidad — el corazón de la nueva feature
const VERACIDAD_CONFIG: Record<VeracidadNivel, {
  label: string
  color: string
  bg: string
  descripcion: string
  icono: string
}> = {
  confirmado: {
    label: 'Confirmado',
    color: 'text-green-800',
    bg: 'bg-green-100 border-green-200',
    descripcion: 'Fuente oficial o agencia internacional verificada',
    icono: '✓',
  },
  probable: {
    label: 'Probable',
    color: 'text-blue-800',
    bg: 'bg-blue-100 border-blue-200',
    descripcion: 'Medio de comunicación reconocido',
    icono: '◎',
  },
  no_verificado: {
    label: 'Sin verificar',
    color: 'text-yellow-800',
    bg: 'bg-yellow-100 border-yellow-200',
    descripcion: 'Fuente no verificada independientemente',
    icono: '?',
  },
  dudoso: {
    label: 'Dudoso',
    color: 'text-red-800',
    bg: 'bg-red-100 border-red-200',
    descripcion: 'Contenido que puede ser inexacto',
    icono: '!',
  },
}

function BadgeVeracidad({ nivel, score }: { nivel: VeracidadNivel; score: number }) {
  const cfg = VERACIDAD_CONFIG[nivel]
  return (
    <span
      title={`${cfg.descripcion} — Score: ${score}/100`}
      className={`
        inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5
        rounded-full border ${cfg.bg} ${cfg.color} cursor-help
      `}
    >
      <span>{cfg.icono}</span>
      {cfg.label}
    </span>
  )
}

function BadgeFuente({ tipo }: { tipo: string }) {
  if (tipo === 'oficial') return <span className="text-[10px] text-gray-400">🏛 Oficial</span>
  if (tipo === 'x_twitter') return <span className="text-[10px] text-gray-400">𝕏 Twitter</span>
  return <span className="text-[10px] text-gray-400">📰 RSS</span>
}

export function FeedNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [tagActivo, setTagActivo] = useState('todos')
  const [cargando, setCargando] = useState(true)
  const [nuevasCount, setNuevasCount] = useState(0)
  const [tooltipId, setTooltipId] = useState<string | null>(null)

  const cargarFeed = useCallback(async (tag: string) => {
    setCargando(true)
    const url = tag === 'todos' ? '/api/feed' : `/api/feed?tag=${tag}`
    const res = await fetch(url)
    const data = await res.json()
    setNoticias(data.noticias ?? [])
    setCargando(false)
    setNuevasCount(0)
  }, [])

  useEffect(() => { cargarFeed(tagActivo) }, [tagActivo, cargarFeed])

  useEffect(() => {
    const channel = supabase
      .channel('noticias-feed')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'noticias',
        filter: tagActivo !== 'todos' ? `tag=eq.${tagActivo}` : undefined,
      }, (payload) => {
        const nueva = payload.new as Noticia
        setNoticias(prev => {
          if (prev.find(n => n.id === nueva.id)) return prev
          return [{ ...nueva, isNew: true }, ...prev].slice(0, 50)
        })
        setNuevasCount(c => c + 1)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [tagActivo])

  const tiempoRelativo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const min = Math.floor(diff / 60000)
    if (min < 1) return 'ahora mismo'
    if (min < 60) return `hace ${min} min`
    const h = Math.floor(min / 60)
    if (h < 24) return `hace ${h}h`
    return new Date(iso).toLocaleDateString('es-VE', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h1 className="text-lg font-medium text-gray-900">Venezuela — Sismo 24 jun</h1>
        </div>
        <span className="text-xs text-gray-400">Solo noticias verificadas</span>
      </div>

      {/* Leyenda de veracidad */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {Object.entries(VERACIDAD_CONFIG).map(([key, cfg]) => (
          <span
            key={key}
            title={cfg.descripcion}
            className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} cursor-help`}
          >
            {cfg.icono} {cfg.label}
          </span>
        ))}
      </div>

      {/* Banner nuevas noticias */}
      {nuevasCount > 0 && (
        <button
          onClick={() => { setNuevasCount(0); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="w-full mb-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
        >
          ↑ {nuevasCount} nueva{nuevasCount > 1 ? 's' : ''} noticia{nuevasCount > 1 ? 's' : ''}
        </button>
      )}

      {/* Filtros por tag */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {Object.entries(TAG_LABELS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setTagActivo(key)}
            className={`
              whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-colors
              ${tagActivo === key
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Feed */}
      {cargando ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : noticias.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📡</p>
          <p className="text-sm">Sin noticias verificadas en esta categoría</p>
        </div>
      ) : (
        <div className="space-y-3">
          {noticias.map((n) => {
            const tagInfo = TAG_LABELS[n.tag]
            return (
              <a
                key={n.id}
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  block p-4 rounded-xl border bg-white
                  hover:border-gray-300 hover:shadow-sm transition-all
                  ${n.isNew ? 'border-red-200 ring-2 ring-red-100' : 'border-gray-100'}
                `}
              >
                {/* Fila superior: fuente + tag + tiempo */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <BadgeFuente tipo={n.fuente_tipo} />
                  <span className="text-xs font-medium text-gray-600">{n.fuente}</span>
                  {tagInfo && (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tagInfo.color}`}>
                      {tagInfo.label}
                    </span>
                  )}
                  {n.isNew && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                      NUEVO
                    </span>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">
                    {tiempoRelativo(n.publicado_at)}
                  </span>
                </div>

                {/* Título */}
                <p className="text-sm font-medium text-gray-900 leading-snug mb-2">
                  {n.titulo}
                </p>

                {/* Descripción */}
                {n.descripcion && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                    {n.descripcion}
                  </p>
                )}

                {/* Fila inferior: veracidad + score */}
                <div className="flex items-center gap-2 mt-1">
                  <BadgeVeracidad nivel={n.veracidad} score={n.veracidad_score} />
                  {/* Barra de score */}
                  <div className="flex-1 flex items-center gap-1.5">
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          n.veracidad_score >= 80 ? 'bg-green-400' :
                          n.veracidad_score >= 60 ? 'bg-blue-400' :
                          n.veracidad_score >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${n.veracidad_score}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 tabular-nums">
                      {n.veracidad_score}%
                    </span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
