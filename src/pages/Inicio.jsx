import { ShoppingBasket, Zap, MapPin, Home } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Pill from '../components/ui/Pill.jsx'

export default function Inicio() {
  const { usuario, modo } = useApp()
  const vende = modo === 'vendedor'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-carbon sm:text-4xl">Buenas, {usuario.nombre}</h1>
        <p className="mt-1 text-lg text-piedra">
          {vende ? `Tu puesto: ${usuario.negocio}` : '¿Qué vas a cocinar hoy?'}
        </p>
      </div>

      {vende && usuario.sinCelular && (
        <Card className="flex items-start gap-3 border-[#EBCFA6] bg-[#FBEFDD]">
          <Home size={24} className="mt-0.5 shrink-0 text-ambar" aria-hidden="true" />
          <div>
            <p className="font-bold text-ambar">Modo Sin Celular en el puesto</p>
            <p className="text-base text-carbon">Los encargos los contestas desde la casa. Los compradores ya lo saben.</p>
          </div>
        </Card>
      )}

      {vende ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <Pill tono="tomate" icono={Zap}>Última hora</Pill>
            <h2 className="mt-3 text-2xl">Publica lo que te sobra</h2>
            <p className="mb-4 mt-1 text-base text-piedra">En 3 toques: qué es, cuántos kilos y el precio.</p>
            <Button to="/ultima-hora" icono={Zap} variante="acento" className="w-full">Publicar sobrantes</Button>
          </Card>
          <Card>
            <Pill tono="olla" icono={ShoppingBasket}>Pedidos</Pill>
            <h2 className="mt-3 text-2xl">Lo que están pidiendo</h2>
            <p className="mb-4 mt-1 text-base text-piedra">Mira qué necesitan cocinar hoy y ofrece tu precio.</p>
            <Button to="/pedidos" variante="contorno" className="w-full">Ver pedidos</Button>
          </Card>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <Pill tono="olla" icono={ShoppingBasket}>Pide pa' tu olla</Pill>
            <h2 className="mt-3 text-2xl">Cuéntanos qué vas a cocinar</h2>
            <p className="mb-4 mt-1 text-base text-piedra">Pide temprano y recoge a tu hora.</p>
            <Button to="/pedidos" className="w-full">Hacer un pedido</Button>
          </Card>
          <Card>
            <Pill tono="tomate" icono={Zap}>Última hora</Pill>
            <h2 className="mt-3 text-2xl">Comida buena a menor precio</h2>
            <p className="mb-4 mt-1 text-base text-piedra">Lo que sale antes del cierre de la plaza.</p>
            <Button to="/mapa" icono={MapPin} variante="contorno" className="w-full">Ver puestos cerca</Button>
          </Card>
        </div>
      )}

      <p className="text-base text-piedra">
        Estamos armando esta parte. Pronto vas a poder hacer todo desde aquí.
      </p>
    </div>
  )
}
