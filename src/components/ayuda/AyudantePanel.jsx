import { useState } from 'react'
import { CheckCircle2, Clock, LifeBuoy, Search } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { HORARIO_SOPORTE, PREGUNTAS, buscarRespuesta, enHorario } from '../../data/ayuda.js'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'

const campo = 'min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base'
const PILDORAS = ['apartar', 'pago', 'nivel', 'sincelular', 'costo']

export default function AyudantePanel({ onCerrar }) {
  const { ciudad, crearTicket, usuario } = useApp()
  const [texto, setTexto] = useState('')
  const [respuesta, setRespuesta] = useState(null)
  const [sinResultado, setSinResultado] = useState(false)
  const [ticket, setTicket] = useState(null) // null | 'form' | 'hecho'
  const [t, setT] = useState({ asunto: '', mensaje: '' })

  const buscar = (e) => {
    e.preventDefault()
    const r = buscarRespuesta(texto)
    setRespuesta(r)
    setSinResultado(!r && texto.trim().length > 0)
  }
  const ordenadas = [...PREGUNTAS.filter((p) => PILDORAS.includes(p.id)), ...PREGUNTAS.filter((p) => !PILDORAS.includes(p.id))]
  const dentro = enHorario()

  return (
    <Modal titulo="Te ayudo ahora" cerrable onCerrar={onCerrar} pie={<Button variante="suave" className="w-full" onClick={onCerrar}>Cerrar</Button>}>
      <p className="mb-3 text-base text-piedra">Toca una pregunta o escribe lo que necesitas, como lo dirías en la calle.</p>

      <form onSubmit={buscar} className="mb-3 flex gap-2">
        <input value={texto} onChange={(e) => setTexto(e.target.value)} aria-label="Escribe tu pregunta" placeholder="Ej.: ¿cómo pago?" className={campo} />
        <Button type="submit" icono={Search} aria-label="Buscar respuesta" />
      </form>

      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Preguntas frecuentes">
        {ordenadas.map((p) => (
          <Chip key={p.id} activo={respuesta?.id === p.id} onClick={() => { setRespuesta(p); setSinResultado(false) }}>{p.pregunta}</Chip>
        ))}
      </div>

      {respuesta && (
        <div className="mb-4 rounded-2xl border border-[#BCD8C5] bg-[#E7F1EA] p-4" aria-live="polite">
          <p className="mb-2 text-lg font-bold text-olla">{respuesta.pregunta}</p>
          <ol className="list-decimal space-y-1.5 pl-5 text-base">
            {respuesta.pasos.map((p) => <li key={p}>{p}</li>)}
          </ol>
        </div>
      )}
      {sinResultado && (
        <p className="mb-4 rounded-2xl border border-[#EBCFA6] bg-[#FBEFDD] p-4 text-base font-semibold" role="status">
          No encontré eso. Prueba con otras palabras o escríbele a una persona de soporte aquí abajo.
        </p>
      )}

      <section className="space-y-3 border-t border-borde pt-4" aria-label="Soporte especializado">
        <h3 className="flex items-center gap-2 text-xl"><LifeBuoy size={22} className="text-olla" aria-hidden="true" /> ¿Sigue la duda?</h3>
        <p className="flex items-start gap-2 text-base">
          <Clock size={20} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
          <span>
            Soporte de la {ciudad.coordinador}: {HORARIO_SOPORTE}{' '}
            <b className={dentro ? 'text-olla' : 'text-ambar'}>{dentro ? 'Atendemos ahora.' : 'Ahora estamos fuera de horario: te respondemos en el próximo turno.'}</b>
          </span>
        </p>

        {ticket === 'hecho' ? (
          <p className="flex items-start gap-2 rounded-xl border border-[#BCD8C5] bg-[#E7F1EA] p-3 text-base font-bold text-olla">
            <CheckCircle2 size={22} className="mt-0.5 shrink-0" aria-hidden="true" /> Listo. Tu ticket ya está con la coordinación.
          </p>
        ) : ticket === 'form' ? (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              crearTicket({ ...t, correo: usuario?.correo })
              setTicket('hecho')
            }}
          >
            <input value={t.asunto} onChange={(e) => setT({ ...t, asunto: e.target.value })} maxLength={90} aria-label="Asunto" placeholder="Asunto (opcional)" className={campo} />
            <textarea value={t.mensaje} onChange={(e) => setT({ ...t, mensaje: e.target.value })} rows={4} maxLength={500} aria-label="Cuéntanos qué necesitas" placeholder="Cuéntanos qué necesitas" className="w-full rounded-xl border border-borde bg-white p-4 text-base" />
            <Button type="submit" className="w-full" disabled={t.mensaje.trim().length < 5}>Enviar ticket</Button>
          </form>
        ) : (
          <Button className="w-full" variante="contorno" onClick={() => setTicket('form')}>Crear ticket de soporte</Button>
        )}
      </section>
    </Modal>
  )
}
