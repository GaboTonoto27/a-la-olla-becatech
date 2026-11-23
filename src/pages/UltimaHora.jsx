import { useMemo, useState } from 'react'
import { CalendarClock, Map, PackageOpen, SlidersHorizontal, Store, Trash2, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useAhora } from '../lib/useAhora.js'
import { loteActivo } from '../lib/acciones.js'
import { dinero } from '../lib/dinero.js'
import { esSabado, textoRestante } from '../lib/tiempo.js'
import { CATEGORIAS } from '../data/semilla.js'
import Card from '../components/ui/Card.jsx'
import Chip from '../components/ui/Chip.jsx'
import Button from '../components/ui/Button.jsx'
import LoteCard from '../components/lotes/LoteCard.jsx'
import ApartarModal from '../components/lotes/ApartarModal.jsx'
import ApartadoComprador from '../components/lotes/ApartadoComprador.jsx'
import ApartadoVendedor from '../components/lotes/ApartadoVendedor.jsx'
import PublicarLote from '../components/lotes/PublicarLote.jsx'
import SinCelularCard from '../components/SinCelularCard.jsx'
import AvisoPlaza from '../components/layout/AvisoPlaza.jsx'
import AjustarPrecioModal from '../components/lotes/AjustarPrecioModal.jsx'
import ComoFuncionanEstandares from '../components/puestos/ComoFuncionanEstandares.jsx'
import { cant } from '../lib/unidades.js'

function Accesos() {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <Button to="/puestos" variante="contorno" icono={Store}>Ver puestos</Button>
      <Button to="/mapa" variante="contorno" icono={Map}>Ver mapa</Button>
      <ComoFuncionanEstandares />
    </div>
  )
}

function AvisoCierre({ ahora }) {
  const sabado = esSabado(ahora)
  return (
    <Card className={`flex items-start gap-3 ${sabado ? 'border-[#F0C4B6] bg-[#FBE9E3]' : ''}`}>
      <CalendarClock size={24} className={`mt-0.5 shrink-0 ${sabado ? 'text-tomate' : 'text-olla'}`} aria-hidden="true" />
      <p className="text-base">
        {sabado ? (
          <>
            <b>Hoy es sábado.</b> La plaza cierra mañana: lo que no se vende hoy se bota. Aparta ya.
          </>
        ) : (
          <>
            <b>La plaza cierra a las 4:00 p. m.</b> Cada lote tiene su reloj y se retira solo cuando se acaba el tiempo.
          </>
        )}
      </p>
    </Card>
  )
}

function Comprador({ ahora }) {
  const { lotes, apartados, usuario, ciudad } = useApp()
  const [cat, setCat] = useState('todo')
  const [nivel, setNivel] = useState('todo')
  const [elegido, setElegido] = useState(null)

  const delDia = useMemo(
    () => lotes.filter((l) => l.ciudad === ciudad.id && loteActivo(l, ahora) && l.cantidad > 0),
    [lotes, ciudad.id, ahora],
  )
  const visibles = delDia
    .filter((l) => (cat === 'todo' || l.cat === cat) && (nivel === 'todo' || l.nivel === nivel))
    .sort((a, b) => a.vence - b.vence)
  const mios = apartados.filter((a) => a.comprador.id === usuario.id && a.ciudad === ciudad.id)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl sm:text-4xl">Última hora</h1>
        <p className="mt-1 text-lg text-piedra">Comida buena de {ciudad.plaza}, a menor precio antes del cierre.</p>
      </div>
      <AvisoPlaza />
      <AvisoCierre ahora={ahora} />
      <Accesos />

      {mios.length > 0 && (
        <section className="space-y-3" aria-label="Mis apartados">
          <h2 className="text-2xl">Lo que apartaste</h2>
          {mios.map((a) => <ApartadoComprador key={a.id} a={a} />)}
        </section>
      )}

      <section className="space-y-3" aria-label="Lotes disponibles">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <Chip activo={cat === 'todo'} onClick={() => setCat('todo')}>Todo</Chip>
          {CATEGORIAS.map((c) => (
            <Chip key={c.id} activo={cat === c.id} onClick={() => setCat(c.id)}>{c.etiqueta}</Chip>
          ))}
          <span className="mx-1 w-px shrink-0 self-stretch bg-borde" aria-hidden="true" />
          <Chip activo={nivel === 'cocina'} onClick={() => setNivel(nivel === 'cocina' ? 'todo' : 'cocina')}>
            Pa' Cocina / Pulpa (100% sano)
          </Chip>
          <Chip activo={nivel === 'cria'} onClick={() => setNivel(nivel === 'cria' ? 'todo' : 'cria')}>
            Pa' Cría / Abono
          </Chip>
        </div>

        {visibles.length === 0 ? (
          <Card className="text-center">
            <PackageOpen size={40} className="mx-auto text-piedra" aria-hidden="true" />
            <p className="mt-2 text-xl font-bold">No hay lotes con ese filtro</p>
            <p className="mb-4 text-base text-piedra">Prueba con otro, o pide lo que necesitas y los puestos te responden.</p>
            <Button to="/pedidos">Pide pa' tu olla</Button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibles.map((l) => (
              <LoteCard key={l.id} lote={l} ahora={ahora} onApartar={setElegido} />
            ))}
          </div>
        )}
      </section>

      {elegido && <ApartarModal key={elegido.id} lote={elegido} onCerrar={() => setElegido(null)} />}
    </div>
  )
}

