import { useMemo, useState } from 'react'
import { BadgeCheck, CircleHelp, Loader2, MapPin, Search } from 'lucide-react'
import { verificarBarrio } from '../../lib/geocodificar.js'
import { barrioMasCercano, distanciaABarrio, evaluarBarrio, normalizar } from '../../utils/barrios.js'
import Button from '../ui/Button.jsx'
import { campo } from './FormPuesto.jsx'

const DISTANCIA_LEJOS_M = 4000 // las coordenadas del catálogo son de referencia: se avisa solo si el pin queda muy lejos
const DISTANCIA_CERCA_M = 1200

const Aviso = ({ tono, icono: Icono, children, ...resto }) => (
  <p
    role="status"
    className={`flex items-start gap-2 rounded-xl border p-3 text-base ${
      tono === 'ok' ? 'border-[#BCD8C5] bg-[#E7F1EA] font-bold text-olla' : 'border-[#EBCFA6] bg-[#FBEFDD] font-semibold'
    }`}
    {...resto}
  >
    <Icono size={20} className={`mt-0.5 shrink-0 ${tono === 'ok' ? 'text-olla' : 'text-ambar'}`} aria-hidden="true" />
    <span>{children}</span>
  </p>
)

// Barrio con ayuda: sugerencias al escribir, "¿Quisiste decir…?", verificación en OpenStreetMap y coherencia suave con el mapa.
// Nunca bloquea: si el barrio no se reconoce, se puede seguir confirmando la ubicación en el mapa.
export default function CampoBarrio({ id, valor, onChange, requerido = false, opcional = false, coord = null, detectado = '', autoverificar = true }) {
  const [verif, setVerif] = useState({ estado: 'idle', para: '' }) // idle | buscando | ok | no | error
  const ev = useMemo(() => evaluarBarrio(valor), [valor])
  const clave = normalizar(valor)
  const vigente = verif.para === clave ? verif.estado : 'idle'

  const verificar = async () => {
    if (ev.estado !== 'desconocido' && ev.estado !== 'sugerido') return
    setVerif({ estado: 'buscando', para: clave })
    const r = await verificarBarrio(valor)
    setVerif({ estado: r.ok ? 'ok' : r.error ? 'error' : 'no', para: clave })
  }

  // Coherencia con el pin del mapa y con el barrio que detectó la búsqueda de la dirección.
  const lejos = ev.estado === 'exacto' && coord ? distanciaABarrio(coord, ev.barrio) : null
  const cercano = coord && ev.estado !== 'exacto' ? barrioMasCercano(coord) : null
  const detectadoUtil = detectado && normalizar(detectado) !== clave ? detectado : ''

  return (
    <div className="space-y-2" data-testid="campo-barrio">
      <label htmlFor={id} className="block text-base font-semibold">
        Tu barrio {opcional && <span className="font-medium text-piedra">(opcional)</span>}
      </label>
      <input
        id={id}
        required={requerido}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => autoverificar && vigente === 'idle' && valor.trim().length >= 3 && verificar()}
        placeholder="Escribe tu barrio o sector"
        autoComplete="off"
        className={campo}
      />

      {ev.estado === 'exacto' && <Aviso tono="ok" icono={BadgeCheck}>Barrio verificado en Barranquilla / Área Metropolitana</Aviso>}

      {ev.estado === 'sugerido' && vigente !== 'ok' && (
        <div className="space-y-2 rounded-xl border border-[#EBCFA6] bg-[#FBEFDD] p-3" role="status" data-testid="quisiste-decir">
          <p className="flex items-start gap-2 text-base font-bold"><CircleHelp size={20} className="mt-0.5 shrink-0 text-ambar" aria-hidden="true" /> ¿Quisiste decir «{ev.barrio.nombre}»?</p>
          <div className="flex flex-wrap gap-2">
            <Button className="!min-h-[48px]" onClick={() => onChange(ev.barrio.nombre)}>Sí, usar «{ev.barrio.nombre}»</Button>
            <Button variante="contorno" onClick={verificar} disabled={vigente === 'buscando'}>No, es otro barrio</Button>
          </div>
        </div>
      )}

      {ev.estado !== 'exacto' && ev.estado !== 'vacio' && ev.sugerencias.length > 0 && ev.barrio?.nombre !== ev.sugerencias[0]?.barrio?.nombre && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sugerencias de barrio">
          {ev.sugerencias.map(({ barrio }) => (
            <button key={barrio.nombre} type="button" onClick={() => onChange(barrio.nombre)} className="min-h-[48px] rounded-full border border-borde bg-white px-4 text-base font-bold text-olla hover:border-olla">
              {barrio.nombre}
            </button>
          ))}
        </div>
      )}

      {(ev.estado === 'desconocido' || ev.estado === 'sugerido') && valor.trim().length >= 3 && vigente === 'idle' && (
        <Button variante="contorno" icono={Search} className="w-full" onClick={verificar}>Verificar barrio</Button>
      )}
      {vigente === 'buscando' && <p className="flex items-center gap-2 text-base text-piedra" role="status"><Loader2 size={18} className="animate-spin" aria-hidden="true" /> Verificando el barrio…</p>}
      {vigente === 'ok' && ev.estado !== 'exacto' && <Aviso tono="ok" icono={BadgeCheck}>Barrio verificado en Barranquilla / Área Metropolitana</Aviso>}
      {(vigente === 'no' || vigente === 'error') && ev.estado !== 'exacto' && (
        <Aviso tono="ambar" icono={CircleHelp} data-testid="barrio-no-reconocido">
          {vigente === 'error'
            ? 'No pudimos verificar el barrio (revisa tu internet). Puedes seguir y confirmar tu ubicación en el mapa.'
            : 'No reconocemos ese barrio en Barranquilla — verifica si está bien escrito o confírmalo en el mapa.'}
        </Aviso>
      )}

      {detectadoUtil && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-olla bg-white p-3" data-testid="barrio-detectado">
          <p className="flex-1 text-base"><MapPin size={18} className="mr-1 inline text-olla" aria-hidden="true" />Detectamos «<b>{detectadoUtil}</b>» según tu dirección.</p>
          <Button variante="contorno" onClick={() => onChange(detectadoUtil)}>Usar este barrio</Button>
        </div>
      )}
      {!detectadoUtil && cercano && cercano.metros < DISTANCIA_CERCA_M && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-borde bg-white p-3" data-testid="barrio-cerca-del-pin">
          <p className="flex-1 text-base">Tu pin queda cerca de «<b>{cercano.barrio.nombre}</b>».</p>
          <Button variante="contorno" onClick={() => onChange(cercano.barrio.nombre)}>Usar este barrio</Button>
        </div>
      )}
      {lejos !== null && lejos > DISTANCIA_LEJOS_M && (
        <Aviso tono="ambar" icono={MapPin} data-testid="barrio-lejos-del-pin">
          El pin queda lejos de «{ev.barrio.nombre}». Revisa que el barrio y el punto del mapa sean el mismo sitio.
        </Aviso>
      )}
    </div>
  )
}
