import { lazy, Suspense } from 'react'
import { Home, Snowflake, Sun } from 'lucide-react'
import { PLANES } from '../../lib/economia.js'
import Toggle from '../ui/Toggle.jsx'

const SelectorUbicacion = lazy(() => import('../mapa/SelectorUbicacion.jsx'))

export const PUESTO_VACIO = { nombre: '', formal: false, coord: null, zona: true, nequi: false, sinCelular: false, plan: 'popular' }
export const campo = 'min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base'

function Opcion({ activa, onClick, icono: Icono, titulo, detalle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activa}
      className={`flex min-h-[72px] flex-1 flex-col items-start gap-1 rounded-2xl border p-3 text-left ${
        activa ? 'border-olla bg-[#E7F1EA]' : 'border-borde bg-white hover:border-olla'
      }`}
    >
      <span className="flex items-center gap-2 text-base font-bold">
        {Icono && <Icono size={20} className="text-olla" aria-hidden="true" />} {titulo}
      </span>
      <span className="text-sm text-piedra">{detalle}</span>
    </button>
  )
}

function Fila({ titulo, detalle, activo, onChange, fijo }) {
  return (
    <div className="flex min-h-[56px] items-center justify-between gap-3">
      <div>
        <p className="text-base font-semibold">{titulo}</p>
        {detalle && <p className="text-sm text-piedra">{detalle}</p>}
      </div>
      {fijo ? <span className="text-sm font-bold text-olla">Siempre</span> : <Toggle activo={activo} onChange={onChange} etiqueta={titulo} />}
    </div>
  )
}

// Alta rápida (y edición) de un puesto en una sola pantalla.
export default function FormPuesto({ valor, onChange }) {
  const poner = (c) => onChange({ ...valor, ...c })
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="puesto-nombre" className="mb-1 block text-base font-bold">Nombre del puesto</label>
        <input id="puesto-nombre" className={campo} value={valor.nombre} maxLength={40} onChange={(e) => poner({ nombre: e.target.value })} placeholder="Ej.: Frutas Doña Marta" />
      </div>

      <div>
        <p className="mb-2 text-base font-bold">¿Cómo es tu puesto?</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Opcion activa={valor.formal} icono={Snowflake} titulo="Formal, con nevera" detalle="Tienes nevera o cuarto frío." onClick={() => poner({ formal: true, plan: 'formal' })} />
          <Opcion activa={!valor.formal} icono={Sun} titulo="Informal, al ambiente" detalle="Sin nevera: vendes pa' consumo del día." onClick={() => poner({ formal: false, nequi: false, plan: 'popular' })} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-base font-bold">¿Dónde queda?</p>
        <Suspense fallback={<p className="flex h-56 items-center justify-center rounded-2xl border border-borde bg-white text-piedra">Cargando el mapa…</p>}>
          <SelectorUbicacion valor={valor.coord} onChange={(coord) => poner({ coord })} />
        </Suspense>
      </div>

      <div className="divide-y divide-borde rounded-2xl border border-borde bg-white px-4">
        <Fila titulo="Mostrar solo una zona aproximada" detalle="La dirección exacta se ve cuando alguien aparta. Más seguro pa' ti." activo={valor.zona} onChange={(v) => poner({ zona: v })} />
        <Fila titulo="Pago en efectivo" detalle="Revisan primero y pagan al recoger." fijo />
        {valor.formal && <Fila titulo="También acepto Nequi" detalle="Solo si el comprador te muestra el comprobante." activo={valor.nequi} onChange={(v) => poner({ nequi: v })} />}
        <Fila titulo="Modo Sin Celular en Puesto" detalle="Contestas encargos desde la casa, no en el puesto." activo={valor.sinCelular} onChange={(v) => poner({ sinCelular: v })} />
      </div>

      <div>
        <p className="mb-2 flex items-center gap-2 text-base font-bold"><Home size={18} className="text-olla" aria-hidden="true" /> Tu plan</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {Object.values(PLANES).map((p) => (
            <Opcion key={p.id} activa={valor.plan === p.id} titulo={`${p.nombre} · ${p.precio}`} detalle={p.detalle} onClick={() => poner({ plan: p.id })} />
          ))}
        </div>
        <p className="mt-2 text-sm text-piedra">La cuota solo corre desde tu primera entrega. Sin plata por adelantado.</p>
      </div>
    </div>
  )
}
