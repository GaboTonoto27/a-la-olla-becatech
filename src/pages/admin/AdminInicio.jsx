import { LogOut, ShieldCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'

export default function AdminInicio() {
  const { salir } = useApp()
  return (
    <div className="space-y-4">
      <Card className="flex items-start gap-3">
        <ShieldCheck size={28} className="mt-1 shrink-0 text-olla" aria-hidden="true" />
        <div>
          <h1 className="text-3xl">Panel de coordinación</h1>
          <p className="mt-1 text-lg text-piedra">
            Aquí vas a ver usuarios, denuncias, soporte y las cifras de la plaza. Lo estamos armando.
          </p>
        </div>
      </Card>
      <Button variante="contorno" icono={LogOut} onClick={salir}>
        Salir
      </Button>
    </div>
  )
}
