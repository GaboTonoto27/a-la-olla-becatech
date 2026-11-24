import { Sprout, ChefHat, BadgeCheck, Star, Store, TrendingDown } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { infoPrecio } from '../../lib/precios.js'
import { NIVELES } from '../../data/semilla.js'
import Precio from '../ui/Precio.jsx'
import Pill from '../ui/Pill.jsx'
import Button from '../ui/Button.jsx'
import FotoLote from './FotoLote.jsx'
import TiempoBarra from './TiempoBarra.jsx'
import SinCelularAviso from '../SinCelularAviso.jsx'
import { SelloFrio } from '../puestos/Sellos.jsx'
import { cant } from '../../lib/unidades.js'

export default function LoteCard({ lote, ahora, onApartar }) {
  const { usuario, modo, sinCelular, estandaresDe } = useApp()
  const esMio = lote.vendedorId === usuario.id
  const frio = estandaresDe(lote.vendedorId).frio ?? lote.frio
  // Rebaja solo si el precio final quedó por debajo del normal; si no, va la etiqueta de calidad (Extra o Regular).
  const info = infoPrecio(lote.normal, lote.rescate, lote.calidad)
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
            {[lote.motivo, `ideal pa' ${lote.uso.toLowerCase()}`].filter(Boolean).join(' · ')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Pill tono={cria ? 'ambar' : 'olla'} icono={cria ? Sprout : ChefHat}>
            {NIVELES[lote.nivel]}
          </Pill>
          {info.rebaja && <Pill tono="tomate" icono={TrendingDown}>Rebaja −{info.pct}%</Pill>}
          {info.etiqueta && <Pill icono={Star}>{info.etiqueta}</Pill>}
          <SelloFrio frio={Boolean(frio)} />
        </div>

        <div>
          <Precio normal={lote.normal} rescate={lote.rescate} unidad={lote.unidad} ciudad={lote.ciudad} />
          <p className="mt-1 text-sm font-semibold text-piedra">
            {info.rebaja ? `Ahorras ${info.pct}% · ` : ''}quedan {cant(lote.cantidad, lote.unidad)}
          </p>
        </div>

        <TiempoBarra lote={lote} ahora={ahora} />
        {sinCelular(lote.vendedorId) && <SinCelularAviso />}

        {esMio ? (
          <div className="mt-auto space-y-2">
            <Pill tono="olla" icono={Store}>Tu lote publicado</Pill>
            <Button to={modo === 'vendedor' ? '/ultima-hora' : '/cuenta'} variante="contorno" className="w-full">
              {modo === 'vendedor' ? "Gestionar en Pon pa' la olla" : 'Gestionar en Mi cuenta'}
            </Button>
          </div>
        ) : (
          <div className="mt-auto space-y-1">
            <Button className="w-full" icono={BadgeCheck} onClick={() => onApartar(lote)}>
              Apartar lote
            </Button>
            <p className="text-center text-sm text-piedra">Sin pago adelantado · Pagas al revisar</p>
          </div>
        )}
      </div>
    </article>
  )
}
