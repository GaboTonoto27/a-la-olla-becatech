import { useMemo } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { dinero } from '../../lib/dinero.js'
import { totalesDevueltos } from '../../lib/devoluciones.js'
import { tarifaDe } from '../../lib/planPuesto.js'
import { COSTOS_MES, COSTO_TOTAL_MES, CUOTA_FORMAL, META_PUESTOS, PROMEDIO_POPULAR, bolsasDe, kilosDe, sostenibilidad, textoRescate } from '../../lib/economia.js'
import Card from '../../components/ui/Card.jsx'
import Pill from '../../components/ui/Pill.jsx'
import Metodologia from '../../components/ui/Metodologia.jsx'

function Cifra({ valor, etiqueta }) {
  return (
    <Card className="p-3 sm:p-4">
      <p className="font-titulo text-3xl font-extrabold leading-none text-olla sm:text-4xl">{valor}</p>
      <p className="mt-2 text-sm font-semibold leading-tight text-piedra sm:text-base">{etiqueta}</p>
    </Card>
  )
}

function Linea({ k, v, fuerte, tono }) {
  return (
    <li className={`flex items-center justify-between gap-3 py-2 text-base ${fuerte ? 'font-bold' : ''}`}>
      <span>{k}</span>
      <span className={tono === 'mal' ? 'text-[#A8391B]' : tono === 'bien' ? 'text-olla' : ''}>{v}</span>
    </li>
  )
}