function Vendedor({ ahora }) {
  const { lotes, apartados, usuario, ciudad, retirarLote } = useApp()
  const [ajustando, setAjustando] = useState(null)
  const mios = lotes.filter((l) => l.vendedorId === usuario.id && l.ciudad === ciudad.id && loteActivo(l, ahora))
  const porAtender = apartados.filter(
    (a) => a.vendedorId === usuario.id && a.ciudad === ciudad.id && (a.estado === 'apartado' || a.estado === 'confirmado'),
  )

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl sm:text-4xl">Última hora</h1>
        <p className="mt-1 text-lg text-piedra">Publica lo que te sobra antes del cierre. Sin fotos de fruta fea.</p>
      </div>
      <AvisoPlaza />
      <AvisoCierre ahora={ahora} />
      <Accesos />
      <SinCelularCard />

      <section className="space-y-3" aria-label="Apartados">
        <h2 className="text-2xl">Apartados por atender</h2>
        {porAtender.length === 0 ? (
          <p className="text-base text-piedra">Todavía nadie ha apartado. Apenas pase, te sale aquí.</p>
        ) : (
          porAtender.map((a) => <ApartadoVendedor key={a.id} a={a} />)
        )}
      </section>

      <section className="space-y-3" aria-label="Publicar lote">
        <h2 className="flex items-center gap-2 text-2xl">
          <Zap size={24} className="text-tomate" aria-hidden="true" /> Publicar un lote
        </h2>
        <PublicarLote />
      </section>

      <section className="space-y-3" aria-label="Tus lotes">
        <h2 className="text-2xl">Tus lotes en vitrina</h2>
        {mios.length === 0 ? (
          <Card className="space-y-1 border-[#BCD8C5] bg-[#F4F9F5]">
            <p className="text-xl font-bold">Publica tu primer lote</p>
            <p className="text-base text-piedra">Tu vitrina está en cero. Arriba, en "Publicar un lote", toca lo que te sobró y listo en 3 pasos.</p>
          </Card>
        ) : (
          mios.map((l) => (
            <Card key={l.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-lg font-bold">{l.producto}</p>
                <p className="text-base text-piedra">
                  {l.cantidad > 0 ? `Quedan ${cant(l.cantidad, l.unidad)}` : 'Agotado'} · {dinero(l.rescate, l.ciudad)}/{l.unidad} · {textoRestante(l.vence, ahora)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variante="suave" icono={SlidersHorizontal} onClick={() => setAjustando(l)}>Ajustar precio</Button>
                <Button variante="suave" icono={Trash2} onClick={() => retirarLote(l.id)}>Retirar</Button>
              </div>
            </Card>
          ))
        )}
      </section>
      {ajustando && <AjustarPrecioModal key={ajustando.id} lote={ajustando} onCerrar={() => setAjustando(null)} />}
    </div>
  )
}

export default function UltimaHora() {
  const { modo } = useApp()
  const ahora = useAhora()
  return modo === 'vendedor' ? <Vendedor ahora={ahora} /> : <Comprador ahora={ahora} />
}
