import { Moon } from 'lucide-react'
import { AVISO_PLAZA_CERRADA, plazaAbierta } from '../../lib/horario.js'
import Card from '../ui/Card.jsx'

// Solo aparece fuera del horario real de la plaza. Dentro del horario no muestra nada.
export default function AvisoHorario({ ahora }) {
  if (plazaAbierta(ahora)) return null
  return (
    <Card className="flex items-start gap-3 border-[#EBCFA6] bg-[#FBEFDD]" role="status">
      <Moon size={24} className="mt-0.5 shrink-0 text-ambar" aria-hidden="true" />
      <p className="text-base font-semibold">{AVISO_PLAZA_CERRADA}</p>
    </Card>
  )
}
