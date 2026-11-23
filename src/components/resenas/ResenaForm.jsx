import { useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'
import Estrellas from './Estrellas.jsx'

const CRITERIOS = [
  { id: 'puntualidad', etiqueta: 'Puntualidad' },
  { id: 'trato', etiqueta: 'Trato' },
  { id: 'aptitud', etiqueta: "Aptitud pa' cocinar" },
]

// Solo aparece después de "Lo revisé y me lo llevo" con tu código OLLA-###. Así no hay reseñas falsas.
export default function ResenaForm({ apartado }) {
  const { crearResena } = useApp()
  const [f, setF] = useState({ puntualidad: 0, trato: 0, aptitud: 0, comentario: '', cumplio: null })
  const [hecho, setHecho] = useState(false)
  const completo = f.puntualidad && f.trato && f.aptitud && f.cumplio !== null

  if (hecho) {
    return (
      <p className="flex items-center gap-2 rounded-xl border border-[#BCD8C5] bg-[#E7F1EA] p-3 text-base font-bold text-olla">
        <BadgeCheck size={22} aria-hidden="true" /> ¡Gracias! Tu reseña quedó con el sello de compra verificada.
      </p>
    )
  }

  return (
    <Card className="space-y-4 border-[#BCD8C5] bg-[#F4F9F5]">
      <div>
        <p className="flex items-center gap-2 text-lg font-bold text-olla">
          <BadgeCheck size={22} aria-hidden="true" /> Califica tu compra verificada
        </p>
        <p className="text-base text-piedra">Tu código {apartado.codigo} confirma que sí compraste en {apartado.puesto}.</p>
      </div>
      {CRITERIOS.map((c) => (
        <div key={c.id}>
          <p className="text-base font-bold">{c.etiqueta}</p>
          <Estrellas valor={f[c.id]} onChange={(n) => setF({ ...f, [c.id]: n })} etiqueta={c.etiqueta} />
        </div>
      ))}
      <div>
        <p className="mb-2 text-base font-bold">¿El puesto cumplió lo que decía en sus sellos?</p>
        <div className="flex gap-2">
          <Chip activo={f.cumplio === true} onClick={() => setF({ ...f, cumplio: true })}>Sí cumplió</Chip>
          <Chip activo={f.cumplio === false} onClick={() => setF({ ...f, cumplio: false })}>No cumplió</Chip>
        </div>
      </div>
      <div>
        <label htmlFor={`com-${apartado.id}`} className="mb-1 block text-base font-bold">Comentario (opcional)</label>
        <textarea
          id={`com-${apartado.id}`}
          rows={3}
          maxLength={300}
          value={f.comentario}
          onChange={(e) => setF({ ...f, comentario: e.target.value })}
          className="w-full rounded-xl border border-borde bg-white p-3 text-base"
          placeholder="Cuenta cómo te fue, con respeto."
        />
      </div>
      <Button className="w-full" disabled={!completo} onClick={() => crearResena({ apartadoId: apartado.id, ...f }) && setHecho(true)}>
        Publicar mi reseña
      </Button>
    </Card>
  )
}
