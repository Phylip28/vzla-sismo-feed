// src/lib/sources.ts
// Fuentes con nivel de credibilidad explícito (afecta el badge de veracidad)

export type CredibilidadNivel = 'maxima' | 'alta' | 'media' | 'baja'

export type Source = {
  nombre: string
  tipo: 'rss' | 'x_twitter' | 'oficial'
  tipoFactcheck: 'agencia_internacional' | 'medio_regional' | 'oficial' | 'x_twitter'
  url: string
  credibilidad: CredibilidadNivel
  credibilidadScore: number  // 0-100, se combina con el análisis de Groq
  descripcion: string
}

export const FUENTES: Source[] = [
  // ── Fuentes oficiales ──────────────────────────────────────────────
  {
    nombre: 'USGS',
    tipo: 'oficial',
    tipoFactcheck: 'oficial',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson',
    credibilidad: 'maxima',
    credibilidadScore: 99,
    descripcion: 'Servicio Geológico de EE.UU. — datos sísmicos oficiales',
  },

  // ── Agencias internacionales ───────────────────────────────────────
  {
    nombre: 'Reuters',
    tipo: 'rss',
    tipoFactcheck: 'agencia_internacional',
    url: 'https://feeds.reuters.com/reuters/latinAmericaNews',
    credibilidad: 'maxima',
    credibilidadScore: 97,
    descripcion: 'Agencia de noticias internacional',
  },
  {
    nombre: 'AP News',
    tipo: 'rss',
    tipoFactcheck: 'agencia_internacional',
    url: 'https://rss.apnews.com/apf-latinamerica',
    credibilidad: 'maxima',
    credibilidadScore: 97,
    descripcion: 'Associated Press — agencia internacional',
  },
  {
    nombre: 'BBC Mundo',
    tipo: 'rss',
    tipoFactcheck: 'agencia_internacional',
    url: 'https://feeds.bbci.co.uk/mundo/rss.xml',
    credibilidad: 'maxima',
    credibilidadScore: 95,
    descripcion: 'BBC en español',
  },

  // ── Medios regionales ─────────────────────────────────────────────
  {
    nombre: 'CNN en Español',
    tipo: 'rss',
    tipoFactcheck: 'medio_regional',
    url: 'https://cnnespanol.cnn.com/feed/',
    credibilidad: 'alta',
    credibilidadScore: 88,
    descripcion: 'CNN América Latina',
  },
  {
    nombre: 'Univisión',
    tipo: 'rss',
    tipoFactcheck: 'medio_regional',
    url: 'https://www.univision.com/rss/feed',
    credibilidad: 'alta',
    credibilidadScore: 85,
    descripcion: 'Univisión Noticias',
  },
  {
    nombre: 'El Tiempo',
    tipo: 'rss',
    tipoFactcheck: 'medio_regional',
    url: 'https://www.eltiempo.com/rss/mundo.xml',
    credibilidad: 'alta',
    credibilidadScore: 83,
    descripcion: 'El Tiempo — Colombia',
  },

  // ── X / Twitter (menor credibilidad, más escrutinio) ──────────────
  {
    nombre: 'X #TerremotoVenezuela',
    tipo: 'x_twitter',
    tipoFactcheck: 'x_twitter',
    url: 'https://nitter.net/search/rss?q=%23TerremotoVenezuela&f=tweets',
    credibilidad: 'baja',
    credibilidadScore: 30,
    descripcion: 'Posts de X — sin verificar',
  },
  {
    nombre: 'X #SismoVenezuela',
    tipo: 'x_twitter',
    tipoFactcheck: 'x_twitter',
    url: 'https://nitter.net/search/rss?q=%23SismoVenezuela&f=tweets',
    credibilidad: 'baja',
    credibilidadScore: 30,
    descripcion: 'Posts de X — sin verificar',
  },
]

// Score final de veracidad = promedio ponderado de credibilidad de fuente + confianza de Groq
export function calcularScoreVeracidad(
  credibilidadScore: number,
  groqConfianza: number
): number {
  // La fuente tiene más peso (60%) que el análisis de contenido (40%)
  return Math.round(credibilidadScore * 0.6 + groqConfianza * 0.4)
}

// Pre-filtro de keywords (gratis, antes de llamar a Groq)
export const KEYWORDS_REQUERIDOS = [
  'venezuela', 'venezuel',
  'la guaira', 'carabobo', 'yaracuy', 'caracas', 'morón', 'moron',
  'terremoto', 'sismo', 'temblor', 'réplica', 'replica',
  'rescate', 'desaparecid', 'escombros', 'derrumb',
]

export function preFiltroPasa(titulo: string, desc: string): boolean {
  const texto = `${titulo} ${desc}`.toLowerCase()
  return KEYWORDS_REQUERIDOS.some(kw => texto.includes(kw))
}
