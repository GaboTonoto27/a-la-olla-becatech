import { Snowflake, Thermometer } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { ESTANDARES, TEXTO_AMBIENTE, TEXTO_FRIO } from '../../data/estandares.js'
import Pill from '../ui/Pill.jsx'
import SinCelularAviso from '../SinCelularAviso.jsx'

// Sello de nevera: el azul es solo pa' refrigeración. Sin nevera se dice claro y con respeto.
export function SelloFrio({ frio }) {
  return frio ? (
    <Pill tono="frio" icono={Snowflake}>{TEXTO_FRIO}</Pill>
  ) : (
    <Pill icono={Thermometer}>{TEXTO_AMBIENTE}</Pill>
  )
}

// Los mismos sellos en tarjetas, directorio y perfil. `completo` agrega todos los estándares prendidos.
export default function Sellos({ vendedorId, completo = false, avisoSinCelular = false }) {
  const { estandaresDe, sinCelular } = useApp()
  const e = estandaresDe(vendedorId)
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <SelloFrio frio={Boolean(e.frio)} />
        {completo &&
          ESTANDARES.filter((s) => s.id !== 'frio' && e[s.id]).map((s) => (
            <Pill key={s.id} tono="olla">{s.etiqueta}</Pill>
          ))}
      </div>
      {completo && e.texto && <p className="text-base text-piedra">“{e.texto}”</p>}
      {avisoSinCelular && sinCelular(vendedorId) && <SinCelularAviso />}
    </div>
  )
}
