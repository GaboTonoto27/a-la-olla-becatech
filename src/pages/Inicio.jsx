import { Link } from 'react-router-dom'
import { ShoppingBasket, Zap, MapPin, Info } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useAhora } from '../lib/useAhora.js'
import { loteActivo } from '../lib/acciones.js'
import { dinero } from '../lib/dinero.js'
import { textoRestante } from '../lib/tiempo.js'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Pill from '../components/ui/Pill.jsx'
import SinCelularCard from '../components/SinCelularCard.jsx'

function Cifra({ valor, etiqueta, to }) {
  return (
    <Card as={to ? Link : 'div'} to={to} className="block p-4">
      <p className="font-titulo text-4xl font-extrabold text-olla">{valor}</p>
      <p className="text-base font-semibold text-piedra">{etiqueta}</p>
    </Card>
  )
}

export default function Inicio() {
  const { usuario, modo, ciudad, lotes, apartados, pedidos } = useApp()
  const ahora = useAhora(30000)
  const vende = modo === 'vendedor'

  const delaPlaza = lotes.filter((l) => l.ciudad === ciudad.id && loteActivo(l, ahora) && l.cantidad > 0)
  const encargos = pedidos.filter((p) => p.ciudad === ciudad.id && p.estado === 'abierto')
  const misLotes = delaPlaza.filter((l) => l.vendedorId === usuario.id)
  const porAtender = apartados.filter(
    (a) => a.ciudad === ciudad.id && a.vendedorId === usuario.id && (a.estado === 'apartado' || a.estado === 'confirmado'),
  )
  const misApartados = apartados.filter(
    (a) => a.ciudad === ciudad.id && a.comprador.id === usuario.id && (a.estado === 'apartado' || a.estado === 'confirmado'),
  )
  const kilosSalvables = delaPlaza.reduce((s, l) => s + (l.unidad === 'kg' ? l.cantidad : 0), 0)
  const pronto = [...delaPlaza].sort((a, b) => a.vence - b.vence).slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-carbon sm:text-4xl">Buenas, {usuario.nombre}</h1>
        <p className="mt-1 text-lg text-piedra">
          {vende ? `Tu puesto: ${usuario.negocio}` : '¿Qué vas a cocinar hoy?'} · {ciudad.plaza}
        </p>
      </div>

      {!ciudad.piloto && (
        <Card className="flex items-start gap-3 border-[#B5D9E3] bg-[#E2F1F5]">
          <Info size={22} className="mt-0.5 shrink-0 text-frio" aria-hidden="true" />
          <p className="text-base">
            <b>Así se vería en {ciudad.nombre}.</b> Lotes de muestra en {ciudad.moneda}, atendidos por la {ciudad.coordinador}. Los datos reales del piloto están en Barranquilla.
          </p>
        </Card>
      )}

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3" aria-label="Resumen de hoy">
        {vende ? (
          <>
            <Cifra valor={misLotes.length} etiqueta="Tus lotes en vitrina" to="/ultima-hora" />
            <Cifra valor={porAtender.length} etiqueta="Apartados por atender" to="/ultima-hora" />
            <Cifra valor={encargos.length} etiqueta="Encargos esperando precio" to="/pedidos" />
          </>
        ) : (
          <>
            <Cifra valor={delaPlaza.length} etiqueta="Lotes de última hora" to="/ultima-hora" />
            <Cifra valor={encargos.length} etiqueta="Encargos del día en la plaza" to="/pedidos" />
            <Cifra valor={misApartados.length} etiqueta="Tus apartados activos" to="/ultima-hora" />
          </>
        )}
      </section>

      {vende && <SinCelularCard />}

      {vende ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <Pill tono="tomate" icono={Zap}>Última hora</Pill>
            <h2 className="mt-3 text-2xl">Publica lo que te sobra</h2>
            <p className="mb-4 mt-1 text-base text-piedra">En 3 pasos: qué es, cuántos kilos y el precio.</p>
            <Button to="/ultima-hora" icono={Zap} variante="acento" className="w-full">Publicar sobrantes</Button>
          </Card>
          <Card>
            <Pill tono="olla" icono={ShoppingBasket}>Pedidos</Pill>
            <h2 className="mt-3 text-2xl">Lo que están pidiendo</h2>
            <p className="mb-4 mt-1 text-base text-piedra">{encargos.length} encargos esperan tu precio. Respondes en 2 toques.</p>
            <Button to="/pedidos" variante="contorno" className="w-full">Ver pedidos</Button>
          </Card>
        </div>
      ) : (
        <>
          <Card className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Pill tono="tomate" icono={Zap}>Última hora</Pill>
              <span className="text-sm font-semibold text-piedra">{kilosSalvables} kg por rescatar hoy</span>
            </div>
            <h2 className="text-2xl">Se acaba pronto</h2>
            <ul className="divide-y divide-borde">
              {pronto.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 py-2">
                  <div>
                    <p className="text-lg font-bold">{l.producto}</p>
                    <p className="text-sm font-semibold text-ambar">{textoRestante(l.vence, ahora)}</p>
                  </div>
                  <p className="font-titulo text-2xl font-extrabold text-olla">
                    {dinero(l.rescate, l.ciudad)}<span className="text-sm">/{l.unidad}</span>
                  </p>
                </li>
              ))}
            </ul>
            <Button to="/ultima-hora" variante="acento" icono={Zap} className="w-full">Ver todo y apartar gratis</Button>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <Pill tono="olla" icono={ShoppingBasket}>Pide pa' tu olla</Pill>
              <h2 className="mt-3 text-2xl">Cuéntanos qué vas a cocinar</h2>
              <p className="mb-4 mt-1 text-base text-piedra">Pide temprano y recoge a tu hora.</p>
              <Button to="/pedidos" className="w-full">Hacer un pedido</Button>
            </Card>
            <Card>
              <Pill tono="frio" icono={MapPin}>Puestos</Pill>
              <h2 className="mt-3 text-2xl">Mira dónde están</h2>
              <p className="mb-4 mt-1 text-base text-piedra">Los puestos de la plaza en el mapa.</p>
              <Button to="/mapa" variante="contorno" className="w-full">Ver mapa</Button>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
