import { useMemo, useState } from 'react'
import { Leaf, SlidersHorizontal } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { dinero } from '../../lib/dinero.js'
import { FACTOR_CO2E, FRANJAS_TARDE, FRANJAS_TEMPRANAS, actividadPorHora, economiaCircular, escenario, kpis } from '../../lib/analitica.js'
import Card from '../../components/ui/Card.jsx'
import Metodologia from '../../components/ui/Metodologia.jsx'

const num = (n, d = 1) => new Intl.NumberFormat('es-CO', { maximumFractionDigits: d }).format(n)
const porc = (v) => (v === null ? 'Sin datos' : `${v}%`)

function Kpi({ valor, etiqueta, ayuda }) {
  return (
    <Card className="p-3 sm:p-4">
      <p className="font-titulo text-3xl font-extrabold leading-none text-olla sm:text-4xl">{valor}</p>
      <p className="mt-2 text-sm font-semibold leading-tight sm:text-base">{etiqueta}</p>
      <p className="mt-1 text-xs leading-snug text-piedra sm:text-sm">{ayuda}</p>
    </Card>
  )
}

function Circular({ c }) {
  return (
    <Card className="space-y-3">
      <h3 className="text-xl">Economía circular: a dónde va cada kilo</h3>
      {c.total === 0 ? (
        <p className="text-base text-piedra">Todavía no hay kilos en circulación.</p>
      ) : (
        <>
          <div className="flex h-8 overflow-hidden rounded-full border border-borde bg-stone-200" role="img" aria-label={`${c.pctCocina}% a la cocina y ${100 - c.pctCocina}% a cría y abono`}>
            <div className="h-full bg-olla" style={{ width: `${c.pctCocina}%` }} />
            <div className="h-full bg-ambar" style={{ width: `${100 - c.pctCocina}%` }} />
          </div>
          <ul className="grid gap-2 text-base">
            <li className="flex items-start gap-2"><span className="mt-1.5 h-3 w-3 shrink-0 rounded-sm bg-olla" aria-hidden="true" /><span><b>Pa' Cocina / Pulpa (100% sano): {num(c.cocina)} kg</b> · {c.pctCocina}%</span></li>
            <li className="flex items-start gap-2"><span className="mt-1.5 h-3 w-3 shrink-0 rounded-sm bg-ambar" aria-hidden="true" /><span><b>Pa' Cría / Abono: {num(c.cria)} kg</b> · {100 - c.pctCocina}%</span></li>
          </ul>
        </>
      )}
    </Card>
  )
}

