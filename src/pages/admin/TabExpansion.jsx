import { useState } from 'react'
import { CheckCircle2, ClipboardList, Rocket } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { CIUDADES } from '../../data/ciudades.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Chip from '../../components/ui/Chip.jsx'
import Pill from '../../components/ui/Pill.jsx'

const campo = 'min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base'
const REQUISITOS = [
  'Coordinador o coordinadora local con su horario de soporte',
  'Moneda y cuotas de la región (el plan Formal y el Popular se ajustan)',
  'Mínimo 5 puestos pilotos que acepten el Pacto de Alimentos Aptos',
  'Mapa centrado en la plaza (OpenStreetMap, $0)',
  'Cuenta de administración local, sin depender del creador',
]
const MONEDAS = ['COP', 'MXN', 'PEN', 'CLP', 'USD']

export default function TabExpansion() {
  const { puestos, plazas, agregarPlaza } = useApp()
  const piloto = CIUDADES.find((c) => c.piloto)
  const candidatas = CIUDADES.filter((c) => !c.piloto)
  const [f, setF] = useState({ ciudad: '', plaza: '', moneda: 'COP', coordinador: '' })
  const yaEsta = (nombre) => plazas.some((p) => p.nombre.toLowerCase() === nombre.toLowerCase())
  const valido = f.ciudad.trim().length >= 2 && f.plaza.trim().length >= 2 && f.coordinador.trim().length >= 2

  return (
    <div className="space-y-5">
      <Card className="space-y-2 border-[#BCD8C5] bg-[#F4F9F5]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl">{piloto.nombre} · {piloto.plaza}</h2>
          <Pill tono="olla" icono={CheckCircle2}>Piloto Activo</Pill>
        </div>
        <p className="text-base text-piedra">
          {puestos.filter((p) => p.tipo === 'puesto').length} puestos · {piloto.codigo} ({piloto.moneda}) · {piloto.coordinador}
        </p>
      </Card>

      <section className="space-y-3" aria-label="Plazas candidatas">
        <h2 className="text-2xl">Plazas listas para activar</h2>
        <p className="text-base text-piedra">Cada plaza es independiente: su propio coordinador, su moneda y sus puestos. No comparten datos con Barranquilla.</p>
        <ul className="grid gap-3 sm:grid-cols-3">
          {candidatas.map((c) => {
            const nombre = `${c.nombre} · ${c.plaza}`
            const activa = yaEsta(nombre)
            return (
              <li key={c.id}>
                <Card className="flex h-full flex-col gap-2 !p-4">
                  <p className="text-lg font-bold">{c.nombre}</p>
                  <p className="text-base text-piedra">{c.plaza} · {c.codigo}</p>
                  <Button
                    className="mt-auto"
                    variante={activa ? 'suave' : 'contorno'}
                    icono={activa ? CheckCircle2 : Rocket}
                    disabled={activa}
                    onClick={() => agregarPlaza({ ciudad: c.nombre, plaza: c.plaza, moneda: c.codigo, coordinador: c.coordinador })}
                  >
                    {activa ? 'En preparación' : 'Activar plaza'}
                  </Button>
                </Card>
              </li>
            )
          })}
        </ul>
      </section>

      <Card className="space-y-4">
        <h2 className="flex items-center gap-2 text-2xl"><ClipboardList size={24} className="text-olla" aria-hidden="true" /> Plantilla pa' otra ciudad</h2>
        <ul className="space-y-1.5 text-base">
          {REQUISITOS.map((r) => (
            <li key={r} className="flex gap-2"><CheckCircle2 size={20} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />{r}</li>
          ))}
        </ul>
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (valido && agregarPlaza(f)) setF({ ciudad: '', plaza: '', moneda: 'COP', coordinador: '' })
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={campo} value={f.ciudad} onChange={(e) => setF({ ...f, ciudad: e.target.value })} placeholder="Ciudad" aria-label="Ciudad" />
            <input className={campo} value={f.plaza} onChange={(e) => setF({ ...f, plaza: e.target.value })} placeholder="Plaza de mercado" aria-label="Plaza de mercado" />
          </div>
          <input className={campo} value={f.coordinador} onChange={(e) => setF({ ...f, coordinador: e.target.value })} placeholder="Coordinador o coordinadora local" aria-label="Coordinador local" />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Moneda">
            {MONEDAS.map((m) => <Chip key={m} activo={f.moneda === m} onClick={() => setF({ ...f, moneda: m })}>{m}</Chip>)}
          </div>
          <Button type="submit" icono={Rocket} disabled={!valido} className="w-full sm:w-auto">Registrar plaza nueva</Button>
        </form>
      </Card>

      {plazas.length > 0 && (
        <section className="space-y-3" aria-label="Plazas registradas">
          <h2 className="text-2xl">Plazas registradas</h2>
          <ul className="space-y-2">
            {plazas.map((p) => (
              <li key={p.id}>
                <Card className="flex flex-wrap items-center justify-between gap-2 !p-4">
                  <span className="text-base"><b>{p.nombre}</b> · {p.moneda} · {p.coordinador}</span>
                  <Pill tono="ambar">{p.estado}</Pill>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
