import { useState } from 'react'
import { CheckCircle2, Clock, Scale } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { dinero } from '../../lib/dinero.js'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import Pill from '../ui/Pill.jsx'
import SinCelularAviso from '../SinCelularAviso.jsx'
import BotonChat from '../chat/BotonChat.jsx'

function Resumen({ p }) {
  return (
    <div>
      <p className="text-sm font-semibold text-piedra">{p.comprador}</p>
      <h3 className="text-2xl">{p.kg} kg de {p.producto}</h3>
      {p.cocino && <p className="text-base text-piedra">Pa' {p.cocino.charAt(0).toLowerCase() + p.cocino.slice(1)}</p>}
      <div className="mt-2 flex flex-wrap gap-2">
        <Pill icono={Clock} tono="ambar">{p.dia === 'mañana' ? 'Mañana' : 'Hoy'} a las {p.hora}</Pill>
        <Pill icono={Scale}>Paga hasta {dinero(p.presupuestoKg, p.ciudad)}/kg</Pill>
        <Pill tono="olla">{p.uso}</Pill>
      </div>
    </div>
  )
}

// Vista del vendedor: responde en 2 toques ("Responder" y luego aceptar o mandar su precio).
export function PedidoVendedor({ p }) {
  const { usuario, responderPedido } = useApp()
  const [abierto, setAbierto] = useState(false)
  const [precio, setPrecio] = useState(p.presupuestoKg)
  const mia = p.ofertas.find((o) => o.vendedorId === usuario.id)
  const ganoYo = p.estado === 'aceptado' && p.ganador?.vendedorId === usuario.id

  return (
    <Card className="space-y-3">
      <Resumen p={p} />
      {ganoYo ? (
        <p className="flex items-start gap-2 rounded-xl border border-[#BCD8C5] bg-[#E7F1EA] p-3 text-base font-bold text-olla">
          <CheckCircle2 size={22} className="mt-0.5 shrink-0" aria-hidden="true" />
          Te lo aceptaron a {dinero(p.ganador.precioKg, p.ciudad)}/kg. Alístalo pa' las {p.hora}.
        </p>
      ) : null}
      {ganoYo && p.compradorId ? (
        <BotonChat vendedorId={usuario.id} compradorId={p.compradorId} contexto={`Pedido: ${p.kg} kg de ${p.producto}`} className="w-full">
          Escribir al comprador
        </BotonChat>
      ) : null}
      {ganoYo ? null : p.estado === 'aceptado' ? (
        <p className="text-base font-semibold text-piedra">Este encargo ya lo tomó otro puesto.</p>
      ) : mia ? (
        <p className="text-base font-semibold text-olla">Ya respondiste: {dinero(mia.precioKg, p.ciudad)}/kg. Esperando que el comprador elija.</p>
      ) : !abierto ? (
        <Button className="w-full" onClick={() => setAbierto(true)}>Responder</Button>
      ) : (
        <div className="space-y-3 rounded-xl border border-borde bg-marfil p-3">
          <Button className="w-full" onClick={() => responderPedido(p.id, p.presupuestoKg, true)}>
            Acepto tu precio: {dinero(p.presupuestoKg, p.ciudad)}/kg
          </Button>
          <p className="text-center text-base text-piedra">o manda tu precio</p>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="numeric"
              min="1"
              value={precio || ''}
              onChange={(e) => setPrecio(Number(e.target.value))}
              aria-label="Tu precio por kilo"
              className="min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base"
            />
            <Button variante="contorno" disabled={!precio} onClick={() => responderPedido(p.id, precio, false)}>
              Enviar
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

// Vista del comprador: ve las respuestas y elige.
export function PedidoComprador({ p }) {
  const { elegirOferta, cerrarPedido, sinCelular, usuario } = useApp()
  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <Resumen p={p} />
        {p.estado === 'aceptado' && <Pill tono="olla" icono={CheckCircle2}>Aceptado</Pill>}
        {p.estado === 'cerrado' && <Pill>Cerrado</Pill>}
      </div>

      {p.estado === 'aceptado' && (
        <p className="rounded-xl border border-[#BCD8C5] bg-[#E7F1EA] p-3 text-base font-semibold text-olla">
          {p.ganador.puesto} te lo guarda a {dinero(p.ganador.precioKg, p.ciudad)}/kg. Pasa {p.dia === 'mañana' ? 'mañana' : 'hoy'} a las {p.hora}, revisas y pagas en efectivo.
        </p>
      )}
      {p.estado === 'aceptado' && (
        <BotonChat vendedorId={p.ganador.vendedorId} compradorId={usuario.id} contexto={`Pedido: ${p.kg} kg de ${p.producto}`} className="w-full">
          Escribir a {p.ganador.puesto}
        </BotonChat>
      )}

      {p.estado === 'abierto' && (
        <>
          {p.ofertas.length === 0 ? (
            <p className="text-base text-piedra">Todavía nadie responde. Los puestos ya ven tu encargo.</p>
          ) : (
            <div className="space-y-2">
              <p className="text-base font-bold">Respuestas de los puestos</p>
              {p.ofertas.map((o) => (
                <div key={o.id} className="space-y-2 rounded-xl border border-borde bg-marfil p-3">
                  <p className="text-base">
                    <b>{o.puesto}</b> te lo da a <b>{dinero(o.precioKg, p.ciudad)}/kg</b>
                  </p>
                  {sinCelular(o.vendedorId) && <SinCelularAviso />}
                  <Button className="w-full" onClick={() => elegirOferta(p.id, o.id)}>Elegir esta oferta</Button>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={() => cerrarPedido(p.id)} className="min-h-[48px] text-base font-semibold text-piedra underline">
            Ya no lo necesito (cerrar encargo)
          </button>
        </>
      )}
    </Card>
  )
}
