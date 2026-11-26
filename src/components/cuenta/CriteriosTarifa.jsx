import { ChevronDown } from 'lucide-react'

const REGLAS = [
  { n: 'Plan Formal · $10.000/sem', t: 'Local fijo bajo techo y con refrigeración comercial (cuarto frío o neveras de negocio).' },
  { n: 'Popular concurrido · $3.000/sem', t: 'Puesto popular muy conocido o con mucha clientela.' },
  { n: 'Popular estándar · $1.500/sem', t: 'Puesto pequeño, familiar o al ambiente.' },
  { n: 'Popular solidario · $0/sem', t: 'Tramo solidario: el equipo lo asigna cuando tus ventas aún no alcanzan pa’ cubrir una cuota.' },
]

// Las 4 reglas objetivas con las que el equipo asigna la tarifa semanal.
export default function CriteriosTarifa() {
  return (
    <details className="group rounded-2xl border border-borde bg-white" data-testid="criterios-tarifa">
      <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-2 px-4 py-2 text-base font-bold text-olla [&::-webkit-details-marker]:hidden">
        ¿Cómo definimos tu tarifa semanal?
        <ChevronDown size={20} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <ul className="divide-y divide-borde border-t border-borde px-4">
        {REGLAS.map((r) => (
          <li key={r.n} className="py-2 text-base"><b>{r.n}</b><span className="block text-piedra">{r.t}</span></li>
        ))}
      </ul>
    </details>
  )
}
