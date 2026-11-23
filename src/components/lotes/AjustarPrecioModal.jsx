import { useState } from 'react'
import { useApp } from '../../context/AppContext.jsx'
import { descuento, dinero } from '../../lib/dinero.js'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'

// Rebaja rápida de un lote que ya está en vitrina: -10 %, -20 %, -30 % o el precio que quiera.
export default function AjustarPrecioModal({ lote, onCerrar }) {
  const { ajustarPrecio } = useApp()
  const [precio, setPrecio] = useState(lote.rescate)
  const rebaja = (pct) => setPrecio(Math.max(1, Math.round(lote.rescate * (1 - pct / 100))))
  const cambio = lote.rescate > 0 ? Math.round((precio / lote.rescate - 1) * 100) : 0

  const guardar = () => {
    ajustarPrecio(lote.id, precio)
    onCerrar()
  }

  return (
    <Modal
      titulo={`Ajustar precio de ${lote.producto}`}
      cerrable
      onCerrar={onCerrar}
      pie={
        <div className="grid grid-cols-2 gap-2">
          <Button variante="suave" onClick={onCerrar}>Ahora no</Button>
          <Button disabled={!(precio >= 1) || precio === lote.rescate} onClick={guardar}>Guardar precio</Button>
        </div>
      }
    >
      <p className="mb-3 text-base text-piedra">
        Ahora está a {dinero(lote.rescate, lote.ciudad)}/{lote.unidad}. El cambio se ve de una en el catálogo.
      </p>
      <div className="mb-3 flex flex-wrap gap-2">
        {[10, 20, 30].map((p) => (
          <Chip key={p} onClick={() => rebaja(p)} activo={precio === Math.max(1, Math.round(lote.rescate * (1 - p / 100)))}>
            −{p}%
          </Chip>
        ))}
      </div>
      <label className="mb-1 block text-base font-bold" htmlFor="precio-nuevo">O escribe el precio por {lote.unidad}</label>
      <input
        id="precio-nuevo"
        type="number"
        inputMode="numeric"
        min="1"
        value={precio || ''}
        onChange={(e) => setPrecio(Number(e.target.value))}
        className="min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base"
      />
      <div className="mb-3 mt-3 rounded-2xl border border-borde bg-white p-4">
        <p className="font-titulo text-3xl font-extrabold text-olla">{dinero(precio || 0, lote.ciudad)}<span className="text-base">/{lote.unidad}</span></p>
        <p className="text-base text-piedra">
          {precio >= lote.normal
            ? 'Sin rebaja frente al precio normal.'
            : `Ahorro pa' el comprador: ${descuento(Math.max(lote.normal, precio), precio)}%`}
          {cambio !== 0 && ` · ${cambio > 0 ? '+' : '−'}${Math.abs(cambio)}% frente a hoy`}
        </p>
      </div>
    </Modal>
  )
}