function Columnas({ titulo, horas, datos, color, etiquetaHora }) {
  const max = Math.max(1, ...horas.map((h) => datos[h]))
  return (
    <div>
      <p className="mb-2 text-base font-bold">{titulo}</p>
      <div className="flex h-28 items-end gap-2" role="img" aria-label={`${titulo}: ${horas.map((h) => `${etiquetaHora(h)} ${datos[h]}`).join(', ')}`}>
        {horas.map((h) => (
          <div key={h} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <span className="text-sm font-bold">{datos[h]}</span>
            <div className={`w-full rounded-t-md ${color}`} style={{ height: `${Math.max(datos[h] > 0 ? 8 : 2, (datos[h] / max) * 70)}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-2 text-xs font-semibold text-piedra">
        {horas.map((h) => <span key={h} className="flex-1 text-center">{etiquetaHora(h)}</span>)}
      </div>
    </div>
  )
}

function Franjas({ a }) {
  const am = (h) => `${h} a. m.`
  const pm = (h) => `${h - 12} p. m.`
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-xl">Actividad por franja horaria</h3>
        <p className="text-base text-piedra">Encargos de la mañana y rescates de última hora.</p>
      </div>
      <div className="space-y-5">
        <Columnas titulo="Encargos tempranos (5 a 8 a. m.)" horas={FRANJAS_TEMPRANAS} datos={a.temprano} color="bg-olla" etiquetaHora={am} />
        <Columnas titulo="Rescates de última hora (1 a 4 p. m.)" horas={FRANJAS_TARDE} datos={a.tarde} color="bg-tomate" etiquetaHora={pm} />
      </div>
      <p className="text-sm text-piedra">Encargos: según la hora de recogida pedida. Rescates: según la hora en que se publicó o apartó el lote.</p>
    </Card>
  )
}

function Deslizador({ id, etiqueta, valor, min, max, unidad, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 text-base font-bold">
        <span>{etiqueta}</span>
        <span className="font-titulo text-2xl text-olla">{valor}{unidad}</span>
      </label>
      <input id={id} type="range" min={min} max={max} value={valor} onChange={(e) => onChange(Number(e.target.value))} className="h-12 w-full cursor-pointer accent-olla" />
      <div className="flex justify-between text-xs text-piedra"><span>{min}</span><span>{max}</span></div>
    </div>
  )
}

function Fila({ k, v, fuerte, tono }) {
  return (
    <li className={`flex items-center justify-between gap-3 py-2 text-base ${fuerte ? 'font-bold' : ''}`}>
      <span>{k}</span>
      <span className={tono === 'mal' ? 'text-[#A8391B]' : tono === 'bien' ? 'text-olla' : ''}>{v}</span>
    </li>
  )
}

function Simulador() {
  const [formales, setFormales] = useState(20)
  const [populares, setPopulares] = useState(10)
  const [kg, setKg] = useState(30)
  const r = useMemo(() => escenario({ formales, populares, kgPuesto: kg }), [formales, populares, kg])
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="flex items-center gap-2 text-xl"><SlidersHorizontal size={22} className="text-olla" aria-hidden="true" /> ¿Y si crecemos? Simulador de escenarios</h3>
        <p className="text-base text-piedra">Mueve las barras y mira cómo cambian las cuentas. Es una proyección, no un resultado medido.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Deslizador id="sim-formales" etiqueta="Puestos formales" valor={formales} min={1} max={60} unidad="" onChange={setFormales} />
        <Deslizador id="sim-populares" etiqueta="Puestos populares" valor={populares} min={0} max={40} unidad="" onChange={setPopulares} />
        <Deslizador id="sim-kg" etiqueta="Kilos por puesto a la semana" valor={kg} min={10} max={80} unidad=" kg" onChange={setKg} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ul className="divide-y divide-borde" aria-live="polite">
          <Fila k="Ingresos por mes" v={dinero(r.ingresosMes)} />
          <Fila k="Costos fijos por mes" v={`− ${dinero(r.costosMes)}`} />
          <Fila k="Margen neto por mes" v={`${r.margenMes < 0 ? '− ' : ''}${dinero(Math.abs(r.margenMes))}`} fuerte tono={r.margenMes >= 0 ? 'bien' : 'mal'} />
          <Fila k="Punto de equilibrio" v={r.equilibrioFormales === 0 ? 'Ya cubierto' : `${r.equilibrioFormales} formales`} />
        </ul>
        <div className="space-y-2 rounded-2xl border border-[#BCD8C5] bg-[#F4F9F5] p-4">
          <p className="flex items-center gap-2 text-base font-bold text-olla"><Leaf size={20} aria-hidden="true" /> Impacto por año</p>
          <p className="text-base"><b className="font-titulo text-3xl text-olla">{num(r.toneladasAnio)}</b> toneladas de comida rescatadas</p>
          <p className="text-base"><b className="font-titulo text-3xl text-olla">{num(r.co2eToneladas)}</b> toneladas de CO₂e evitadas (estimado)</p>
          <p className="text-xs text-piedra">Factor de referencia: FAO (2013), Food Wastage Footprint, ~{String(FACTOR_CO2E).replace('.', ',')} kg CO₂e por kg de alimento. Es un promedio mundial, no una medición de esta plaza.</p>
        </div>
      </div>
    </Card>
  )
}

export default function TabAnalitica() {
  const { apartados, lotes, pedidos } = useApp()
  const k = useMemo(() => kpis(apartados), [apartados])
  const circ = useMemo(() => economiaCircular(apartados, lotes), [apartados, lotes])
  const franjas = useMemo(() => actividadPorHora(pedidos, lotes, apartados), [pedidos, lotes, apartados])

  return (
    <div className="space-y-5">
      <Metodologia />
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Indicadores en vivo">
        <Kpi valor={porc(k.conversion)} etiqueta="Apartados que se entregan" ayuda={`${k.entregas} de ${k.apartados} apartados`} />
        <Kpi valor={porc(k.rechazo)} etiqueta="Rechazo por calidad" ayuda="De lo revisado en el puesto" />
        <Kpi valor={porc(k.descuento)} etiqueta="Descuento promedio" ayuda="Contra el precio normal, ponderado por cantidad" />
        <Kpi valor={k.ticket === null ? 'Sin datos' : dinero(k.ticket)} etiqueta="Ticket por entrega" ayuda="Promedio en COP" />
      </section>
      <div className="grid gap-5 lg:grid-cols-2">
        <Circular c={circ} />
        <Franjas a={franjas} />
      </div>
      <Simulador />
    </div>
  )
}
