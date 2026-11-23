import { Hammer } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'

export default function Proximamente({ titulo }) {
  return (
    <Card className="mx-auto mt-6 max-w-lg text-center">
      <Hammer size={40} className="mx-auto text-ambar" aria-hidden="true" />
      <h1 className="mt-3 text-3xl">{titulo}</h1>
      <p className="mb-5 mt-2 text-lg text-piedra">Esta parte la estamos terminando. Vuelve pronto.</p>
      <Button to="/">Volver al inicio</Button>
    </Card>
  )
}