export default function TabResumen() {
  const { apartados, puestos, lotes, cuentas, devoluciones, ciudad } = useApp()
  const dev = useMemo(() => totalesDevueltos(devoluciones), [devoluciones])
  const datos = useMemo(() => {
    const entregas = apartados.filter((a) => a.estado === 'entregado')
    const kg = entregas.reduce((s, a) => s + kilosDe(a.unidad, a.cantidad), 0)
    const bolsas = entregas.reduce((s, a) => s + bolsasDe(a.unidad, a.cantidad), 0)
    const cop = entregas.reduce((s, a) => s + a.total, 0) - dev.compras
    const activos = puestos.filter((p) => p.tipo === 'puesto' && p.ciudad === ciudad.id) // solo el piloto (Barranquilla)
    const formales = activos.filter((p) => p.plan === 'formal').length
    const populares = activos.length - formales
    const semanaReal = activos.reduce((s, p) => s + tarifaDe(p), 0) // cuotas asignadas por el equipo
    return { entregas: entregas.length, kg, bolsas, cop, activos: activos.length, formales, populares, semanaReal }
  }, [apartados, puestos, dev.compras, ciudad.id])

  const hoy = sostenibilidad(datos.formales, datos.populares, datos.semanaReal)
  const cuotasDevueltas = dev.cuotas + dev.saldos
  const resultadoHoy = hoy.neto - cuotasDevueltas
  // Meta: los ~35 puestos de frutas y verduras de la plaza, con la misma mezcla formal/popular de hoy.
  const total = Math.max(1, datos.activos)
  const metaFormales = Math.round(META_PUESTOS * (datos.formales / total || 0.6))
  const meta = sostenibilidad(metaFormales, META_PUESTOS - metaFormales)
  const margen = meta.mes > 0 ? Math.round((meta.neto / meta.mes) * 100) : 0
  const avance = Math.min(100, Math.round((datos.formales / hoy.equilibrio) * 100))

  return (
    <div className="space-y-5">
      <Metodologia />
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Cifras globales">
        <Cifra valor={textoRescate(Math.round(datos.kg * 10) / 10, datos.bolsas)} etiqueta="Rescatado" />
        <Cifra valor={dinero(datos.cop)} etiqueta="Plata recuperada (COP)" />
        <Cifra valor={datos.activos} etiqueta="Puestos activos" />
        <Cifra valor={datos.entregas} etiqueta="Entregas completadas" />
      </section>
      {(dev.compras > 0 || cuotasDevueltas > 0) && (
        <p className="text-base text-piedra">
          Ya descontamos los reembolsos aprobados: {dinero(dev.compras)} a compradores y {dinero(cuotasDevueltas)} de cuotas devueltas.
        </p>
      )}
      <p className="text-base text-piedra">
        Además hay {lotes.filter((l) => !l.retirado && l.vence > Date.now() && l.cantidad > 0).length} lotes en vitrina y {cuentas.filter((c) => c.rol !== 'admin').length} cuentas registradas.
      </p>

      <Card className="space-y-4">
        <div>
          <h2 className="text-2xl">Autosostenibilidad de la Plataforma</h2>
          <p className="text-base font-bold text-olla">0% subsidios ni financiación externa</p>
          <p className="mt-1 text-base text-piedra">
            Todo se paga con las cuotas de los puestos: Formal ${new Intl.NumberFormat('es-CO').format(CUOTA_FORMAL)}/sem y Popular entre $0 y $3.000/sem (usamos ${new Intl.NumberFormat('es-CO').format(PROMEDIO_POPULAR)} de promedio).
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-1 text-xl">Hoy: {datos.formales} formales y {datos.populares} populares</h3>
            <ul className="divide-y divide-borde">
              <Linea k="Ingresos por semana (cuotas asignadas)" v={dinero(hoy.semana)} />
              <Linea k="Ingresos por mes" v={dinero(hoy.mes)} />
              <Linea k="Costos fijos por mes" v={`− ${dinero(COSTO_TOTAL_MES)}`} />
              {cuotasDevueltas > 0 && <Linea k="Cuotas devueltas (aprobadas)" v={`− ${dinero(cuotasDevueltas)}`} />}
              <Linea k="Resultado del mes" v={`${resultadoHoy >= 0 ? '' : '− '}${dinero(Math.abs(resultadoHoy))}`} fuerte tono={resultadoHoy >= 0 ? 'bien' : 'mal'} />
            </ul>
          </div>
          <div>
            <h3 className="mb-1 text-xl">Meta: {META_PUESTOS} puestos de la plaza</h3>
            <ul className="divide-y divide-borde">
              <Linea k="Ingresos por mes" v={dinero(meta.mes)} />
              <Linea k="Costos fijos por mes" v={`− ${dinero(COSTO_TOTAL_MES)}`} />
              <Linea k="Margen neto del mes" v={`${dinero(meta.neto)} (${margen}%)`} fuerte tono={meta.neto >= 0 ? 'bien' : 'mal'} />
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-borde bg-marfil p-4">
          <p className="mb-2 flex flex-wrap items-center gap-2 text-lg font-bold">
            Punto de equilibrio: {hoy.equilibrio} puestos formales
            <Pill tono={hoy.neto >= 0 ? 'olla' : 'ambar'}>{hoy.neto >= 0 ? 'Superado' : `Faltan ${Math.max(0, hoy.equilibrio - datos.formales)}`}</Pill>
          </p>
          <div className="h-3 overflow-hidden rounded-full bg-stone-200" role="presentation">
            <div className="h-full rounded-full bg-olla" style={{ width: `${avance}%` }} />
          </div>
          <p className="mt-2 text-sm text-piedra">Con {hoy.equilibrio} puestos formales (o su equivalente en populares) la plataforma cubre sus costos sin ayuda de nadie.</p>
        </div>

        <details>
          <summary className="min-h-[48px] cursor-pointer text-base font-bold text-olla">Ver los costos fijos mínimos del mes</summary>
          <ul className="divide-y divide-borde">
            {COSTOS_MES.map((c) => <Linea key={c.id} k={c.etiqueta} v={dinero(c.valor)} />)}
            <Linea k="Total" v={dinero(COSTO_TOTAL_MES)} fuerte />
          </ul>
        </details>
      </Card>
    </div>
  )
}
