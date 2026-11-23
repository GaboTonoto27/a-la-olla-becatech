import { Snowflake, Sprout, ChefHat, BadgeCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { descuento } from '../../lib/dinero.js'
import { NIVELES } from '../../data/semilla.js'
import Precio from '../ui/Precio.jsx'
import Pill from '../ui/Pill.jsx'
import Button from '../ui/Button.jsx'
import FotoLote from './FotoLote.jsx'
import TiempoBarra from './TiempoBarra.jsx'
import SinCelularAviso from '../SinCelularAviso.jsx'

export default function LoteCard({ lote, ahora, onApartar }) {
  const { sinCelular } = useApp()
  const cria = lote.nivel === 'cria'
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-borde bg-white shadow-[0_1px_2px_rgba(28,31,29,0.04)]">
      <FotoLote lote={lote} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-sm font-semibold text-piedra">
            {lote.puesto} · {lote.barrio}
          </p>
          <h3 className="mt-0.5 text-2xl">{lote.producto}</h3>
          <p className="text-base text-piedra">
            {lote.motivo} · ideal pa' {lote.uso.toLowerCase()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Pill tono={cria ? 'ambar' : 'olla'} icono={cria ? Sprout : ChefHat}>
            {NIVELES[lote.nivel]}
          </Pill>
          {lote.frio ? (
            <Pill tono="frio" icono={Snowflake}>Con nevera</Pill>
          ) : (
            <Pill>Sin nevera — pa' consumo inmediato</Pill>
          )}
        </div>

        <div>
          <Precio normal={lote.normal} rescate={lote.rescate} unidad={lote.unidad} ciudad={lote.ciudad} />
          <p className="mt-1 text-sm font-semibold text-piedra">
            Ahorras {descuento(lote.normal, lote.rescate)}% · quedan {lote.cantidad} {lote.unidad}
          </p>
        </div>

        <TiempoBarra lote={lote} ahora={ahora} />
        {sinCelular(lote.vendedorId) && <SinCelularAviso />}

        <Button className="mt-auto w-full" icono={BadgeCheck} onClick={() => onApartar(lote)}>
          Apartar gratis
        </Button>
      </div>
    </article>
  )
}
