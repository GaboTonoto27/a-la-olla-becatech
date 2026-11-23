import { cant } from '../../lib/unidades.js'
import { BadgeCheck, ShieldCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { dinero } from '../../lib/dinero.js'
import Button from '../ui/Button.jsx'
import Pill from '../ui/Pill.jsx'
import Card from '../ui/Card.jsx'
import BotonChat from '../chat/BotonChat.jsx'

// El vendedor ve quién aparta (perfil claro) pa' no descuidar la caja.
export default function ApartadoVendedor({ a }) {
  const { actualizarApartado, usuario } = useApp()
  const c = a.comprador
  const confirmado = a.estado === 'confirmado'
  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-titulo text-2xl font-extrabold">{a.codigo}</p>
          <p className="text-base">
            {cant(a.cantidad, a.unidad)} de {a.producto} · {dinero(a.total, a.ciudad)} en efectivo
          </p>
        </div>
        {confirmado && <Pill tono="olla">Confirmado</Pill>}
      </div>
      <div className="rounded-xl border border-borde bg-marfil p-3">
        <p className="flex items-center gap-2 font-bold">
          <ShieldCheck size={18} className="text-olla" aria-hidden="true" /> {c.nombre}
        </p>
        <p className="text-base text-piedra">
          {c.tipo} · {c.compras} compras verificadas · {c.rechazos} {c.rechazos === 1 ? 'rechazo' : 'rechazos'}
        </p>
        <p className="text-base text-piedra">Paga en efectivo al revisar.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {!confirmado && (
          <Button icono={BadgeCheck} onClick={() => actualizarApartado(a.id, 'confirmado')}>
            Confirmar apartado
          </Button>
        )}
        <Button variante="contorno" onClick={() => actualizarApartado(a.id, 'cancelado')}>
          Ya no lo tengo
        </Button>
        <BotonChat vendedorId={usuario.id} compradorId={c.id} contexto={`${a.codigo} · ${cant(a.cantidad, a.unidad)} de ${a.producto}`} className="sm:col-span-2">
          Escribir al comprador
        </BotonChat>
      </div>
    </Card>
  )
}
