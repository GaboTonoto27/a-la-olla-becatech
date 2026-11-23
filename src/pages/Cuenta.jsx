import { LogOut, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Pill from '../components/ui/Pill.jsx'

const ROL = { ambos: 'Compra y vende', vendedor: 'Vendedor', comprador: 'Comprador' }

export default function Cuenta() {
  const { usuario, salir, reiniciarDemo } = useApp()
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-3xl">Mi cuenta</h1>
      <Card>
        <p className="text-2xl font-bold">{usuario.nombre}</p>
        <p className="mb-3 text-base text-piedra">{usuario.negocio}</p>
        <div className="flex flex-wrap gap-2">
          <Pill tono="olla">{ROL[usuario.rol]}</Pill>
          {usuario.sinCelular && <Pill tono="ambar">Contesta desde la casa</Pill>}
        </div>
      </Card>
      <Button variante="contorno" icono={LogOut} className="w-full" onClick={salir}>
        Salir
      </Button>
      <Button variante="suave" icono={RotateCcw} className="w-full" onClick={reiniciarDemo}>
        Borrar datos de prueba
      </Button>
    </div>
  )
}
