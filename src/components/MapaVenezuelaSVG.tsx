'use client'

// Bounding box: x=0..700, y=0..600
// Projected from public/data/venezuela.geojson:
// minLng=-73.6, maxLng=-59.6, minLat=0.5, maxLat=12.5
const VENEZUELA_PATHS = [
  "M504.5 79.7L501.2 80.6L500.4 76.8L501.5 75.8L506.8 72.5L508.2 71.9L509.3 72.5L509 73.4L511.5 74.8L510.9 76.6L508.2 78.6L504.5 79.7Z",
  "M513.3 68.9L507.3 70.2L507.4 69.1L509 67.3L512.2 66.8L513.3 66.1L515.3 65.7L516.5 65.8L517.6 66.3L514.9 67.3L513.3 68.9Z",
  "M293.8 0L291.1 0.9L286.1 0L283.7 -1.3L285.2 -2.7L289.3 -2.7L293.1 -0.9L293.8 0Z",
  "M361.9 -11.3L363.5 -4.7L363 -3.5L358.5 0.9L354.7 1.2L351.7 1.1L349.3 0.2L346.4 -2.6L343.5 -1.8L336.3 -2.8L334.3 -3.8L337 -7.3L341.9 -8.7L343.7 -9L345.2 -6.8L348.8 -5L353 -4.8L354 -8.1L359.7 -13.1L361.9 -11.3Z",
  "M66.3 -38.5L68.8 -32.9L72.8 -28.7L75.9 -29L78.1 -29.7L92.8 -30.6L101.7 -27.8L113 -26.3L123.6 -20.2L134.5 -12.7L137.2 -7.3L138.2 -2.2L140.8 1.3L138.2 4.9L139.6 10.8L142.7 16.8L147.4 20.7L160.8 21.7L175.3 19.1L197.7 16.8L204.9 14.8L242 13.7L249.1 16.6L249.8 19.4L249.9 21.7L261.8 32.4L271.6 33.9L279.9 37.3L288.5 39.2L297.9 41.8L303.2 41.5L307.2 40.5L311.9 40.4L345 22.4L362.7 22.9L365.4 21.7L367.8 20.1L361.3 17.4L346.5 16.3L342 18.2L339.5 13.5L344.3 13.7L360.7 12.1L379.6 13.1L394.9 9.8L402.6 9.3L407.1 9.9L419.3 7.8L442.3 10.3L460.4 8.2L458.3 11.2L452.4 13L442.8 13.6L435.4 18L419.7 17.2L408.7 18.7L412.3 19.9L412.2 24.4L413.8 25.3L415.3 25.3L419.1 28.6L420.1 30.8L421.3 35.4L419.7 40.3L417.4 42.5L421.8 41.8L424.4 39.5L424 37.1L424.4 34.4L426.9 35.3L428.6 36.5L434.4 49.4L438.4 56.1L439.4 55.9L440.4 55.7L441.6 54.4L443.3 51.2L444.9 53.2L445.8 54L446.7 54.2L445.9 51.3L447 47.6L446.6 46.3L448.4 46.1L450.5 46.5L453.6 47.6L459 51.8L462.5 56.2L462.8 58.6L464.1 60L466.5 61.5L467.6 63.7L467.8 60.2L466.4 57.6L466.1 54.6L473.1 54.5L475 50.6L478.8 52.9L488.9 63.6L492.7 65.4L503.7 67.5L510.7 72.6L514.8 77.3L512.4 82.1L505.8 84.5L503.2 87.6L501.7 90.5L501.7 93.5L499.8 97L499.5 98.2L498.3 103.1L495.6 109L492 115.3L473.5 115.4L478.1 118L482.3 119.9L489.2 124.8L494.7 120.9L502.6 120.6L511.1 116.4L514.4 115.7L530.3 117.9L534.2 114.8L537.4 113.9L546 114.5L553.5 117.8L562.8 130L563 131.3L561.9 132.9L556.2 135.7L554.9 137.2L552.8 142.6L545.5 145.6L540.5 149.3L537.1 152.6L535.4 153.9L528.7 154.6L526.6 156.7L523.9 162.9L521.9 165.5L518.5 168.5L518.4 170.4L523.2 177.1L524.1 179.3L522.6 182.5L522.7 184.7L525.2 187.5L528.2 188.1L531.2 187L534.8 187.1L537.1 187.8L538.1 188.6L538.3 190.7L536.8 195.2L534.6 198L525.1 202.4L520.8 205L518.5 206.9L513.4 205.9L510.7 206L508.7 207.4L507.5 208.7L504 209L499.2 209.7L497.1 210.6L495.5 212.8L494.2 215.9L495.3 219.6L496.8 223L496.8 226L498 234.6L496.4 236.6L493.2 238.8L489.2 242.8L484.9 248.4L485.6 250L496 261.6L506.7 273.4L517.3 285.2L518.8 285.7L520.8 287.1L522.6 291.2L524.2 295.6L524.2 297.8L523 300.7L520.4 303.9L517.3 306.6L512.7 308.8L509.1 311L506.1 316.6L504.3 318.5L502.6 319.3L499.3 320.1L493.9 319.9L490.4 319.5L486 323.6L480.4 325.2L476.7 330.9L463.4 335.4L450.3 339L446.7 340.4L433.9 337.5L430.8 338.4L427.2 341.1L423.9 343.2L421.1 343.3L418.8 344.4L417.4 348.3L416.2 361.7L411.6 365.6L406 365.6L402.1 361L397.6 357.5L389.7 349.2L387.5 348.1L385.4 348.2L378.1 350.6L374.6 349.5L371.8 348.3L367.1 348.7L358.7 348.8L353.3 348.8L350.7 346.6L348.3 342L346.7 340.3L344.8 339L341.1 338.3L327.6 338.3L325.1 338L323.2 337.1L320.6 333.1L317.8 331.3L314.5 331.2L313 333.4L318.8 340.5L320.5 344.4L325.5 350L340.1 361.9L342.8 365.6L342.5 370.4L342.5 377.8L343 384.8L346.7 394.8L352 404.9L353.4 411.4L352.5 416.2L351.5 418.7L351.6 419.9L352.7 420.9L357.7 422.4L368.3 423.3L374.7 423.3L384.4 424.4L385.2 428L384.2 433.9L382.3 437.2L380.7 438.2L375.4 439L369.8 442.6L361.7 446.2L357 446.7L355.1 447.3L353.5 448.4L352.1 449.8L350.6 456.5L348.3 464L343.7 468.5L338.8 472.2L333.7 472.7L329.7 472.4L327.7 473.4L324.8 476.5L320.6 480.3L317.4 482.3L313.1 482.1L308.5 484L302.7 487.1L298.8 489.6L295.5 493.9L290.8 498.4L286 501.6L283.6 505.5L280.3 510.4L276.2 510.6L275.9 507.6L277.9 502.8L275.7 498.7L271.8 496.5L269.9 495.8L268.1 496.1L263.4 498.1L257.7 501.8L254.2 504.5L251 505.7L244.4 506.8L238.9 507.4L236.6 506.6L232.5 503.9L223 495.4L210.2 483.8L209.2 480.5L209.8 477.1L207.4 472.1L206.1 466.8L204.9 465L204.6 461L201.8 453.8L199.5 448L197.4 445L198.3 442.5L197.4 439.9L195.7 437.9L193.2 431.2L194.1 428.4L193.5 425.5L191.4 423.5L188.4 421.4L184.4 417L179.7 412.8L177.3 411.2L175.6 410.5L174.2 406.5L173.1 405.3L170.6 405L165.7 403.3L161 405.3L160.9 402.2L162.3 400.4L178.3 385.6L186.3 378.9L187.2 377.9L187.9 376.3L188.4 374.2L186.6 371.8L179.1 360.4L176.4 358.3L173.9 356.6L170.9 351.8L167.4 340.7L164.8 335.1L164.1 330.8L164.2 326L163.3 322.2L161.2 319.7L161.2 311.7L163.3 298.5L163.8 288.4L162.8 281.5L164.6 276.2L169.3 272.6L171.9 267.1L172.4 259.5L175.2 253.3L180.3 248.5L182 243.7L180.4 239L178.9 236L174.6 232.9L166.6 230.8L160 230.5L156.1 232.9L145.8 235.1L129.4 237.2L116.2 237.2L106.1 235.1L98.5 235.8L93.3 239.2L89.6 240L87.5 238.1L85.1 237.6L81.6 238.8L81 238.3L73.3 228.9L66.1 220.3L57.8 210L48.2 198.1L46.5 197.3L43.6 197.4L39.7 197.6L33.6 196.4L29.5 194.6L26.2 193L20.2 190.9L16.1 190.5L12.5 191.1L2.3 195.3L-3.4 195.7L-7.9 195.7L-19.9 193.7L-28 193.4L-37.6 194.7L-41.6 195.5L-47.3 193.4L-51.2 190.2L-54.8 182.5L-57.4 176.5L-61.8 175.3L-66.7 174.2L-69.1 172.3L-70.6 168.8L-70.9 164.3L-70.4 157.1L-70 154.5L-69.3 146.7L-66.6 142.6L-64.9 140.6L-65.2 137.4L-66.5 130.6L-67.8 125.9L-73.3 120.5L-80.3 113.6L-83.3 102.6L-86.8 89.6L-89.6 88.2L-92.2 88.9L-95 88.2L-97.5 83L-99.9 82L-103.8 83.9L-106.7 85.3L-113.8 86.6L-115.3 85.3L-114.8 83.7L-111.8 78.9L-108.2 72.8L-104.1 67.3L-100.2 61.6L-97.3 55.5L-95.4 43.5L-94 35.2L-90.5 20.4L-84 8.6L-81.5 3.2L-75.6 -3.9L-72.9 -7.7L-69.3 -10.7L-59.4 -14.8L-49.5 -35.1L-46.8 -38.3L-34.9 -41.3L-25.7 -43.7L-18.9 -46.2L-16.7 -47.5L-14.9 -48.1L-16.4 -45.7L-19.6 -42.8L-23.3 -40.9L-42.3 -36.4L-44.3 -35.4L-46.7 -33.5L-46.8 -29.1L-46.2 -25.7L-40.7 -14.5L-38.5 -11.8L-31 -5.7L-32.7 -4.8L-35.4 -4.7L-33.4 3.2L-28.8 8.7L-28.6 12.1L-32.1 22.8L-38.6 29.2L-43.1 36.6L-46.7 39.6L-54.5 54.2L-48.6 62.9L-47.7 67.3L-42.6 73.6L-39.2 75.7L-36.9 78.2L-38 82.5L-35.9 88.3L-33.2 91.4L-29.9 92.6L-25.7 92.6L-13.8 88.7L-11 87L-9.2 83.9L-3.2 77.6L-2.8 69.5L-1.5 59.7L-3 53.3L-9.3 44.3L-12 37.8L-18.2 31.8L-22 21.5L-23.6 18.3L-24.8 13.9L-26.1 6.1L-22 3.2L-22.4 -3.2L-12.1 -5L10.1 -15.4L23.8 -18.1L39.5 -23.6L43.1 -26.4L46.2 -31L48.7 -31.5L56.8 -27.2L60.9 -28.7L62.5 -32.1L60.2 -38.6L55.6 -38.6L41.5 -36.2L40.1 -39L40.1 -41.5L36.8 -49.3L38.8 -55.2L41 -59.9L45 -61.8L51 -63.9L55.5 -60.7L58.2 -57.7L59.7 -54.8L60.7 -46.8L63.1 -38.8L65.6 -38.5Z"
]

