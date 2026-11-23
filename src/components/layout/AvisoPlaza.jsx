import { Info } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Card from '../ui/Card.jsx'

// Cintillo en las plazas de muestra.
export default function AvisoPlaza() {
  const { ciudad } = useApp()
  if (ciudad.piloto) return null
  return (
    <div className="space-y-3">
      <Card className="flex items-start gap-3 border-[#B5D9E3] bg-[#E2F1F5]">
        <Info size={22} className="mt-0.5 shrink-0 text-frio" aria-hidden="true" />
        <p className="text-base">
          <b>Vista de replicabilidad · Plaza independiente (datos de muestra).</b> Cada ciudad opera con sus propios puestos
          locales. Precios en {ciudad.codigo} ({ciudad.moneda}), atendidos por la {ciudad.coordinador}.
        </p>
      </Card>
    </div>
  )
}
