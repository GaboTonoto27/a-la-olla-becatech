import { useState } from 'react'
import { ReceiptText, ShieldCheck, Undo2 } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { ESTADOS, devolucionDeCompra, etiquetaTipo, puedeSolicitarCompra } from '../../lib/devoluciones.js'
import { dinero } from '../../lib/dinero.js'
import { resumenSemana } from '../../lib/economia.js'
import Card from '../ui/Card.jsx'
import Pill from '../ui/Pill.jsx'
import Button from '../ui/Button.jsx'
import SolicitarDevolucionModal from './SolicitarDevolucionModal.jsx'

const cuando = (t) => new Date(t).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })

function Estado({ d }) {
  const e = ESTADOS[d.estado]
  return (
    <div className="space-y-1">
      <Pill tono={e.tono}>{e.etiqueta}</Pill>
      {d.nota && <p className="text-sm text-piedra">Nota de la coordinación: “{d.nota}”</p>}
    </div>
  )
}

// Comprador: cada compra completada tiene su botón discreto de devolución y su estado en vivo.
export function MisCompras() {
  const { usuario, apartados, devoluciones } = useApp()
  const [abierta, setAbierta] = useState(null)
  const compras = apartados
    .filter((a) => a.estado === 'entregado' && a.comprador.id === usuario.id)
    .sort((a, b) => (b.actualizado ?? b.creado) - (a.actualizado ?? a.creado))
    .slice(0, 8)

  return (
    <Card className="space-y-3">
      <h2 className="flex items-center gap-2 text-2xl"><ReceiptText size={24} className="text-olla" aria-hidden="true" /> Mis compras</h2>
      {compras.length === 0 ? (
        <p className="text-base text-piedra">Cuando te lleves tu primer lote, aparece aquí. Si algo salió mal después de recogerlo, desde aquí pides tu devolución.</p>
      ) : (
        <ul className="divide-y divide-borde">
          {compras.map((a) => {
            const d = devolucionDeCompra(devoluciones, a.id)
            return (
              <li key={a.id} className="space-y-2 py-3">
                <div className="flex items-start justify-between gap-3 text-base">
                  <span>
                    <b>{a.producto}</b> · {a.cantidad} {a.unidad}
                    <span className="block text-sm text-piedra">{a.puesto} · {cuando(a.actualizado ?? a.creado)}</span>
                  </span>
                  <b>{dinero(a.total)}</b>
                </div>
                {d && (
                  <div className="rounded-xl border border-borde bg-marfil p-3">
                    <p className="mb-1 text-sm font-semibold text-piedra">{etiquetaTipo(d)}</p>
                    <Estado d={d} />
                  </div>
                )}
                {puedeSolicitarCompra(devoluciones, a.id) && (
                  <button type="button" onClick={() => setAbierta(a)} className="flex min-h-[48px] items-center gap-2 text-base font-semibold text-piedra underline">
                    <Undo2 size={18} aria-hidden="true" /> Solicitar devolución / reembolso
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
      {abierta && <SolicitarDevolucionModal clase="compra" apartado={abierta} onCerrar={() => setAbierta(null)} />}
    </Card>
  )
}

// Vendedor: pide reembolso o saldo a favor de su cuota semanal si hubo falla o fuerza mayor.
export function GarantiaCuota() {
  const { usuario, apartados, devoluciones, miPuesto } = useApp()
  const [abierta, setAbierta] = useState(false)
  const plan = miPuesto?.plan ?? 'popular'
  const r = resumenSemana(apartados, usuario.id, true, plan, Date.now(), devoluciones)
  const mias = devoluciones.filter((d) => d.clase === 'cuota' && d.autorId === usuario.id)
  const enCurso = mias.some((d) => d.estado === 'solicitado')
  const maximo = Math.max(0, r.cuota - r.cuotaDevuelta - r.saldoFavor) // lo que aún se puede reclamar de la cuota

  return (
    <Card className="space-y-3">
      <div className="flex items-start gap-3">
        <ShieldCheck size={24} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
        <div>
          <h2 className="text-2xl">Garantía y devolución de cuota</h2>
          <p className="text-base text-piedra">Si se te dañó la nevera, hubo un cierre o algo fuera de tu control, pide que te devuelvan parte de la cuota de la semana.</p>
        </div>
      </div>

      {(r.cuotaDevuelta > 0 || r.saldoFavor > 0) && (
        <ul className="divide-y divide-borde rounded-xl border border-[#BCD8C5] bg-[#F4F9F5] px-3 text-base">
          {r.cuotaDevuelta > 0 && <li className="flex justify-between py-2"><span>Cuota devuelta</span><b className="text-olla">{dinero(r.cuotaDevuelta)}</b></li>}
          {r.saldoFavor > 0 && <li className="flex justify-between py-2"><span>Saldo a favor pa' tu próxima cuota</span><b className="text-olla">{dinero(r.saldoFavor)}</b></li>}
        </ul>
      )}

      {mias.length > 0 && (
        <ul className="space-y-2" aria-label="Tus solicitudes de cuota">
          {mias.slice(0, 4).map((d) => (
            <li key={d.id} className="space-y-1 rounded-xl border border-borde bg-marfil p-3">
              <p className="text-base"><b>{etiquetaTipo(d)}</b> · {dinero(d.monto)} <span className="text-sm text-piedra">({cuando(d.creado)})</span></p>
              <Estado d={d} />
            </li>
          ))}
        </ul>
      )}

      {maximo <= 0 ? (
        <p className="text-sm text-piedra">Aún no tienes cuota por reclamar: corre desde tu primera entrega confirmada.</p>
      ) : (
        <Button variante="contorno" icono={Undo2} className="w-full" disabled={enCurso} onClick={() => setAbierta(true)}>
          {enCurso ? 'Tu solicitud está en revisión' : 'Pedir devolución de cuota'}
        </Button>
      )}
      {abierta && <SolicitarDevolucionModal clase="cuota" montoMax={maximo} puestoNombre={miPuesto?.nombre ?? usuario.negocio} onCerrar={() => setAbierta(false)} />}
    </Card>
  )
}