export function MapaVenezuelaSVG() {
  return (
    <div className="relative w-full aspect-[7/6] overflow-hidden bg-transparent">
      {/* El mapa SVG principal */}
      <svg
        viewBox="0 0 700 600"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Marcador de flecha roja y minimalista */}
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 2 L 8 5 L 0 8 z" fill="#dc2626" />
          </marker>

          {/* Gradiente sutil para la zona de sacudida */}
          <radialGradient id="shaking-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#ef4444" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Zona de sacudida sutil (terremotos) */}
        <circle cx="261.4" cy="108.8" r="90" fill="url(#shaking-grad)" />

        {/* 2. Dibujo de la tierra (Venezuela) en gris neutro */}
        <g className="fill-neutral-200 stroke-neutral-300 dark:fill-zinc-800 dark:stroke-zinc-700 transition-colors duration-300">
          {VENEZUELA_PATHS.map((path, idx) => (
            <path key={idx} d={path} strokeWidth="1.2" strokeLinejoin="round" />
          ))}
        </g>

        {/* 3. Ciudades de referencia (puntos grises discretos) */}
        {/* Maracaibo */}
        <g>
          <circle cx="98.0" cy="93.5" r="3.5" className="fill-neutral-400 dark:fill-zinc-600" />
          <text
            x="98.0"
            y="85"
            textAnchor="middle"
            className="font-mono text-[9px] fill-neutral-400 dark:fill-zinc-500"
          >
            Maracaibo
          </text>
        </g>

        {/* Caracas */}
        <g>
          <circle cx="334.9" cy="101.0" r="3.5" className="fill-neutral-400 dark:fill-zinc-600" />
          <text
            x="334.9"
            y="112"
            textAnchor="middle"
            className="font-mono text-[9px] fill-neutral-400 dark:fill-zinc-500"
          >
            Caracas
          </text>
        </g>

        {/* La Guaira (ciudad afectada - marcado en rojo sutil) */}
        <g>
          <circle cx="333.4" cy="94.9" r="4" fill="#dc2626" />
          <text
            x="385"
            y="72"
            textAnchor="middle"
            className="font-mono text-[9px] font-bold fill-crisis-red uppercase tracking-wider"
          >
            La Guaira
          </text>
          <text
            x="385"
            y="83"
            textAnchor="middle"
            className="font-mono text-[8px] fill-neutral-400 dark:fill-zinc-500"
          >
            (más afectada)
          </text>
          <path
            d="M 365 78 Q 350 82 338 91"
            fill="none"
            stroke="#dc2626"
            strokeWidth="1"
            strokeDasharray="2 2"
            markerEnd="url(#arrow)"
          />
        </g>

        {/* 4. Epicentros con ondas de expansión en rojo */}
        {/* Epicentro 1: San Felipe Yaracuy (M7.2) */}
        <g>
          <circle cx="242.8" cy="101.6" r="5" fill="#dc2626" />
          <circle cx="242.8" cy="101.6" r="5" fill="none" stroke="#dc2626" strokeWidth="1.5">
            <animate attributeName="r" values="5;25" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="242.8" cy="101.6" r="5" fill="none" stroke="#dc2626" strokeWidth="1">
            <animate attributeName="r" values="5;45" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.4s" begin="0.8s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Epicentro 2: Valencia (M7.5) */}
        <g>
          <circle cx="280.0" cy="115.9" r="5" fill="#dc2626" />
          <circle cx="280.0" cy="115.9" r="5" fill="none" stroke="#dc2626" strokeWidth="1.5">
            <animate attributeName="r" values="5;25" dur="2.4s" begin="0.3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.4s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="280.0" cy="115.9" r="5" fill="none" stroke="#dc2626" strokeWidth="1">
            <animate attributeName="r" values="5;45" dur="2.4s" begin="1.1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.4s" begin="1.1s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* 5. Señalizaciones de los Terremotos (Líneas finas rojas y etiquetas de texto) */}
        {/* Señalización Terremoto 1 (San Felipe) */}
        <g>
          <text
            x="140"
            y="55"
            textAnchor="middle"
            className="font-mono text-[9px] fill-neutral-600 dark:fill-zinc-400 font-semibold uppercase tracking-wider"
          >
            Primer Terremoto
          </text>
          <text
            x="140"
            y="70"
            textAnchor="middle"
            className="font-sans text-xs fill-crisis-red font-bold"
          >
            7,2 (Yaracuy)
          </text>
          {/* Línea indicativa */}
          <path
            d="M 175 65 Q 210 65 236 94"
            fill="none"
            stroke="#dc2626"
            strokeWidth="1"
            markerEnd="url(#arrow)"
          />
        </g>

        {/* Señalización Terremoto 2 (Valencia) */}
        <g>
          <text
            x="390"
            y="145"
            textAnchor="middle"
            className="font-mono text-[9px] fill-neutral-600 dark:fill-zinc-400 font-semibold uppercase tracking-wider"
          >
            Segundo Terremoto
          </text>
          <text
            x="390"
            y="160"
            textAnchor="middle"
            className="font-sans text-xs fill-crisis-red font-bold"
          >
            7,5 (Carabobo)
          </text>
          {/* Línea indicativa */}
          <path
            d="M 330 150 Q 295 150 286 126"
            fill="none"
            stroke="#dc2626"
            strokeWidth="1"
            markerEnd="url(#arrow)"
          />
        </g>
      </svg>
    </div>
  )
}
