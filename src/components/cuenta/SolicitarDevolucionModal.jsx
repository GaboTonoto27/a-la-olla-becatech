import { useState } from 'react'
import { CheckCircle2, Undo2 } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { TIPOS_COMPRA, TIPOS_CUOTA } from '../../lib/devoluciones.js'
import { dinero } from '../../lib/dinero.js'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'

const campo = 'min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base'

// clase "compra": el comprador pide plata o cambio de un apartado ya entregado.
// clase "cuota": el vendedor pide devolución o saldo a favor de su cuota semanal (hasta `montoMax`).
export default function SolicitarDevolucionModal({ clase, apartado, montoMax = 0, puestoNombre, onCerrar }) {
  const { solicitarDevolucion } = useApp()
  const tipos = clase === 'compra' ? TIPOS_COMPRA : TIPOS_CUOTA
  const [tipo, setTipo] = useState(tipos[0].id)
  const [motivo, setMotivo] = useState('')
  const [monto, setMonto] = useState(montoMax)
  const [hecho, setHecho] = useState(false)
  const montoOk = clase === 'compra' || (monto > 0 && monto <= montoMax)
  const valido = motivo.trim().length >= 5 && montoOk

  const enviar = (e) => {
    e.preventDefault()
    if (!valido) return
    const r = solicitarDevolucion({ clase, tipo, motivo, apartado, monto, puestoNombre })
    if (r) setHecho(true)
  }

  if (hecho) {
    return (
      <Modal titulo="Solicitud enviada" cerrable onCerrar={onCerrar} pie={<Button className="w-full" onClick={onCerrar}>Listo</Button>}>
        <p className="flex items-start gap-2 text-base">
          <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
          La coordinación la va a revisar y te responde con una nota. Ves el estado aquí mismo, en Mi cuenta.
        </p>
      </Modal>
    )
  }

  return (
    <Modal
      titulo={clase === 'compra' ? 'Solicitar devolución / reembolso' : 'Garantía y devolución de cuota'}
      cerrable
      onCerrar={onCerrar}
      pie={
        <div className="space-y-1">
          <Button type="submit" form="form-devolucion" icono={Undo2} className="w-full" disabled={!valido}>Enviar solicitud</Button>
          <button type="button" onClick={onCerrar} className="min-h-[48px] w-full text-base font-semibold text-piedra underline">Cancelar</button>
        </div>
      }
    >
      {apartado && (
        <p className="mb-3 text-base text-piedra">
          <b className="text-carbon">{apartado.producto}</b> · {apartado.cantidad} {apartado.unidad} · {dinero(apartado.total)} · {apartado.puesto}
        </p>
      )}
      <form id="form-devolucion" onSubmit={enviar} className="space-y-4">
        <fieldset>
          <legend className="mb-2 text-base font-bold">¿Qué necesitas?</legend>
          <div className="space-y-2">
            {tipos.map((t) => (
              <label
                key={t.id}
                className={`flex min-h-[56px] cursor-pointer items-center gap-3 rounded-xl border p-3 ${tipo === t.id ? 'border-olla bg-[#E7F1EA]' : 'border-borde bg-white'}`}
              >
                <input type="radio" name="tipo-dev" checked={tipo === t.id} onChange={() => setTipo(t.id)} className="h-5 w-5 accent-[#1B5E3A]" />
                <span>
                  <span className="block text-base font-bold">{t.etiqueta}</span>
                  <span className="block text-sm text-piedra">{t.detalle}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {clase === 'cuota' && (
          <div>
            <label htmlFor="dev-monto" className="mb-1 block text-base font-bold">¿Cuánto? (máximo {dinero(montoMax)})</label>
            <input id="dev-monto" type="number" inputMode="numeric" min={100} max={montoMax} step={100} value={monto} onChange={(e) => setMonto(Number(e.target.value))} className={campo} />
          </div>
        )}

        <div>
          <label htmlFor="dev-motivo" className="mb-1 block text-base font-bold">
            {clase === 'compra' ? 'Cuéntanos el motivo' : 'Cuéntanos qué pasó (falla o fuerza mayor)'}
          </label>
          <textarea
            id="dev-motivo"
            rows={4}
            maxLength={400}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder={clase === 'compra' ? 'Ej.: Pagué por Nequi y al abrir la bolsa varias frutas estaban dañadas por dentro.' : 'Ej.: Se me dañó la nevera y no pude vender esta semana.'}
            className="w-full rounded-xl border border-borde bg-white p-4 text-base"
          />
        </div>
      </form>
    </Modal>
  )
}
