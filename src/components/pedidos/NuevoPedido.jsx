import { useState } from 'react'
import { CheckCircle2, ShoppingBasket } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { dinero, precioReferencia } from '../../lib/dinero.js'
import { PRODUCTOS_RAPIDOS, USOS } from '../../data/semilla.js'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'
import Contador from '../ui/Contador.jsx'

function horas() {
  const lista = []
  for (let m = 5 * 60; m <= 15 * 60 + 30; m += 30) {
    const h = Math.floor(m / 60)
    const min = String(m % 60).padStart(2, '0')
    lista.push(`${h > 12 ? h - 12 : h}:${min} ${h >= 12 ? 'p. m.' : 'a. m.'}`)
  }
  return lista
}
const HORAS = horas()

const campo = 'min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base'

export default function NuevoPedido() {
  const { ciudad, crearPedido } = useApp()
  const [f, setF] = useState({ producto: '', kg: 5, hora: HORAS[2], dia: 'hoy', presupuestoKg: 0, uso: 'Guiso', cocino: '' })
  const [hecho, setHecho] = useState(null)
  const poner = (c) => setF((x) => ({ ...x, ...c }))

  const elegirProducto = (p) =>
    poner({ producto: p.nombre, uso: p.uso, presupuestoKg: Math.round(precioReferencia(p.precio, ciudad.id) * 0.7) })
  const valido = f.producto.trim().length >= 2 && f.presupuestoKg > 0

  const enviar = (e) => {
    e.preventDefault()
    if (!valido) return
    setHecho(crearPedido({ ...f, producto: f.producto.trim(), cocino: f.cocino.trim() }))
    setF((x) => ({ ...x, producto: '', cocino: '', presupuestoKg: 0 }))
  }

  return (
    <Card className="space-y-4">
      {hecho && (
        <p className="flex items-start gap-2 rounded-xl border border-[#BCD8C5] bg-[#E7F1EA] p-3 text-base font-semibold text-olla" role="status">
          <CheckCircle2 size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
          Listo, tu encargo de {hecho.kg} kg de {hecho.producto} ya lo ven los puestos. Abajo te salen las respuestas.
        </p>
      )}
      <form onSubmit={enviar} className="space-y-4">
        <div>
          <label htmlFor="cocino" className="mb-1 block text-base font-bold">¿Qué vas a cocinar? (opcional)</label>
          <input id="cocino" className={campo} value={f.cocino} onChange={(e) => poner({ cocino: e.target.value })} placeholder="Ej: sancocho pa' 40 almuerzos" />
        </div>

        <div>
          <p className="mb-2 text-base font-bold">¿Qué necesitas?</p>
          <div className="mb-2 flex flex-wrap gap-2">
            {PRODUCTOS_RAPIDOS.map((p) => (
              <Chip key={p.nombre} activo={f.producto === p.nombre} onClick={() => elegirProducto(p)}>{p.nombre}</Chip>
            ))}
          </div>
          <input className={campo} value={f.producto} onChange={(e) => poner({ producto: e.target.value })} placeholder="O escribe otro producto" aria-label="Producto que necesitas" />
        </div>

        <div>
          <p className="mb-2 text-base font-bold">¿Cuántos kilos?</p>
          <Contador valor={f.kg} onChange={(v) => poner({ kg: v })} max={300} etiqueta="Kilos que necesitas" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="hora" className="mb-1 block text-base font-bold">Hora de recogida</label>
            <select id="hora" className={campo} value={f.hora} onChange={(e) => poner({ hora: e.target.value })}>
              {HORAS.map((h) => <option key={h}>{h}</option>)}
            </select>
            <div className="mt-2 flex gap-2">
              <Chip activo={f.dia === 'hoy'} onClick={() => poner({ dia: 'hoy' })}>Hoy</Chip>
              <Chip activo={f.dia === 'mañana'} onClick={() => poner({ dia: 'mañana' })}>Mañana</Chip>
            </div>
          </div>
          <div>
            <label htmlFor="pres" className="mb-1 block text-base font-bold">Presupuesto por kilo</label>
            <input id="pres" type="number" inputMode="numeric" min="1" className={campo} value={f.presupuestoKg || ''} onChange={(e) => poner({ presupuestoKg: Number(e.target.value) })} placeholder="¿Cuánto pagarías?" />
            {f.presupuestoKg > 0 && <p className="mt-1 text-base text-piedra">Total aprox. {dinero(f.presupuestoKg * f.kg, ciudad.id)}</p>}
          </div>
        </div>

        <div>
          <p className="mb-2 text-base font-bold">¿Pa' qué lo usas?</p>
          <div className="flex flex-wrap gap-2">
            {USOS.map((u) => <Chip key={u} activo={f.uso === u} onClick={() => poner({ uso: u })}>{u}</Chip>)}
          </div>
        </div>

        <Button type="submit" className="w-full" icono={ShoppingBasket} disabled={!valido}>
          Encargar temprano
        </Button>
        <p className="text-base text-piedra">Pagas en efectivo cuando revises la comida. No se cobra nada ahora.</p>
      </form>
    </Card>
  )
}
