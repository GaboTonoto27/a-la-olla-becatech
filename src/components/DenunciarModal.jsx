import { useState } from 'react'
import { CheckCircle2, ShieldAlert } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import Modal from './ui/Modal.jsx'
import Button from './ui/Button.jsx'

const campo = 'min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base'

// Formulario abierto (sin lista rígida): asunto + explicación. Llega en vivo al Panel del Admin.
// modo "rechazo": una sola pregunta corta (el motivo) pa' no demorar a quien está en el puesto.
export default function DenunciarModal({ titulo, tipo, objetivo, referencia = '', asuntoInicial = '', breve = false, onCerrar, onEnviada }) {
  const { usuario, denunciar } = useApp()
  const [asunto, setAsunto] = useState(asuntoInicial)
  const [detalle, setDetalle] = useState('')
  const [hecho, setHecho] = useState(false)
  const valido = detalle.trim().length >= 5 && asunto.trim().length >= 3

  const enviar = (e) => {
    e.preventDefault()
    if (!valido) return
    denunciar({
      tipo, autorId: usuario.id, autorNombre: usuario.nombre, objetivoId: objetivo.id, objetivoNombre: objetivo.nombre,
      asunto, detalle, ref: referencia,
    })
    setHecho(true)
    onEnviada?.()
  }

  if (hecho) {
    return (
      <Modal titulo="Recibimos tu aviso" cerrable onCerrar={onCerrar} pie={<Button className="w-full" onClick={onCerrar}>Listo</Button>}>
        <p className="flex items-start gap-2 text-base">
          <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
          Ya le llegó a la coordinación. Van a investigar escuchando a las dos partes. Gracias por cuidar la plaza.
        </p>
      </Modal>
    )
  }

  return (
    <Modal
      titulo={titulo}
      cerrable
      onCerrar={onCerrar}
      pie={
        <div className="space-y-1">
          <Button type="submit" form="form-denuncia" icono={ShieldAlert} className="w-full" disabled={!valido}>
            Enviar a la coordinación
          </Button>
          <button type="button" onClick={onCerrar} className="min-h-[48px] w-full text-base font-semibold text-piedra underline">Cancelar</button>
        </div>
      }
    >
      <p className="mb-3 text-base text-piedra">Sobre: <b className="text-carbon">{objetivo.nombre}</b></p>
      <form id="form-denuncia" onSubmit={enviar} className="space-y-4">
        {!breve && (
          <div>
            <label htmlFor="den-asunto" className="mb-1 block text-base font-bold">Asunto</label>
            <input id="den-asunto" className={campo} value={asunto} maxLength={80} onChange={(e) => setAsunto(e.target.value)} placeholder="Ej.: Me dieron producto distinto al apartado" />
          </div>
        )}
        <div>
          <label htmlFor="den-detalle" className="mb-1 block text-base font-bold">{breve ? '¿Por qué lo rechazas? (breve)' : 'Cuéntanos qué pasó'}</label>
          <textarea
            id="den-detalle"
            rows={breve ? 3 : 5}
            maxLength={500}
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            placeholder={breve ? 'Ej.: El tomate estaba podrido por dentro.' : 'Escribe con tus palabras, sin afán. Mientras más claro, mejor.'}
            className="w-full rounded-xl border border-borde bg-white p-4 text-base"
          />
        </div>
      </form>
    </Modal>
  )
}
