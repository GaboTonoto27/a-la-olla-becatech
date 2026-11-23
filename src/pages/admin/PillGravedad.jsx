import { ETIQUETA_NIVEL } from '../../lib/copiloto.js'
import Pill from '../../components/ui/Pill.jsx'

const TONO = { alta: 'tomate', media: 'ambar', baja: 'neutro' }

export default function PillGravedad({ nivel }) {
  return <Pill tono={TONO[nivel]}>Gravedad {ETIQUETA_NIVEL[nivel].toLowerCase()}</Pill>
}
