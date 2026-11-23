import { SearchX } from 'lucide-react'
import Button from '../components/ui/Button.jsx'

export default function NoEncontrado() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 text-center">
      <SearchX size={48} className="text-tomate" aria-hidden="true" />
      <h1 className="mt-4 text-4xl">Aquí no hay nada</h1>
      <p className="mb-6 mt-2 text-lg text-piedra">Esta página no existe o se movió de lugar.</p>
      <Button to="/">Volver al inicio</Button>
    </main>
  )
}
