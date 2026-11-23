import { useState } from 'react'
import { FileDown, Loader2, PackageOpen } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { dinero } from '../../lib/dinero.js'
import { PLANES, resumenSemana } from '../../lib/economia.js'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import Pill from '../ui/Pill.jsx'
import Metodologia from '../ui/Metodologia.jsx'

function Cifra({ valor, etiqueta }) {
  return (
    <div className="rounded-2xl border border-borde bg-white p-3">
      <p className="font-titulo text-2xl font-extrabold leading-none text-olla sm:text-3xl">{valor}</p>
      <p className="mt-2 text-sm font-semibold leading-tight text-piedra">{etiqueta}</p>
    </div>
  )
}

function Barra({ etiqueta, valor, max, color }) {
  const pct = max > 0 ? Math.max(valor > 0 ? 4 : 0, Math.round((valor / max) * 100)) : 0
  return (
    <div>
      <div className="mb-1 flex justify-between text-base font-semibold">
        <span>{etiqueta}</span>
        <span>{dinero(valor)}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-stone-200" role="presentation">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// Cifras reales: parten en $0 y suben solas con cada entrega confirmada ("Lo revisé y me lo llevo").
export default function PanelEconomico() {
  const { usuario, apartados, modo, miPuesto, devoluciones } = useApp()
  const [bajando, setBajando] = useState(false)
  const vendedor = modo === 'vendedor'
  const plan = miPuesto?.plan ?? 'popular'
  const r = resumenSemana(apartados, usuario.id, vendedor, plan, Date.now(), devoluciones)
  const maximo = Math.max(r.ingresos, r.cuota)

  const descargar = async () => {
    setBajando(true)
    try {
      const { descargarReporte } = await import('../../lib/reportePdf.js')
      await descargarReporte({
        vendedor, nombre: usuario.nombre, puesto: miPuesto?.nombre ?? usuario.negocio, plan,
        planTexto: `${PLANES[plan].nombre} (${PLANES[plan].precio})`, resumen: r,
      })
    } finally {
      setBajando(false)
    }
  }

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl">{vendedor ? 'Tu semana en la plaza' : 'Tu semana de compras'}</h2>
        {vendedor && <Pill tono={plan === 'formal' ? 'frio' : 'ambar'}>{PLANES[plan].nombre}</Pill>}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {vendedor ? (
          <>
            <Cifra valor={`${String(r.kilos).replace('.', ',')} kg`} etiqueta="Kilos rescatados" />
            <Cifra valor={dinero(r.ingresos)} etiqueta="Plata recuperada" />
            <Cifra valor={r.entregas.length} etiqueta="Entregas completadas" />
          </>
        ) : (
          <>
            <Cifra valor={`${String(r.kilos).replace('.', ',')} kg`} etiqueta="Kilos comprados" />
            <Cifra valor={dinero(r.ahorro)} etiqueta="Plata ahorrada" />
            <Cifra valor={r.entregas.length} etiqueta="Compras completadas" />
          </>
        )}
      </div>

      {r.entregas.length === 0 ? (
        <div className="flex items-start gap-3 rounded-xl border border-[#BCD8C5] bg-[#F4F9F5] p-4">
          <PackageOpen size={24} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
          <p className="text-base">
            {vendedor
              ? 'Tu balance arranca en $0. Apenas confirmes tu primera entrega, aquí suman tus kilos y tu plata, en vivo.'
              : 'Tu cuenta arranca en 0. Cuando revises y te lleves tu primer lote, aquí ves cuánto ahorraste.'}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-borde" aria-label="Detalle de la semana">
          {r.entregas.slice(0, 5).map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 py-2 text-base">
              <span>
                <b>{a.producto}</b> · {a.cantidad} {a.unidad}
                <span className="block text-sm text-piedra">{vendedor ? a.comprador.nombre : a.puesto}</span>
              </span>
              <b>{dinero(a.total)}</b>
            </li>
          ))}
        </ul>
      )}

      {vendedor && (
        <div className="space-y-3 rounded-2xl border border-borde bg-marfil p-4">
          <p className="text-lg font-bold">Ganado vs. cuota</p>
          <Barra etiqueta="Lo que ganaste" valor={r.ingresos} max={maximo} color="bg-olla" />
          <Barra etiqueta="Tu cuota de la semana" valor={r.cuota} max={maximo} color="bg-ambar" />
          <p className="text-base">
            Te quedan <b className="text-olla">{dinero(r.balance)}</b>
            {r.devuelto > 0 && <> (ya descontamos {dinero(r.devuelto)} en devoluciones a compradores)</>}
            {r.cuotaDevuelta > 0 && <> (incluye {dinero(r.cuotaDevuelta)} de cuota devuelta)</>}
            {r.roi ? <> · por cada $1 de cuota recuperaste ${String(r.roi).replace('.', ',')}.</> : '.'}
          </p>
          <p className="text-sm text-piedra">
            {plan === 'formal'
              ? 'Plan Formal: $10.000 COP/sem. La cuota ajusta de forma progresiva entre 5% y 10% solo después de superar 100 ventas por semana.'
              : 'Plan Popular: de $0 a $3.000 COP/sem, según lo que recuperes (5%, con tope de $3.000).'}{' '}
            La cuota corre desde tu primera entrega.
          </p>
        </div>
      )}

      <Button icono={bajando ? Loader2 : FileDown} className="w-full" onClick={descargar} disabled={bajando}>
        {bajando ? 'Armando tu PDF…' : 'Descargar reporte semanal (PDF)'}
      </Button>
      <Metodologia />
    </Card>
  )
}
