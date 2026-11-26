import { Link } from 'react-router-dom'
import { ChefHat, ShoppingBasket, TrendingUp, Zap, MapPin, Store } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useAhora } from '../lib/useAhora.js'
import { loteActivo } from '../lib/acciones.js'
import { dinero } from '../lib/dinero.js'
import { resumenSemana, textoRescate } from '../lib/economia.js'
import { textoRestanteLote } from '../lib/horario.js'
import AvisoHorario from '../components/layout/AvisoHorario.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Pill from '../components/ui/Pill.jsx'
import SinCelularCard from '../components/SinCelularCard.jsx'
import AvisoPlaza from '../components/layout/AvisoPlaza.jsx'
import { cant } from '../lib/unidades.js'

function Cifra({ valor, etiqueta, to }) {
  return (
    <Card as={to ? Link : 'div'} to={to} className="flex flex-col justify-between p-3 sm:p-4">
      <p className="font-titulo text-3xl font-extrabold leading-none text-olla sm:text-4xl">{valor}</p>
      <p className="mt-2 text-sm font-semibold leading-tight text-piedra sm:text-base">{etiqueta}</p>
    </Card>
  )
}

export default function Inicio() {
  const { usuario, modo, ciudad, lotes, apartados, pedidos, miPuesto, devoluciones, estandaresDe } = useApp()
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
  const misEncargos = pedidos.filter((p) => p.compradorId === usuario.id && p.estado !== 'cerrado').length
  const kilosSalvables = delaPlaza.reduce((s, l) => s + (l.unidad === 'kg' ? l.cantidad : 0), 0)
  const semana = resumenSemana(apartados, usuario.id, true, miPuesto?.plan ?? 'popular', ahora, devoluciones, miPuesto?.tarifa)
  const pronto = [...delaPlaza].sort((a, b) => a.vence - b.vence).slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-carbon sm:text-4xl">Buenas, {usuario.nombre}</h1>
        <p className="mt-1 text-lg text-piedra">
          {vende ? `Tu puesto: ${miPuesto?.nombre ?? usuario.negocio}` : '¿Qué vas a cocinar hoy?'} · {ciudad.plaza}
        </p>
      </div>

      <AvisoPlaza />
      <AvisoHorario ahora={ahora} />

      <section className="grid grid-cols-3 gap-2 sm:gap-3" aria-label="Resumen de hoy">
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

      {!vende && misApartados.length === 0 && misEncargos === 0 && (
        <Card className="space-y-3 border-[#BCD8C5] bg-[#F4F9F5]">
          <h2 className="text-2xl">Tu primera olla, paso a paso</h2>
          <p className="text-base text-piedra">
            Aún no tienes apartados ni encargos. Mira lo que hay hoy en {ciudad.plaza} y aparta un lote sin pago adelantado, o cuéntanos qué vas a cocinar y los puestos te responden con su precio.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button to="/ultima-hora" variante="acento" icono={Zap}>Ver lo que hay hoy</Button>
            <Button to="/pedidos" variante="contorno" icono={ShoppingBasket}>Pedir pa' mi olla</Button>
          </div>
        </Card>
      )}

      {vende ? (
        <div className="space-y-4">
          <Card className="space-y-2 border-[#F0C4B6] bg-[#FBE9E3]">
            <Pill tono="tomate" icono={ChefHat}>Tu vitrina</Pill>
            <h2 className="text-2xl">{misLotes.length === 0 ? "Pon pa' la olla tu primer lote" : "Pon pa' la olla lo que te sobra"}</h2>
            <p className="text-base text-piedra">En 3 pasos: qué es, cuántos kilos y el precio. Sin fotos de fruta fea.</p>
            <Button to="/ultima-hora" icono={ChefHat} variante="acento" className="w-full">Pon pa' la olla</Button>
          </Card>
          <Card className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tono={miPuesto?.plan === 'formal' ? 'frio' : 'ambar'}>{miPuesto?.plan === 'formal' ? 'Plan Formal' : 'Plan Popular'}</Pill>
              {estandaresDe(usuario.id).frio && <Pill tono="frio">Con nevera</Pill>}
            </div>
            <p className="text-lg font-bold">Esta semana: {textoRescate(semana.kilos, semana.bolsas)} rescatados · {dinero(semana.ingresos)} recuperados</p>
            <Button to="/ganancias" variante="contorno" icono={TrendingUp} className="w-full sm:w-auto">Ver ganancias y consejos</Button>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <Pill tono="olla" icono={ShoppingBasket}>Encargos</Pill>
              <h2 className="mt-3 text-2xl">Lo que están pidiendo</h2>
              <p className="mb-4 mt-1 text-base text-piedra">{encargos.length} encargos esperan tu precio. Respondes en 2 toques.</p>
              <Button to="/pedidos" variante="contorno" className="w-full">Ver encargos</Button>
            </Card>
            <Card>
              <Pill tono="frio" icono={MapPin}>Cerca de ti</Pill>
              <h2 className="mt-3 text-2xl">Mira quién pide cerca</h2>
              <p className="mb-4 mt-1 text-base text-piedra">Restaurantes, juguerías y hogares con encargos, en el mapa.</p>
              <Button to="/mapa" variante="contorno" icono={MapPin} className="w-full">Ver mapa</Button>
            </Card>
          </div>
        </div>
      ) : (
        <>
          <Card className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Pill tono="tomate" icono={Zap}>Última hora</Pill>
              <span className="text-sm font-semibold text-piedra">{cant(kilosSalvables, 'kg')} por rescatar hoy</span>
            </div>
            <h2 className="text-2xl">Se acaba pronto</h2>
            <ul className="divide-y divide-borde">
              {pronto.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-3 py-2">
                  <div>
                    <p className="flex flex-wrap items-center gap-2 text-lg font-bold">{l.producto} {l.vendedorId === usuario.id && <Pill tono="olla">Tu lote publicado</Pill>}</p>
                    <p className="text-sm font-semibold text-ambar">{textoRestanteLote(l.vence, ahora)}</p>
                  </div>
                  <p className="font-titulo text-2xl font-extrabold text-olla">
                    {dinero(l.rescate, l.ciudad)}<span className="text-sm">/{l.unidad}</span>
                  </p>
                </li>
              ))}
            </ul>
            <Button to="/ultima-hora" variante="acento" icono={Zap} className="w-full">Ver todos los lotes</Button>
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
              <p className="mb-4 mt-1 text-base text-piedra">Los puestos de la plaza, con y sin nevera.</p>
              <div className="grid grid-cols-2 gap-2">
                <Button to="/puestos" variante="contorno" icono={Store}>Puestos</Button>
                <Button to="/mapa" variante="contorno" icono={MapPin}>Mapa</Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
