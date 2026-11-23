import { Ticket } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { dinero } from '../../lib/dinero.js'
import Button from '../ui/Button.jsx'
import Pill from '../ui/Pill.jsx'
import Card from '../ui/Card.jsx'

const ESTADO = {
  apartado: { tono: 'ambar', texto: 'Esperando que el puesto confirme' },
  confirmado: { tono: 'olla', texto: "Listo pa' recoger" },
  entregado: { tono: 'olla', texto: 'Recogido y pagado' },
  rechazado: { tono: 'tomate', texto: 'Rechazado por calidad' },
  cancelado: { tono: 'neutro', texto: 'Cancelado' },
}

export default function ApartadoComprador({ a }) {
  const { actualizarApartado } = useApp()
  const activo = a.estado === 'apartado' || a.estado === 'confirmado'
  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-2 font-titulo text-2xl font-extrabold">
            <Ticket size={22} className="text-olla" aria-hidden="true" /> {a.codigo}
          </p>
          <p className="text-base">
            {a.cantidad} {a.unidad} de {a.producto} · {a.puesto}
          </p>
          <p className="text-base text-piedra">
            Barrio {a.barrio} · pagas {dinero(a.total, a.ciudad)} en efectivo
          </p>
        </div>
        <Pill tono={ESTADO[a.estado].tono}>{ESTADO[a.estado].texto}</Pill>
      </div>
      {activo && (
        <div className="grid gap-2 sm:grid-cols-2">
          <Button onClick={() => actualizarApartado(a.id, 'entregado')}>Lo revisé y me lo llevo</Button>
          <Button variante="contorno" onClick={() => actualizarApartado(a.id, 'rechazado')}>
            Rechazar por calidad
          </Button>
          <button
            type="button"
            onClick={() => actualizarApartado(a.id, 'cancelado')}
            className="min-h-[48px] text-base font-semibold text-piedra underline sm:col-span-2"
          >
            Ya no lo quiero (cancelar)
          </button>
        </div>
      )}
    </Card>
  )
}
