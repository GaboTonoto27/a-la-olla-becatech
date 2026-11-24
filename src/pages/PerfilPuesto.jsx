import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Banknote, Clock, Flag, Map, MapPin, Navigation, ShieldAlert, Star } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useAhora } from '../lib/useAhora.js'
import { loteActivo } from '../lib/acciones.js'
import { ESTANDARES } from '../data/estandares.js'
import { ubicacionExacta } from '../lib/ubicacion.js'
import { urlGoogleMaps, urlWaze } from '../lib/geo.js'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Toggle from '../components/ui/Toggle.jsx'
import Pill from '../components/ui/Pill.jsx'
import AvisoPlaza from '../components/layout/AvisoPlaza.jsx'
import LoteCard from '../components/lotes/LoteCard.jsx'
import ApartarModal from '../components/lotes/ApartarModal.jsx'
import FotoPuesto from '../components/puestos/FotoPuesto.jsx'
import BotonChat from '../components/chat/BotonChat.jsx'
import DenunciarModal from '../components/DenunciarModal.jsx'
import ListaResenas from '../components/resenas/ListaResenas.jsx'
import { promedioPuesto } from '../lib/social.js'
import Sellos from '../components/puestos/Sellos.jsx'
import ComoFuncionanEstandares from '../components/puestos/ComoFuncionanEstandares.jsx'

const ENLACE = 'inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-olla bg-white px-5 text-base font-bold text-olla hover:bg-marfil'

function hora(t) {
  return new Date(t).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })
}

// El vendedor prende o apaga sus estándares en 1 toque. Lo ven los compradores al instante.
function MiPuesto({ id }) {
  const { estandaresDe, cambiarEstandar } = useApp()
  const e = estandaresDe(id)
  return (
    <Card className="space-y-3">
      <div>
        <h2 className="text-2xl">Mis estándares</h2>
        <p className="text-base text-piedra">
          Cámbialos en 1 toque cuando algo cambie. {e.actualizado ? `Actualizado hoy ${hora(e.actualizado)}.` : 'Los compradores los ven al instante.'}
        </p>
      </div>
      <ul className="divide-y divide-borde">
        {ESTANDARES.map((s) => (
          <li key={s.id} className="flex min-h-[56px] items-center justify-between gap-3 py-2">
            <span className="text-base font-semibold">{s.etiqueta}</span>
            <Toggle activo={Boolean(e[s.id])} onChange={(v) => cambiarEstandar(id, s.id, v)} etiqueta={s.etiqueta} />
          </li>
        ))}
      </ul>
      <label className="block text-base font-bold" htmlFor="estandar-propio">Tu propio estándar (opcional)</label>
      <input
        id="estandar-propio"
        value={e.texto}
        maxLength={90}
        onChange={(ev) => cambiarEstandar(id, 'texto', ev.target.value)}
        placeholder="Ej.: Lavo las canastillas todos los días"
        className="min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base"
      />
    </Card>
  )
}

