import { useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { ESTADOS, etiquetaTipo, totalesDevueltos } from '../../lib/devoluciones.js'
import { dinero } from '../../lib/dinero.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Pill from '../../components/ui/Pill.jsx'

const cuando = (t) => new Date(t).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

function Solicitud({ d }) {
  const { resolverDevolucion } = useApp()
  const [nota, setNota] = useState('')
  const pendiente = d.estado === 'solicitado'
  const e = ESTADOS[d.estado]

  return (
    <Card className={`space-y-3 ${pendiente ? '' : 'opacity-90'}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Pill tono={e.tono}>{e.etiqueta}</Pill>
        <Pill>{d.clase === 'cuota' ? 'Cuota del vendedor' : 'Compra'}</Pill>
        {!d.leida && <Pill tono="tomate">Nueva</Pill>}
        <span className="ml-auto text-sm text-piedra">{cuando(d.creado)}</span>
      </div>
      <div>
        <h3 className="text-xl">{etiquetaTipo(d)} · {dinero(d.monto)}</h3>
        <p className="text-sm text-piedra">
          De {d.autorNombre}{d.puesto ? ` · ${d.puesto}` : ''}{d.codigo ? ` · ${d.codigo}` : ''} · {d.producto}
        </p>
      </div>
      <p className="text-base">“{d.motivo}”</p>

      {pendiente ? (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-piedra">
            Nota pa' la persona (obligatoria si rechazas)
            <textarea rows={2} value={nota} maxLength={300} onChange={(ev) => setNota(ev.target.value)} className="mt-1 w-full rounded-xl border border-borde bg-white p-3 text-base" />
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button icono={CheckCircle2} onClick={() => resolverDevolucion(d.id, 'aprobado', nota)}>Aprobar</Button>
            <Button variante="contorno" icono={XCircle} disabled={nota.trim().length < 3} onClick={() => resolverDevolucion(d.id, 'rechazado', nota)}>Rechazar</Button>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-borde bg-marfil p-3 text-base">Nota: “{d.nota}” · {cuando(d.resueltoEn)}</p>
      )}
    </Card>
  )
}

export default function TabReembolsos() {
  const { devoluciones } = useApp()
  const t = totalesDevueltos(devoluciones)
  const lista = [...devoluciones].sort((a, b) => (a.estado !== 'solicitado') - (b.estado !== 'solicitado') || b.creado - a.creado)

  return (
    <section className="space-y-3" aria-label="Reembolsos y devoluciones">
      <h2 className="text-2xl">Reembolsos y Devoluciones</h2>
      <p className="text-base text-piedra">Aprueba o rechaza con una nota clara: la persona la ve en su cuenta al instante. Lo aprobado se descuenta de los totales económicos.</p>

      <div className="grid grid-cols-3 gap-2">
        {[
          [t.pendientes, 'Por revisar'],
          [dinero(t.compras), 'Devuelto a compradores'],
          [dinero(t.cuotas + t.saldos), 'Cuotas devueltas'],
        ].map(([v, k]) => (
          <div key={k} className="rounded-2xl border border-borde bg-white p-3">
            <p className="font-titulo text-xl font-extrabold leading-none text-olla sm:text-2xl">{v}</p>
            <p className="mt-2 text-sm font-semibold leading-tight text-piedra">{k}</p>
          </div>
        ))}
      </div>

      {lista.length === 0 ? (
        <Card><p className="text-base text-piedra">No hay solicitudes. Cuando un comprador o un vendedor pida una devolución, aparece aquí.</p></Card>
      ) : (
        lista.map((d) => <Solicitud key={d.id} d={d} />)
      )}
    </section>
  )
}
