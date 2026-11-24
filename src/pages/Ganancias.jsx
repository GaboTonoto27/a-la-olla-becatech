import { useMemo } from 'react'
import { Lightbulb } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useAhora } from '../lib/useAhora.js'
import { resumenSemana } from '../lib/economia.js'
import { sugerenciasVendedor } from '../lib/insights.js'
import PanelEconomico from '../components/cuenta/PanelEconomico.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'

function Sugerencias() {
  const { usuario, apartados, lotes, miPuesto, devoluciones, sinCelular } = useApp()
  const ahora = useAhora(60000)
  const plan = miPuesto?.plan ?? 'popular'
  const lista = useMemo(() => {
    const resumen = resumenSemana(apartados, usuario.id, true, plan, ahora, devoluciones)
    const mios = lotes.filter((l) => l.vendedorId === usuario.id)
    return sugerenciasVendedor({ apartados, vendedorId: usuario.id, lotes: mios, resumen, sinCelular: sinCelular(usuario.id), plan })
  }, [apartados, lotes, usuario.id, plan, ahora, devoluciones, sinCelular])

  return (
    <Card className="space-y-3">
      <h2 className="flex items-center gap-2 text-2xl"><Lightbulb size={24} className="text-ambar" aria-hidden="true" /> Consejos pa' tu puesto</h2>
      <p className="text-base text-piedra">Salen de tus propios números. Son sugerencias, tú decides.</p>
      <ul className="space-y-3">
        {lista.map((s) => (
          <li key={s.id} className="rounded-xl border border-borde bg-marfil p-3">
            <p className="text-lg font-bold">{s.titulo}</p>
            <p className="text-base">{s.texto}</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}

// Ganancias e Insights: lo que recuperaste frente a la cuota, el PDF de la semana y consejos prácticos.
export default function Ganancias() {
  const { modo } = useApp()
  if (modo !== 'vendedor') {
    return (
      <Card className="mx-auto max-w-lg space-y-3 text-center">
        <p className="text-2xl font-bold">Esta pantalla es pa' vendedores</p>
        <p className="text-base text-piedra">Aquí ves tus ganancias de venta. Tus ahorros de compra están en Mi cuenta.</p>
        <Button to="/cuenta">Ir a Mi cuenta</Button>
      </Card>
    )
  }
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <h1 className="text-3xl sm:text-4xl">Ganancias e Insights</h1>
        <p className="mt-1 text-lg text-piedra">Cuánto recuperaste esta semana y qué puedes mejorar.</p>
      </div>
      <PanelEconomico />
      <Sugerencias />
    </div>
  )
}
