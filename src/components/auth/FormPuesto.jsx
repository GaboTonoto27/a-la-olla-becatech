import { lazy, Suspense, useRef, useState } from 'react'
import { Camera, CheckCircle2, Home, Loader2, MapPinned, Trash2 } from 'lucide-react'
import { PREGUNTAS, RESPUESTAS_VACIAS, sugerirPlan } from '../../lib/planPuesto.js'
import { MAX_FOTOS, comprimirImagen } from '../../lib/imagen.js'
import { useApp } from '../../context/AppContext.jsx'
import Toggle from '../ui/Toggle.jsx'
import Chip from '../ui/Chip.jsx'
import Button from '../ui/Button.jsx'
import { ATAJOS, DIAS, HORAS, POR_DEFECTO, formatoHora, horarioValido, textoHorario } from '../../lib/horarioPuesto.js'
import { buscarDireccion } from '../../lib/geocodificar.js'

const SelectorUbicacion = lazy(() => import('../mapa/SelectorUbicacion.jsx'))

export const PUESTO_VACIO = { nombre: '', formal: false, coord: null, zona: true, nequi: false, sinCelular: false, plan: 'popular', respuestas: RESPUESTAS_VACIAS, direccion: '', ...POR_DEFECTO, horario: textoHorario(POR_DEFECTO.dias, POR_DEFECTO.horaAbre, POR_DEFECTO.horaCierra), descripcion: '', fotos: [] }
// El formulario del puesto está listo pa' guardar: nombre, punto en el mapa y un horario con días y cierre posterior a la apertura.
export const puestoCompleto = (v) => v.nombre.trim().length >= 2 && Boolean(v.coord) && horarioValido(v)
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

