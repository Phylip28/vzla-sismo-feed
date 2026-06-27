# Venezuela Sismo — Feed de noticias verificadas

Feed en tiempo real de noticias verificadas sobre los sismos del 24 de junio 2026 en Venezuela.  
Stack: **Next.js 14 · Supabase · Tailwind · Claude API (fact-checking)**

---

## Cómo funciona

```
RSS / USGS / Nitter
       │
       ▼
[Pre-filtro keywords]  ← gratis, instantáneo
       │ pasa
       ▼
[Claude fact-checker]  ← verifica relevancia + asigna tag
       │ aprobado
       ▼
[Supabase (noticias)]  ← guarda con RLS (solo aprobadas son públicas)
       │
       ▼
[Supabase Realtime]    ← WebSocket push al cliente
       │
       ▼
[Feed en el browser]   ← se actualiza solo
```

Cada noticia pasa por dos filtros:
1. **Pre-filtro de keywords** — descarta lo obvio gratis (sin gastar tokens)
2. **Claude API** — verifica que sea relevante al sismo de Venezuela, asigna tag, da score de confianza 0-100

Solo las noticias con `factcheck_status = 'aprobado'` aparecen en el feed público (RLS de Supabase lo garantiza).

---

## Setup

### 1. Clonar e instalar
```bash
git clone ...
cd vzla-sismo-feed
npm install
```

### 2. Supabase
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a SQL Editor y correr `supabase/migrations/001_noticias.sql`
3. Copiar URL y keys del proyecto

### 3. Variables de entorno
```bash
cp .env.example .env.local
# Editar .env.local con tus keys
```

### 4. Correr en dev
```bash
npm run dev
# App en http://localhost:3000
```

### 5. Probar ingesta manualmente
```bash
curl http://localhost:3000/api/ingest
# Responde: { ok: true, procesadas: N, aprobadas: N, rechazadas: N }
```

---

## Deploy en Vercel

```bash
npm i -g vercel
vercel --prod
```

Agregar en Vercel → Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `CRON_SECRET`

El `vercel.json` ya configura el cron para correr `/api/ingest` cada 5 minutos.

---

## Tags del feed

| Tag | Qué cubre |
|-----|-----------|
| `sismo` | Datos técnicos, magnitud, epicentro |
| `rescate` | Equipos de rescate, supervivientes |
| `desaparecidos` | Personas buscadas, plataformas |
| `puntos_acopio` | Centros de donación en especie |
| `ayuda_humanitaria` | ONG, refugios, distribución de ayuda |
| `replicas` | Aftershocks, sismos posteriores |
| `donaciones` | Cómo donar dinero |
| `internacional` | Respuesta de otros países |

---

## Fuentes incluidas

**Alta confiabilidad (auto-procesadas):**
- Reuters América Latina
- AP News
- BBC Mundo
- CNN en Español
- Univisión
- El Tiempo (Colombia)
- USGS (datos sísmicos oficiales — auto-aprobadas sin fact-check)

**Confiabilidad media (mayor scrutiny de Claude):**
- X #TerremotoVenezuela (via Nitter RSS)
- X #SismoVenezuela (via Nitter RSS)

---

## Costos estimados (Claude API)

Con ~5 fuentes RSS × 20 items × cada 5 min = ~2,000 llamadas/hora máximo.  
En la práctica, el pre-filtro de keywords elimina ~70-80% antes de llegar a Claude.  
Costo estimado: **< $2 USD/día** con claude-sonnet-4-6 a precios actuales.
