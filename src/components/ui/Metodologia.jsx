import { Info } from 'lucide-react'

// Desplegable de transparencia: separa lo que es dato de campo, lo que es simulación y lo que es proyección.
export default function Metodologia({ className = '' }) {
  return (
    <details className={`group rounded-2xl border border-borde bg-white ${className}`}>
      <summary className="flex min-h-[48px] cursor-pointer items-center gap-2 px-4 text-base font-bold text-olla list-none [&::-webkit-details-marker]:hidden">
        <Info size={20} className="shrink-0" aria-hidden="true" />
        Metodología y alcance del prototipo
      </summary>
      <ul className="space-y-3 border-t border-borde px-4 py-3 text-base">
        <li>
          <b className="text-olla">Datos de campo.</b> Salen de 6 entrevistas reales en Barranquilla (22 de noviembre de 2026): el problema, los kilos que se botan y las condiciones de los vendedores.
        </li>
        <li>
          <b className="text-ambar">Simulación operativa.</b> Los puestos, lotes, pedidos, chats y cifras que ves se guardan en el <i>localStorage</i> de este navegador pa' demostrar la app funcionando completa. No hay servidor ni personas reales detrás.
        </li>
        <li>
          <b className="text-tomate">Proyecciones.</b> Las metas de ingresos, el punto de equilibrio y el CO₂e son cálculos económicos y estadísticos con supuestos declarados. No son resultados medidos.
        </li>
      </ul>
    </details>
  )
}