// Fotos propias del puesto limpio: se comprimen con <canvas> antes de guardarse.
function FotosPuesto({ fotos = [], onChange }) {
  const { notificar } = useApp()
  const entrada = useRef(null)
  const [ocupado, setOcupado] = useState(false)

  const subir = async (e) => {
    const archivos = [...e.target.files].slice(0, MAX_FOTOS - fotos.length)
    e.target.value = ''
    if (!archivos.length) return notificar(`Máximo ${MAX_FOTOS} fotos. Borra una para subir otra.`, 'info')
    setOcupado(true)
    const nuevas = []
    for (const a of archivos) {
      try {
        nuevas.push(await comprimirImagen(a))
      } catch (err) {
        notificar(err.message, 'error')
      }
    }
    setOcupado(false)
    if (nuevas.length) {
      onChange([...fotos, ...nuevas])
      notificar(nuevas.length > 1 ? `${nuevas.length} fotos cargadas` : 'Foto cargada')
    }
  }

  return (
    <div>
      <p className="mb-1 text-base font-bold">Fotos de tu puesto limpio</p>
      <p className="mb-2 text-sm text-piedra">Solo el puesto, nunca la fruta golpeada. Hasta {MAX_FOTOS} fotos.</p>
      {fotos.length > 0 && (
        <ul className="mb-2 grid grid-cols-2 gap-2">
          {fotos.map((f, i) => (
            <li key={i} className="relative overflow-hidden rounded-xl border border-borde">
              <img src={f} alt={`Foto ${i + 1} de tu puesto`} className="h-28 w-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  onChange(fotos.filter((_, j) => j !== i))
                  notificar('Foto eliminada', 'info')
                }}
                aria-label={`Eliminar foto ${i + 1}`}
                className="absolute right-1 top-1 flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 text-[#A8391B] shadow"
              >
                <Trash2 size={20} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <input ref={entrada} type="file" accept="image/*" multiple onChange={subir} className="sr-only" aria-label="Subir fotos del puesto" data-testid="subir-fotos" />
      <button
        type="button"
        onClick={() => entrada.current?.click()}
        disabled={ocupado || fotos.length >= MAX_FOTOS}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-olla bg-white px-5 text-base font-bold text-olla hover:bg-marfil disabled:opacity-50"
      >
        <Camera size={20} aria-hidden="true" /> {ocupado ? 'Preparando fotos…' : 'Subir fotos'}
      </button>
    </div>
  )
}

// Días en chips, atajos de 1 clic y horas cada 30 minutos. Guarda la estructura y el texto legible.
function SelectorHorario({ valor, poner }) {
  const dias = valor.dias ?? POR_DEFECTO.dias
  const abre = valor.horaAbre ?? POR_DEFECTO.horaAbre
  const cierra = valor.horaCierra ?? POR_DEFECTO.horaCierra
  const cambiar = (c) => {
    const n = { dias, horaAbre: abre, horaCierra: cierra, ...c }
    if (n.horaCierra <= n.horaAbre) n.horaCierra = Math.min(HORAS[HORAS.length - 1], n.horaAbre + 60) // el cierre siempre es después de abrir
    poner({ ...n, horario: textoHorario(n.dias, n.horaAbre, n.horaCierra) })
  }
  const alternar = (i) => cambiar({ dias: dias.includes(i) ? dias.filter((x) => x !== i) : [...dias, i].sort((a, b) => a - b) })
  const mismos = (a) => a.length === dias.length && a.every((x) => dias.includes(x))
  const selec = 'min-h-[48px] w-full rounded-xl border border-borde bg-white px-3 text-base'
  return (
    <fieldset className="space-y-3" data-testid="selector-horario">
      <legend className="mb-1 text-base font-bold">Horario de atención</legend>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Atajos de días">
        {ATAJOS.map((a) => (
          <Chip key={a.id} activo={mismos(a.dias)} onClick={() => cambiar({ dias: a.dias })}>{a.etiqueta}</Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Días de atención">
        {DIAS.map((d, i) => (
          <Chip key={d} activo={dias.includes(i)} onClick={() => alternar(i)}>{d}</Chip>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-semibold">
          Abres a las
          <select className={`mt-1 ${selec}`} value={abre} onChange={(e) => cambiar({ horaAbre: Number(e.target.value) })} aria-label="Hora de apertura">
            {HORAS.slice(0, -1).map((h) => <option key={h} value={h}>{formatoHora(h)}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Cierras a las
          <select className={`mt-1 ${selec}`} value={cierra} onChange={(e) => cambiar({ horaCierra: Number(e.target.value) })} aria-label="Hora de cierre">
            {HORAS.filter((h) => h > abre).map((h) => <option key={h} value={h}>{formatoHora(h)}</option>)}
          </select>
        </label>
      </div>
      {dias.length === 0 ? (
        <p role="alert" className="text-base font-bold text-[#A8391B]">Elige al menos un día de atención.</p>
      ) : (
        <p className="text-base" data-testid="horario-texto">Se verá así: <b>{textoHorario(dias, abre, cierra)}</b></p>
      )}
    </fieldset>
  )
}

// Alta rápida (y edición) de un puesto en una sola pantalla.
export default function FormPuesto({ valor, onChange, puestoId = 'nuevo', onFotos, onConfirmarUbicacion, ubicacionActual = null, barrio = '' }) {
  const { notificar } = useApp()
  const poner = (c) => onChange({ ...valor, ...c })
  const [busq, setBusq] = useState({ estado: 'idle' }) // idle | buscando | confirmar | ajustar | listo | nada
  const [foco, setFoco] = useState(null)
  const mapaRef = useRef(null)

  // Dirección escrita → punto en el mapa (Nominatim, solo Barranquilla). El vendedor confirma o ajusta el punto.
  const ubicarDireccion = async () => {
    setBusq({ estado: 'buscando' })
    const r = await buscarDireccion(valor.direccion, barrio)
    if (!r.ok) return setBusq({ estado: 'nada', error: r.error })
    poner({ coord: r.punto })
    setFoco({ punto: r.punto, n: Date.now() })
    setBusq({ estado: 'confirmar', punto: r.punto, nombre: r.nombre, aprox: r.aprox })
    mapaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  const confirmarBusqueda = () => {
    onConfirmarUbicacion?.(busq.punto)
    notificar('Ubicación del puesto confirmada')
    setBusq({ ...busq, estado: 'listo' })
  }
  const r = valor.respuestas ?? RESPUESTAS_VACIAS
  const sugerido = sugerirPlan(r)
  // Las respuestas mandan: la refrigeración define si es "formal" (nevera) y el plan sugerido sale de ellas.
  const ponerRespuesta = (c) => {
    const nuevas = { ...r, ...c }
    const formal = nuevas.refri === 'frio'
    poner({ respuestas: nuevas, formal, plan: sugerirPlan(nuevas).plan, ...(formal ? {} : { nequi: false }) })
  }
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="puesto-nombre" className="mb-1 block text-base font-bold">Nombre del puesto</label>
        <input id="puesto-nombre" className={campo} value={valor.nombre} maxLength={40} onChange={(e) => poner({ nombre: e.target.value })} placeholder="Ej.: Frutas Doña Marta" />
      </div>

      <div>
        <label htmlFor="puesto-dir" className="mb-1 block text-base font-bold">Dirección escrita</label>
        <input id="puesto-dir" className={campo} value={valor.direccion ?? ''} maxLength={90} onChange={(e) => { poner({ direccion: e.target.value }); if (busq.estado !== 'idle') setBusq({ estado: 'idle' }) }} placeholder="Ej.: Carrera 6 B Sur # 47 D - 37" autoComplete="off" />
        <Button variante="contorno" icono={busq.estado === 'buscando' ? Loader2 : MapPinned} className="mt-2 w-full" onClick={ubicarDireccion} disabled={busq.estado === 'buscando' || (valor.direccion ?? '').trim().length < 4}>
          {busq.estado === 'buscando' ? 'Buscando la dirección…' : 'Ubicar dirección en el mapa'}
        </Button>
        {busq.estado === 'nada' && <p role="alert" className="mt-2 text-base font-bold text-[#A8391B]">{busq.error}</p>}
      </div>
      <SelectorHorario valor={valor} poner={poner} />
      <div>
        <label htmlFor="puesto-desc" className="mb-1 block text-base font-bold">Descripción <span className="font-medium text-piedra">(opcional)</span></label>
        <textarea id="puesto-desc" rows={2} className={`${campo} py-2`} value={valor.descripcion ?? ''} maxLength={200} onChange={(e) => poner({ descripcion: e.target.value })} placeholder="Ej.: Frutas y verduras pa' guiso, jugo y sopa." />
      </div>

      <FotosPuesto fotos={valor.fotos ?? []} onChange={(fotos) => (onFotos ? onFotos(fotos) : poner({ fotos }))} />

      <fieldset className="space-y-4">
        <legend className="mb-1 text-lg font-bold">Cuéntanos cómo es tu puesto</legend>
        {PREGUNTAS.map((q) => (
          <div key={q.id}>
            <p className="mb-2 text-base font-bold">{q.titulo}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              {q.opciones.map((o) => (
                <Opcion key={o.id} activa={r[q.id] === o.id} titulo={o.titulo} detalle={o.detalle} onClick={() => ponerRespuesta({ [q.id]: o.id })} />
              ))}
            </div>
          </div>
        ))}
        <div className="rounded-2xl border border-borde bg-white px-4">
          <Fila titulo="Es un punto muy concurrido o conocido" detalle="Mucha gente te conoce y pasa por tu puesto." activo={Boolean(r.concurrido)} onChange={(v) => ponerRespuesta({ concurrido: v })} />
        </div>
      </fieldset>

      <div>
        <h3 className="mb-1 text-lg font-bold" data-testid="ubicacion-puesto">Ubicación de mi puesto (para vender)</h3>
        <p className="mb-2 text-sm text-piedra">Tu puesto puede estar en un lugar distinto a donde te encuentras ahora (ideal si configuras desde casa).</p>
        <div ref={mapaRef} />
        {(busq.estado === 'confirmar' || busq.estado === 'listo') && (
          <div className="mb-3 space-y-3 rounded-2xl border border-olla bg-[#E7F1EA] p-4" role="group" aria-label="¿Esta es la dirección de tu puesto?" data-testid="confirmar-direccion">
            <p className="flex items-center gap-2 text-lg font-bold"><MapPinned size={22} className="text-olla" aria-hidden="true" /> ¿Esta es la dirección de tu puesto?</p>
            <p className="text-base"><b>{busq.nombre || valor.direccion}</b></p>
            {busq.aprox && <p className="text-sm font-semibold text-ambar">Encontramos la calle, no el número exacto: es una zona aproximada. Si hace falta, ajusta el pin.</p>}
            {busq.estado === 'confirmar' ? (
              <div className="grid gap-2 sm:grid-cols-2">
                <Button icono={CheckCircle2} onClick={confirmarBusqueda}>Sí, confirmar punto</Button>
                <Button variante="contorno" onClick={() => setBusq({ ...busq, estado: 'ajustar' })}>Ajustar punto yo mismo</Button>
              </div>
            ) : (
              <p className="flex items-center gap-2 text-base font-bold text-olla"><CheckCircle2 size={20} aria-hidden="true" /> Punto confirmado.</p>
            )}
          </div>
        )}
        {busq.estado === 'ajustar' && <p className="mb-2 text-base font-semibold text-olla" role="status">Listo: toca el mapa o arrastra el pin hasta tu puesto y pulsa "Confirmar ubicación".</p>}
        <Suspense fallback={<p className="flex h-56 items-center justify-center rounded-2xl border border-borde bg-white text-piedra">Cargando el mapa…</p>}>
          <SelectorUbicacion
            modo="puesto"
            pregunta="¿Es aquí tu puesto? Puedes mover el punto exacto tú mismo"
            id={puestoId}
            zona={valor.zona}
            etiquetaPin="Tu puesto"
            etiquetaGps="Estoy en mi puesto (usar mi GPS)"
            valor={valor.coord}
            referencia={ubicacionActual}
            foco={foco}
            onChange={(coord) => poner({ coord })}
            onConfirmar={(c) => {
              onConfirmarUbicacion?.(c)
              notificar('Ubicación del puesto confirmada')
            }}
          />
        </Suspense>
      </div>

      <div className="divide-y divide-borde rounded-2xl border border-borde bg-white px-4">
        <Fila titulo="Mostrar solo una zona aproximada" detalle="La dirección exacta se ve cuando alguien aparta. Más seguro pa' ti." activo={valor.zona} onChange={(v) => poner({ zona: v })} />
        <Fila titulo="Pago en efectivo" detalle="Revisan primero y pagan al recoger." fijo />
        {valor.formal && <Fila titulo="También acepto Nequi" detalle="Solo si el comprador te muestra el comprobante." activo={valor.nequi} onChange={(v) => poner({ nequi: v })} />}
        <Fila titulo="Modo Sin Celular en Puesto" detalle="Contestas encargos desde la casa, no en el puesto." activo={valor.sinCelular} onChange={(v) => poner({ sinCelular: v })} />
      </div>

      <div className="space-y-2 rounded-2xl border border-olla bg-[#E7F1EA] p-4" role="status" aria-live="polite" data-testid="plan-sugerido">
        <p className="flex items-center gap-2 text-base font-bold"><Home size={18} className="text-olla" aria-hidden="true" /> Plan sugerido: {sugerido.etiqueta} · {sugerido.precio}</p>
        <p className="text-base">{sugerido.motivo}</p>
        <p className="text-sm text-piedra">El equipo de A la Olla confirma tu tarifa final. La cuota solo corre desde tu primera entrega. Sin plata por adelantado.</p>
      </div>
    </div>
  )
}