export default function PerfilPuesto() {
  const { id } = useParams()
  const { usuario, modo, lotes, apartados, pedidos, puestoPorId, resenas } = useApp()
  const ahora = useAhora(30000)
  const [elegido, setElegido] = useState(null)
  const [denunciando, setDenunciando] = useState(false)
  const puesto = puestoPorId(id)

  if (!puesto || puesto.tipo !== 'puesto') {
    return (
      <Card className="text-center">
        <p className="text-2xl font-bold">No encontramos ese puesto</p>
        <Button to="/puestos" className="mt-4">Ver todos los puestos</Button>
      </Card>
    )
  }

  const exacta = ubicacionExacta(puesto, usuario, apartados, pedidos)
  const suyos = lotes.filter((l) => l.vendedorId === puesto.id && loteActivo(l, ahora) && l.cantidad > 0)
  const esMio = usuario.id === puesto.id && modo === 'vendedor'
  const esDueno = usuario.id === puesto.id
  const delPuesto = resenas.filter((r) => r.puestoId === puesto.id)
  const nota = promedioPuesto(resenas, puesto.id)

  return (
    <div className="space-y-5">
      <Link to="/puestos" className="inline-flex min-h-[48px] items-center gap-2 text-base font-bold text-olla">
        <ArrowLeft size={20} aria-hidden="true" /> Todos los puestos
      </Link>
      <AvisoPlaza />
      {esDueno && (
        <Card className="space-y-2 border-[#BCD8C5] bg-[#E7F1EA]">
          <Pill tono="olla">Así ven tu puesto</Pill>
          <p className="text-base">Esto es lo que ve un comprador. No puedes apartar tus propios lotes.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {modo === 'vendedor' && <Button to="/ultima-hora">Gestionar en Pon pa' la olla</Button>}
            <Button to="/cuenta" variante="contorno">Gestionar en Mi cuenta</Button>
          </div>
        </Card>
      )}

      <div className="overflow-hidden rounded-2xl border border-borde bg-white">
        <div className={puesto.fotos.length > 1 ? 'grid grid-cols-2' : ''}>
          <FotoPuesto puesto={puesto} indice={0} className="h-48" />
          {puesto.fotos.length > 1 && <FotoPuesto puesto={puesto} indice={1} className="h-48" />}
        </div>
        <div className="space-y-3 p-5">
          <div>
            <h1 className="text-3xl">{puesto.nombre}</h1>
            <p className="text-base text-piedra">{puesto.barrio} · Puesto {puesto.formal ? 'formal' : 'informal'}</p>
          </div>
          <Sellos vendedorId={puesto.id} completo avisoSinCelular />
          <ul className="space-y-2 text-base">
            <li className="flex gap-2">
              <MapPin size={20} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
              {exacta ? puesto.direccion || 'Ubicación marcada en el mapa' : `Barrio ${puesto.barrio}. La dirección exacta se desbloquea al apartar.`}
            </li>
            <li className="flex gap-2">
              <Clock size={20} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" /> {puesto.horario}
            </li>
            {puesto.pagos.map((p) => (
              <li key={p} className="flex gap-2">
                <Banknote size={20} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" /> {p}
              </li>
            ))}
          </ul>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button to={`/mapa?puesto=${puesto.id}`} icono={Map}>Ver en el mapa</Button>
            <ComoFuncionanEstandares />
          </div>
          {exacta ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <a className={ENLACE} href={urlGoogleMaps(puesto.coord)} target="_blank" rel="noreferrer">
                <Navigation size={20} aria-hidden="true" /> Cómo llegar (Google Maps)
              </a>
              <a className={ENLACE} href={urlWaze(puesto.coord)} target="_blank" rel="noreferrer">Abrir en Waze</a>
            </div>
          ) : (
            <p className="flex items-start gap-2 rounded-xl border border-[#EBCFA6] bg-[#FBEFDD] p-3 text-base font-semibold">
              <ShieldAlert size={20} className="mt-0.5 shrink-0 text-ambar" aria-hidden="true" />
              Por seguridad, la ruta se activa cuando apartas un lote y tienes tu código OLLA.
            </p>
          )}
          {usuario.id !== puesto.id && modo === 'comprador' && (
            <div className="grid gap-2 sm:grid-cols-2">
              <BotonChat vendedorId={puesto.id} compradorId={usuario.id} contexto={`Puesto ${puesto.nombre}`}>Escribir al puesto</BotonChat>
              <Button variante="suave" icono={Flag} onClick={() => setDenunciando(true)}>Denunciar este sitio</Button>
            </div>
          )}
        </div>
      </div>

      {esMio && <MiPuesto id={puesto.id} />}

      <section className="space-y-3" aria-label="Lotes de hoy">
        <h2 className="flex flex-wrap items-center gap-2 text-2xl">
          Lotes de hoy {suyos.length > 0 && <Pill tono="tomate">{suyos.length}</Pill>}
        </h2>
        {suyos.length === 0 ? (
          <p className="text-base text-piedra">Este puesto no tiene lotes de última hora ahora.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {suyos.map((l) => (
              <LoteCard key={l.id} lote={l} ahora={ahora} onApartar={setElegido} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3" aria-label="Reseñas">
        <h2 className="flex flex-wrap items-center gap-2 text-2xl">
          Reseñas verificadas
          {nota && (
            <span className="flex items-center gap-1.5 text-base font-bold text-carbon">
              <Star size={18} className="fill-ambar text-ambar" aria-hidden="true" /> {String(nota.promedio).replace('.', ',')} ({nota.total})
            </span>
          )}
        </h2>
        <ListaResenas resenas={delPuesto} />
      </section>

      {denunciando && (
        <DenunciarModal titulo="Denunciar este sitio" tipo="sitio" objetivo={{ id: puesto.id, nombre: puesto.nombre }} onCerrar={() => setDenunciando(false)} />
      )}

      {elegido && <ApartarModal key={elegido.id} lote={elegido} onCerrar={() => setElegido(null)} />}
    </div>
  )
}
