import { Link } from 'react-router-dom'
import { BellOff, MessageCircle } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { nombreOtro } from '../components/chat/nombres.js'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Punto from '../components/ui/Punto.jsx'

function hora(t) {
  return new Date(t).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })
}

export default function Chats() {
  const { usuario, chats, cuentaPorId, puestoPorId } = useApp()
  const mios = chats
    .filter((c) => c.compradorId === usuario.id || c.vendedorId === usuario.id)
    .sort((a, b) => (b.mensajes.at(-1)?.t ?? b.creado) - (a.mensajes.at(-1)?.t ?? a.creado))

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <h1 className="text-3xl sm:text-4xl">Chat</h1>
        <p className="mt-1 text-lg text-piedra">Habla con el puesto o el comprador sin dar tu número.</p>
      </div>
      {mios.length === 0 ? (
        <Card className="space-y-3 text-center">
          <MessageCircle size={40} className="mx-auto text-piedra" aria-hidden="true" />
          <p className="text-xl font-bold">Todavía no tienes conversaciones</p>
          <p className="text-base text-piedra">Cuando apartes algo o te respondan un pedido, escribes desde ahí y aparece aquí.</p>
          <Button to="/ultima-hora" className="w-full sm:w-auto">Ver última hora</Button>
        </Card>
      ) : (
        <ul className="space-y-3">
          {mios.map((c) => {
            const otro = nombreOtro(c, usuario.id, cuentaPorId, puestoPorId)
            const ultimo = c.mensajes.at(-1)
            const nuevo = !c.silenciado[usuario.id] && c.mensajes.some((m) => m.de !== usuario.id && m.t > (c.leido[usuario.id] ?? 0))
            return (
              <li key={c.id}>
                <Card as={Link} to={`/chat/${c.id}`} className="block space-y-1 !p-4 hover:bg-marfil">
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex items-center gap-2 text-lg font-bold">
                      {otro.nombre} {nuevo && <Punto texto="Mensajes sin leer" />}
                      {c.silenciado[usuario.id] && <BellOff size={16} className="text-piedra" aria-label="Silenciado" />}
                    </p>
                    {ultimo && <span className="text-sm text-piedra">{hora(ultimo.t)}</span>}
                  </div>
                  {c.contexto && <p className="text-sm font-semibold text-olla">{c.contexto}</p>}
                  <p className="truncate text-base text-piedra">
                    {ultimo ? `${ultimo.de === usuario.id ? 'Tú: ' : ''}${ultimo.texto}` : 'Escribe el primer mensaje'}
                  </p>
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
