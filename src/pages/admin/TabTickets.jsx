import { CheckCircle2 } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Pill from '../../components/ui/Pill.jsx'

const cuando = (t) => new Date(t).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

export default function TabTickets() {
  const { tickets, atenderTicket } = useApp()
  const lista = [...tickets].sort((a, b) => (a.estado === 'atendido') - (b.estado === 'atendido') || b.creado - a.creado)
  return (
    <section className="space-y-3" aria-label="Tickets de soporte">
      <h2 className="text-2xl">Tickets de soporte</h2>
      <p className="text-base text-piedra">Llegan desde el asistente de ayuda. Horario de atención: lunes a sábado, 6:00 a. m. a 4:00 p. m.</p>
      {lista.length === 0 ? (
        <Card><p className="text-base text-piedra">No hay tickets. Cuando alguien toque "Crear ticket de soporte" aparece aquí.</p></Card>
      ) : (
        <ul className="space-y-3">
          {lista.map((t) => (
            <li key={t.id}>
              <Card className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tono={t.estado === 'abierto' ? 'tomate' : 'olla'} icono={t.estado === 'atendido' ? CheckCircle2 : undefined}>
                    {t.estado === 'abierto' ? 'Abierto' : 'Atendido'}
                  </Pill>
                  <span className="ml-auto text-sm text-piedra">{cuando(t.creado)}</span>
                </div>
                <h3 className="text-xl">{t.asunto}</h3>
                <p className="text-sm text-piedra">De {t.autorNombre}{t.correo ? ` · ${t.correo}` : ''}</p>
                <p className="text-base">{t.mensaje}</p>
                {t.estado === 'abierto' && <Button variante="contorno" onClick={() => atenderTicket(t.id)}>Marcar como atendido</Button>}
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
