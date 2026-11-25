import { Clock, Zap } from 'lucide-react'
import { estadoPuesto, horarioDe, ventanaUltimaHora } from '../../lib/horarioPuesto.js'
import Pill from '../ui/Pill.jsx'

// Horario del puesto + "Abierto ahora / Cerrado" con la hora real. Con ultimaHora, muestra también su ventana de rescate (2 h antes del cierre).
export default function HorarioPuesto({ puesto, ahora = Date.now(), ultimaHora = false, compacto = false }) {
  const h = horarioDe(puesto)
  const e = estadoPuesto(puesto, ahora)
  const v = ventanaUltimaHora(puesto, ahora)
  return (
    <div className="space-y-1.5" data-testid="horario-puesto">
      <p className="flex flex-wrap items-center gap-2 text-base">
        <Clock size={compacto ? 16 : 20} className="shrink-0 text-olla" aria-hidden="true" />
        <span data-testid="horario-texto-puesto">{h.texto}</span>
        <Pill tono={e.abierto ? 'olla' : 'neutro'}>{e.texto}</Pill>
      </p>
      {!e.abierto && e.proxima && !compacto && <p className="text-sm text-piedra">{e.proxima}</p>}
      {ultimaHora && (
        <p className="flex flex-wrap items-center gap-2 text-sm text-piedra" data-testid="ventana-ultima-hora">
          <Zap size={16} className="shrink-0 text-tomate" aria-hidden="true" />
          Última hora: <b className="text-carbon">{v.texto}</b>
          {v.activa && <Pill tono="tomate">Activa ahora</Pill>}
        </p>
      )}
    </div>
  )
}
