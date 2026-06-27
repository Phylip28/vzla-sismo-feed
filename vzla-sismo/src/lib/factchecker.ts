// src/lib/factchecker.ts
// Fact-checker usando Groq (gratis) con llama3-70b
// Groq free tier: 14,400 requests/día, más que suficiente

export type FactCheckResult = {
  status: 'aprobado' | 'rechazado' | 'dudoso'
  tag: string | null
  razon: string
  confianza: number          // 0-100: qué tan relevante/verificable es el contenido
  veracidad: VeracidadNivel  // basado en credibilidad de la fuente + análisis
}

export type VeracidadNivel = 'confirmado' | 'probable' | 'no_verificado' | 'dudoso'

const SYSTEM_PROMPT = `Eres un verificador de noticias especializado en el doble sismo que ocurrió en Venezuela el 24 de junio de 2026.

CONTEXTO DEL EVENTO:
- Dos sismos: magnitud 7.2 y 7.5 con epicentro cerca de Morón/San Felipe, estado Yaracuy/Carabobo
- Ocurrieron con 40 segundos de diferencia (doblete sísmico)
- Zonas más afectadas: La Guaira, Caracas, Carabobo, Miranda, Trujillo
- Cifras actuales: ~920 muertos, ~3,360 heridos, +50,000 desaparecidos
- Estado de emergencia declarado

TU TAREA:
Analiza el titular, descripción y fuente. Determina:

1. ¿Es RELEVANTE al sismo de Venezuela del 24 de junio 2026?
   - RECHAZA si habla de otros países, otros sismos, o temas no relacionados
   - RECHAZA si parece desinformación, cifras exageradas sin fuente, o rumor sin verificar
   - MARCA COMO DUDOSA si la información no puede confirmarse fácilmente
   - APRUEBA si es claramente sobre este evento

2. TAG (si es aprobada): sismo | rescate | desaparecidos | puntos_acopio | ayuda_humanitaria | replicas | donaciones | internacional

3. VERACIDAD basada en el TIPO de fuente que se indica:
   - "agencia_internacional" → confirmado (Reuters, AP, AFP, BBC)
   - "medio_regional" → probable (CNN Español, Univisión, El Tiempo)  
   - "oficial" → confirmado (USGS, ONU, Cruz Roja)
   - "x_twitter" → no_verificado siempre
   - Si el contenido contradice datos conocidos → dudoso

Responde SOLO con JSON sin texto adicional ni backticks:
{"status":"aprobado"|"rechazado"|"dudoso","tag":"sismo"|"rescate"|"desaparecidos"|"puntos_acopio"|"ayuda_humanitaria"|"replicas"|"donaciones"|"internacional"|null,"razon":"explicación breve máx 100 chars","confianza":0-100,"veracidad":"confirmado"|"probable"|"no_verificado"|"dudoso"}`

export async function verificarNoticia(
  titulo: string,
  descripcion: string,
  fuente: string,
  fuenteTipo: string
): Promise<FactCheckResult> {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        temperature: 0.1, // bajo para respuestas consistentes
        max_tokens: 200,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `FUENTE: ${fuente}\nTIPO_FUENTE: ${fuenteTipo}\nTITULAR: ${titulo}\nDESCRIPCIÓN: ${descripcion?.slice(0, 500) ?? '(sin descripción)'}`,
          },
        ],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Groq API error ${res.status}: ${err}`)
    }

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content ?? ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return {
      status: parsed.status ?? 'dudoso',
      tag: parsed.tag ?? null,
      razon: parsed.razon ?? 'Sin razón',
      confianza: Math.min(100, Math.max(0, parsed.confianza ?? 50)),
      veracidad: parsed.veracidad ?? 'no_verificado',
    }
  } catch (err) {
    console.error('[factchecker] Error Groq:', err)
    return {
      status: 'dudoso',
      tag: null,
      razon: 'Error en verificación automática',
      confianza: 0,
      veracidad: 'dudoso',
    }
  }
}
