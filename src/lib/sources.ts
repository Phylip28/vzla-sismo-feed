// src/lib/sources.ts
// Fuentes verificadas y sus RSS feeds

export type Source = {
  nombre: string
  tipo: 'rss' | 'x_twitter' | 'oficial'
  url: string
  confiabilidad: 'alta' | 'media'
}

export const FUENTES: Source[] = [
  // Agencias internacionales — máxima confiabilidad
  {
    nombre: 'Reuters América Latina',
    tipo: 'rss',
    url: 'https://feeds.reuters.com/reuters/latinAmericaNews',
    confiabilidad: 'alta',
  },
  {
    nombre: 'AP News',
    tipo: 'rss',
    url: 'https://rss.apnews.com/apf-latinamerica',
    confiabilidad: 'alta',
  },
  {
    nombre: 'BBC Mundo',
    tipo: 'rss',
    url: 'https://feeds.bbci.co.uk/mundo/rss.xml',
    confiabilidad: 'alta',
  },
  {
    nombre: 'CNN en Español',
    tipo: 'rss',
    url: 'https://cnnespanol.cnn.com/feed/',
    confiabilidad: 'alta',
  },
  // Medios regionales verificados
  {
    nombre: 'Univisión Noticias',
    tipo: 'rss',
    url: 'https://www.univision.com/rss/feed',
    confiabilidad: 'alta',
  },
  {
    nombre: 'El Tiempo (Colombia)',
    tipo: 'rss',
    url: 'https://www.eltiempo.com/rss/mundo.xml',
    confiabilidad: 'alta',
  },
  {
    nombre: 'La Patilla',
    tipo: 'rss',
    url: 'https://lapatilla.com/feed/',
    confiabilidad: 'media',
  },
  // USGS - Datos sísmicos oficiales
  {
    nombre: 'USGS Sismos',
    tipo: 'oficial',
    url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson',
    confiabilidad: 'alta',
  },
  // Cuentas Oficiales de X (Nitter RSS)
  {
    nombre: '@Funvisis',
    tipo: 'x_twitter',
    url: 'https://nitter.net/funvisis/rss',
    confiabilidad: 'alta',
  },
  {
    nombre: '@PCivil_Ve',
    tipo: 'x_twitter',
    url: 'https://nitter.net/PCivil_Ve/rss',
    confiabilidad: 'alta',
  },
  {
    nombre: '@CruzRojaVe',
    tipo: 'x_twitter',
    url: 'https://nitter.net/cruzrojave/rss',
    confiabilidad: 'alta',
  },
  // Perfiles de Noticias, Periodistas y Política
  {
    nombre: '@UHN_Plus',
    tipo: 'x_twitter',
    url: 'https://nitter.net/UHN_Plus/rss',
    confiabilidad: 'media',
  },
  {
    nombre: '@OrlvndoA',
    tipo: 'x_twitter',
    url: 'https://nitter.net/OrlvndoA/rss',
    confiabilidad: 'media',
  },
  {
    nombre: '@MariaCorinaYA',
    tipo: 'x_twitter',
    url: 'https://nitter.net/MariaCorinaYA/rss',
    confiabilidad: 'alta',
  },
  {
    nombre: '@nayibbukele',
    tipo: 'x_twitter',
    url: 'https://nitter.net/nayibbukele/rss',
    confiabilidad: 'alta',
  },
  {
    nombre: '@usembassyve',
    tipo: 'x_twitter',
    url: 'https://nitter.net/usembassyve/rss',
    confiabilidad: 'alta',
  },
  {
    nombre: '@EmmaRincon',
    tipo: 'x_twitter',
    url: 'https://nitter.net/EmmaRincon/rss',
    confiabilidad: 'media',
  },
  // Nitter (X/Twitter búsqueda) — confiabilidad media
  {
    nombre: 'X #TerremotoVenezuela',
    tipo: 'x_twitter',
    url: 'https://nitter.net/search/rss?q=%23TerremotoVenezuela&f=tweets',
    confiabilidad: 'media',
  },
  {
    nombre: 'X #SismoVenezuela',
    tipo: 'x_twitter',
    url: 'https://nitter.net/search/rss?q=%23SismoVenezuela&f=tweets',
    confiabilidad: 'media',
  },
]

// Keywords mínimos para pre-filtrar antes de enviar a Claude
// (evitar gastar tokens en noticias obvias de otros temas)
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
