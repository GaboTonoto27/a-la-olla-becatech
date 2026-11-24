import { CheckCircle2, ClipboardList, Compass, Lock } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { CIUDADES } from '../../data/ciudades.js'
import { Isotipo } from '../../components/ui/Logo.jsx'
import Card from '../../components/ui/Card.jsx'
import Pill from '../../components/ui/Pill.jsx'

// Hoja de ruta: solo lectura. No hay botones pa' "activar" plazas; lo único operando es Barranquilla.
const REQUISITOS = [
  'Coordinador o coordinadora local con su horario de soporte',
  'Moneda y cuotas de la región (el plan Formal y el Popular se ajustan)',
  'Mínimo 5 puestos pilotos que acepten el Pacto de Alimentos Aptos',
  'Mapa centrado en la plaza (OpenStreetMap, $0)',
  'Cuenta de administración local, sin depender del creador',
]

// Contexto y potencial son referencias estratégicas, no datos medidos en campo.
const REFERENCIAS = {
  mx: {
    lugar: 'Central de Abasto / Tianguis',
    contexto: 'Una de las centrales de abasto más grandes de Latinoamérica, más los tianguis de barrio que funcionan como plazas semanales.',
    potencial: 'Mucho volumen de frutas y verduras con merma diaria. Se replica con coordinación local y precios en pesos mexicanos.',
  },
  bog: {
    lugar: 'Plaza de Paloquemao',
    contexto: 'Plaza de mercado emblemática de Bogotá, con puestos formales e informales y clima frío (la conservación pesa menos que en la costa).',
    potencial: 'Mismo idioma, misma moneda y mismas cuotas que el piloto: el paso más fácil de replicar.',
  },
  med: {
    lugar: 'Plaza Minorista',
    contexto: 'Gran plaza de abasto de Medellín, con mucha venta al por mayor y restaurantes cercanos que compran a diario.',
    potencial: "Buena demanda de restaurantes y corrientazos pa' el modo 'Pide pa' tu olla'. Misma moneda que el piloto.",
  },
}

function Sello() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-borde bg-white py-1 pl-1.5 pr-3 text-sm font-bold text-olla">
      <Isotipo size={24} /> Sello oficial · A la Olla
    </span>
  )
}

export default function TabExpansion() {
  const { puestos } = useApp()
  const piloto = CIUDADES.find((c) => c.piloto)
  const futuras = CIUDADES.filter((c) => !c.piloto)
  const nPuestos = puestos.filter((p) => p.tipo === 'puesto' && p.ciudad === piloto.id).length

  return (
    <div className="space-y-5">
      <Card className="space-y-3">
        <Sello />
        <h2 className="text-2xl sm:text-3xl">Futuro desarrollo en distintas plazas de Latinoamérica y el mundo</h2>
        <p className="text-base text-piedra">
          Hoy A la Olla opera en un solo lugar: Barranquilla. Lo demás es la hoja de ruta del modelo replicable, con coordinadores locales y sin depender del creador. Esta vista es solo de lectura.
        </p>
      </Card>

      <Card className="space-y-2 border-[#BCD8C5] bg-[#F4F9F5]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl">{piloto.nombre}</h2>
          <Pill tono="olla" icono={CheckCircle2}>Piloto activo (validado en campo)</Pill>
        </div>
        <p className="text-base font-semibold">Ciudadela 20 de Julio · 7 de Abril · Conidec</p>
        <p className="text-base text-piedra">
          {nPuestos} puestos registrados · {piloto.codigo} ({piloto.moneda}) · {piloto.coordinador}. Validado con entrevistas reales en campo.
        </p>
      </Card>

      <section className="space-y-3" aria-label="Referencias de expansión futura">
        <h2 className="flex items-center gap-2 text-2xl"><Compass size={24} className="text-olla" aria-hidden="true" /> Referencias de expansión futura</h2>
        <p className="text-base text-piedra">Plazas que servirían de modelo. Ninguna está operando ni tiene datos de campo todavía.</p>
        <ul className="grid gap-3 md:grid-cols-3">
          {futuras.map((c) => {
            const r = REFERENCIAS[c.id]
            return (
              <li key={c.id}>
                <Card className="flex h-full flex-col gap-2 !p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xl font-bold">{c.nombre}</p>
                    <Pill icono={Lock}>Solo referencia</Pill>
                  </div>
                  <p className="text-base font-semibold">{r?.lugar ?? c.plaza}</p>
                  <p className="text-sm font-semibold text-olla">Moneda: {c.codigo} ({c.moneda})</p>
                  {r && (
                    <>
                      <p className="text-base"><b>Contexto:</b> {r.contexto}</p>
                      <p className="text-base"><b>Potencial:</b> {r.potencial}</p>
                    </>
                  )}
                </Card>
              </li>
            )
          })}
        </ul>
        <p className="text-sm text-piedra">Otras plazas de Latinoamérica por explorar más adelante: Perú (PEN), Chile (CLP) y otras ciudades de Colombia y México.</p>
      </section>

      <Card className="space-y-3">
        <h2 className="flex items-center gap-2 text-2xl"><ClipboardList size={24} className="text-olla" aria-hidden="true" /> Qué necesita cada plaza pa' repetir el modelo</h2>
        <ul className="space-y-1.5 text-base">
          {REQUISITOS.map((r) => (
            <li key={r} className="flex gap-2"><CheckCircle2 size={20} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />{r}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
