import { useState } from 'react'
import { Banknote, CheckCircle2, MapPin } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { dinero } from '../../lib/dinero.js'
import { textoRestante } from '../../lib/tiempo.js'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Contador from '../ui/Contador.jsx'

// Apartar no cuesta nada: se paga en efectivo cuando el comprador revisa la comida en el puesto.
export default function ApartarModal({ lote, onCerrar }) {
  const { apartar } = useApp()
  const [cantidad, setCantidad] = useState(Math.min(2, lote.cantidad))
  const [apartado, setApartado] = useState(null)
  const [error, setError] = useState(false)

  const confirmar = () => {
    const a = apartar(lote.id, cantidad)
    if (a) setApartado(a)
    else setError(true)
  }

  if (apartado) {
    return (
      <Modal
        titulo="¡Quedó apartado!"
        cerrable
        onCerrar={onCerrar}
        pie={<Button className="w-full" onClick={onCerrar}>Listo</Button>}
      >
        <div className="mb-3 rounded-2xl border border-[#BCD8C5] bg-[#E7F1EA] p-4 text-center">
          <p className="flex items-center justify-center gap-2 text-base font-bold text-olla">
            <CheckCircle2 size={20} aria-hidden="true" /> Tu código de recogida
          </p>
          <p className="my-1 font-titulo text-5xl font-extrabold tracking-wide text-carbon">{apartado.codigo}</p>
          <p className="text-base text-piedra">Díselo al vendedor cuando llegues.</p>
        </div>
        <ul className="space-y-2 text-base">
          <li>
            <b>{apartado.cantidad} {apartado.unidad}</b> de {apartado.producto} en {apartado.puesto}
          </li>
          <li className="flex gap-2">
            <MapPin size={20} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
            Barrio {apartado.barrio}. La dirección exacta sale después, en el mapa.
          </li>
          <li className="flex gap-2">
            <Banknote size={20} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
            <span>A pagar al revisar: <b>{dinero(apartado.total, apartado.ciudad)}</b> en efectivo. No se cobró nada ahora.</span>
          </li>
        </ul>
        <p className="mt-3 text-base text-piedra">Si al revisar no te gusta, lo rechazas sin pagar nada.</p>
      </Modal>
    )
  }

  const total = cantidad * lote.rescate
  return (
    <Modal
      titulo={`Apartar ${lote.producto}`}
      cerrable
      onCerrar={onCerrar}
      pie={
        <div className="space-y-1">
          <Button className="w-full" onClick={confirmar} icono={Banknote}>
            Apartar gratis (Pago en efectivo al revisar)
          </Button>
          <button type="button" onClick={onCerrar} className="min-h-[48px] w-full text-base font-semibold text-piedra underline">
            Ahora no
          </button>
        </div>
      }
    >
      <p className="mb-3 text-base text-piedra">
        {lote.puesto} · {lote.barrio}. {textoRestante(lote.vence)}.
      </p>
      <p className="mb-2 text-base font-bold">¿Cuánto quieres?</p>
      <Contador valor={cantidad} onChange={setCantidad} max={lote.cantidad} unidad={lote.unidad} etiqueta="Cantidad a apartar" />
      <div className="mt-4 rounded-2xl border border-borde bg-white p-4">
        <p className="text-base text-piedra">
          {cantidad} × {dinero(lote.rescate, lote.ciudad)}
        </p>
        <p className="font-titulo text-3xl font-extrabold text-olla">{dinero(total, lote.ciudad)}</p>
        <p className="mt-1 text-base text-piedra">Se paga en efectivo cuando revises la comida. Hoy no se cobra nada.</p>
      </div>
      {error && <p className="mt-3 font-bold text-[#A8391B]">Ese lote ya no está disponible. Mira los demás.</p>}
    </Modal>
  )
}
