import { Home } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import Card from './ui/Card.jsx'
import Toggle from './ui/Toggle.jsx'

// Modo Sin Celular en Puesto: el vendedor no saca el celular en la calle y contesta encargos desde la casa.
export default function SinCelularCard() {
  const { usuario, sinCelular, cambiarSinCelular } = useApp()
  const activo = sinCelular(usuario.id)
  return (
    <Card className={activo ? 'border-[#EBCFA6] bg-[#FBEFDD]' : ''}>
      <div className="flex items-start gap-3">
        <Home size={24} className="mt-0.5 shrink-0 text-ambar" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-lg font-bold">Modo Sin Celular en Puesto</p>
          <p className="text-base text-piedra">
            {activo
              ? 'Activo: contestas encargos desde la casa (5–7 a. m. y 8–9 p. m.). Los compradores lo ven.'
              : 'Apagado: contestas encargos desde el puesto.'}
          </p>
        </div>
        <Toggle activo={activo} onChange={(v) => cambiarSinCelular(usuario.id, v)} etiqueta="Modo Sin Celular en Puesto (encargos desde casa)" />
      </div>
    </Card>
  )
}
