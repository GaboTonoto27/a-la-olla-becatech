import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Ban, BellOff, BellRing, Flag, Send, ShieldCheck } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { nombreOtro } from '../components/chat/nombres.js'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import DenunciarModal from '../components/DenunciarModal.jsx'

const RAPIDAS = {
  comprador: ['Ya voy saliendo', '¿Me lo guardas 15 min?', 'Ya llegué al puesto', '¿Aceptas Nequi o solo efectivo?'],
  vendedor: ['Listo para recoger', 'Te lo guardo 15 minutos', 'Ya está apartado, trae tu código', 'Te espero en el puesto'],
}
const AVISOS = {
  telefono: 'Por seguridad no se comparten teléfonos ni WhatsApp. Hablen por aquí.',
  bloqueado: 'Este chat está bloqueado.',
}

function hora(t) {
  return new Date(t).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })
}

export default function Chat() {
  const { id } = useParams()
  const { usuario, chats, cuentaPorId, puestoPorId, enviarMensaje, marcarLeido, silenciarChat, bloquearChat } = useApp()
  const [texto, setTexto] = useState('')
  const [aviso, setAviso] = useState('')
  const [denunciando, setDenunciando] = useState(false)
  const fin = useRef(null)
  const chat = chats.find((c) => c.id === id)
  const mio = chat && (chat.compradorId === usuario.id || chat.vendedorId === usuario.id)
  const totalMensajes = chat?.mensajes.length ?? 0

  useEffect(() => {
    if (!mio) return
    marcarLeido(id)
    fin.current?.scrollIntoView({ block: 'end' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, totalMensajes, mio])

  if (!chat || !mio) {
    return (
      <Card className="mx-auto max-w-lg space-y-3 text-center">
        <p className="text-2xl font-bold">No encontramos esa conversación</p>
        <Button to="/chat">Ver mis chats</Button>
      </Card>
    )
  }

  const otro = nombreOtro(chat, usuario.id, cuentaPorId, puestoPorId)
  const silenciado = Boolean(chat.silenciado[usuario.id])
  const bloqueadoPorMi = chat.bloqueadoPor === usuario.id
  const bloqueado = Boolean(chat.bloqueadoPor)
  // Mi rol depende de ESTE hilo: si el puesto del chat es el mío, hablo como vendedor; si no, como comprador.
  const miRol = chat.vendedorId === usuario.id ? 'vendedor' : 'comprador'

  const enviar = (t) => {
    const r = enviarMensaje(chat.id, t)
    if (r.ok) {
      setTexto('')
      setAviso('')
    } else if (r.motivo !== 'vacio') setAviso(AVISOS[r.motivo])
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-3">
      <Link to="/chat" className="inline-flex min-h-[48px] items-center gap-2 text-base font-bold text-olla">
        <ArrowLeft size={20} aria-hidden="true" /> Mis chats
      </Link>

      <Card className="space-y-3 !p-4">
        <div>
          <h1 className="text-2xl">{otro.nombre}</h1>
          {chat.contexto && <p className="text-base font-semibold text-olla">{chat.contexto}</p>}
          <p className="mt-1 flex items-center gap-1.5 text-sm text-piedra">
            <ShieldCheck size={16} aria-hidden="true" /> Chat seguro: nadie ve tu número.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button variante="suave" icono={silenciado ? BellRing : BellOff} className="!px-2 text-sm" onClick={() => silenciarChat(chat.id)}>
            {silenciado ? 'Activar' : 'Silenciar'}
          </Button>
          <Button variante="suave" icono={Ban} className="!px-2 text-sm" onClick={() => bloquearChat(chat.id)} disabled={bloqueado && !bloqueadoPorMi}>
            {bloqueadoPorMi ? 'Desbloquear' : 'Bloquear'}
          </Button>
          <Button variante="suave" icono={Flag} className="!px-2 text-sm" onClick={() => setDenunciando(true)}>
            Denunciar
          </Button>
        </div>
      </Card>

      <div className="min-h-[240px] space-y-2 rounded-2xl border border-borde bg-white p-3" aria-live="polite">
        {chat.mensajes.length === 0 && <p className="py-8 text-center text-base text-piedra">Toca un mensaje rápido o escribe el tuyo.</p>}
        {chat.mensajes.map((m) => {
          const mio = m.de === usuario.id
          return (
            <div key={m.id} className={`flex ${mio ? 'justify-end' : 'justify-start'}`}>
              <p className={`max-w-[85%] rounded-2xl px-4 py-2 text-base ${mio ? 'bg-olla text-white' : 'border border-borde bg-marfil'}`}>
                {m.texto}
                <span className={`mt-0.5 block text-xs ${mio ? 'text-white/80' : 'text-piedra'}`}>{hora(m.t)}</span>
                {m.auto && <span className="mt-1 block text-xs font-semibold text-piedra">Respuesta automática de prototipo · En operación real contesta el {m.rolAuto === 'comprador' ? 'comprador' : 'vendedor'}</span>}
              </p>
            </div>
          )
        })}
        <div ref={fin} />
      </div>

      {bloqueado ? (
        <p className="rounded-xl border border-borde bg-white p-3 text-base font-semibold text-piedra">
          {bloqueadoPorMi ? 'Bloqueaste este chat. Toca "Desbloquear" pa' + "' volver a escribir." : 'Esta persona bloqueó el chat.'}
        </p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Respuestas rápidas">
            {RAPIDAS[miRol].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => enviar(r)}
                className="min-h-[48px] rounded-full border border-olla bg-white px-4 text-base font-bold text-olla hover:bg-marfil"
              >
                {r}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              enviar(texto)
            }}
          >
            <input
              value={texto}
              maxLength={400}
              onChange={(e) => setTexto(e.target.value)}
              aria-label="Tu mensaje"
              placeholder="Escribe tu mensaje"
              className="min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base"
            />
            <Button type="submit" icono={Send} disabled={!texto.trim()} aria-label="Enviar mensaje" />
          </form>
          {aviso && <p role="alert" className="text-base font-bold text-[#A8391B]">{aviso}</p>}
        </>
      )}

      {denunciando && (
        <DenunciarModal
          titulo="Denunciar este chat"
          tipo="chat"
          objetivo={{ id: otro.id, nombre: otro.nombre }}
          referencia={chat.contexto}
          onCerrar={() => setDenunciando(false)}
        />
      )}
    </div>
  )
}
