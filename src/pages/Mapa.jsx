import { useCallback, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Crosshair, Info, Loader2, MapPin, Navigation, Store } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useAhora } from '../lib/useAhora.js'
import { loteActivo } from '../lib/acciones.js'
import { dinero } from '../lib/dinero.js'
import { cant } from '../lib/unidades.js'
import { distanciaM, textoDistancia, urlGoogleMaps, urlWaze } from '../lib/geo.js'
import { ubicacionExacta, AVISO_ZONA } from '../lib/ubicacion.js'
import { RADIO_ZONA, centroZona } from '../data/puestos.js'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Pill from '../components/ui/Pill.jsx'
import AvisoPlaza from '../components/layout/AvisoPlaza.jsx'
import { SelloFrio } from '../components/puestos/Sellos.jsx'
import { PedidoVendedor } from '../components/pedidos/PedidoCard.jsx'
import ComoFuncionanEstandares from '../components/puestos/ComoFuncionanEstandares.jsx'
import MapaLeaflet from '../components/mapa/MapaLeaflet.jsx'

const LIMITE_KM = 20
const ENLACE =
  'inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-olla bg-white px-4 text-base font-bold text-olla hover:bg-marfil'

function Leyenda({ vende }) {
  const punto = (color, forma = 'rounded-full') => <span className={`inline-block h-4 w-4 ${forma}`} style={{ background: color }} aria-hidden="true" />
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-piedra" aria-label="Qué significa cada pin">
      {vende ? (
        <>
          <li className="flex items-center gap-1.5">{punto('#1B5E3A')} Tu puesto</li>
          <li className="flex items-center gap-1.5">{punto('#D9532F', 'rounded-sm')} Pide pa' la olla</li>
        </>
      ) : (
        <>
          <li className="flex items-center gap-1.5">{punto('#0E7490')} Con nevera</li>
          <li className="flex items-center gap-1.5">{punto('#57534E')} Al ambiente</li>
        </>
      )}
      <li className="flex items-center gap-1.5">
        <span className="inline-block h-4 w-4 rounded-full border-2 border-dashed border-piedra" aria-hidden="true" /> Zona aproximada
      </li>
      <li className="flex items-center gap-1.5">{punto('#1D4ED8')} Tú</li>
    </ul>
  )
}

export default function Mapa() {
  const { usuario, modo, ciudad, lotes, apartados, pedidos, estandaresDe, ventaBloqueada, puestosDe, compradoresDe } = useApp()
  const ahora = useAhora(60000)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [pos, setPos] = useState(null)
  const [gps, setGps] = useState('idle')
  const [lejosOculto, setLejosOculto] = useState(false)
  const [enfoque, setEnfoque] = useState({ id: params.get('puesto'), n: 0 })
  const cajaMapa = useRef(null)
  const [abierto, setAbierto] = useState(null)
  const listaRef = useRef(null)
  const vende = modo === 'vendedor'

  const usarUbicacion = () => {
    if (!('geolocation' in navigator)) return setGps('error')
    setGps('cargando')
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos([p.coords.latitude, p.coords.longitude])
        setGps('ok')
        setLejosOculto(false)
      },
      (e) => setGps(e.code === 1 ? 'denegado' : 'error'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  const miPuesto = useMemo(() => puestosDe(ciudad.id).find((p) => p.id === usuario.id) ?? null, [ciudad.id, usuario.id, puestosDe])

  // Filas de la lista y pines del mapa, según Compro o Vendo.
  const filas = useMemo(() => {
    if (!vende) {
      const vivos = lotes.filter((l) => l.ciudad === ciudad.id && loteActivo(l, ahora) && l.cantidad > 0)
      return puestosDe(ciudad.id).map((p) => {
        const suyos = vivos.filter((l) => l.vendedorId === p.id)
        const exacta = ubicacionExacta(p, usuario, apartados, pedidos)
        return { ent: p, exacta, frio: Boolean(estandaresDe(p.id).frio), nLotes: suyos.length, pedidos: [] }
      })
    }
    return compradoresDe(ciudad.id)
      .map((c) => {
        const suyos = pedidos.filter((p) => p.ciudad === ciudad.id && p.estado === 'abierto' && (p.compradorId === c.id || p.comprador === c.pedidoComo))
        return { ent: c, exacta: ubicacionExacta(c, usuario, apartados, pedidos), pedidos: suyos }
      })
      .filter((f) => f.pedidos.length > 0)
  }, [vende, lotes, pedidos, apartados, ciudad.id, ahora, usuario, estandaresDe, puestosDe, compradoresDe])

  const origen = vende ? (miPuesto?.coord ?? pos) : pos
  const filasConDistancia = useMemo(() => {
    return filas
      .map((f) => {
        const punto = f.exacta || f.ent.privacidad === 'exacto' ? f.ent.coord : centroZona(f.ent.coord, f.ent.id)
        const aprox = !(f.exacta || f.ent.privacidad === 'exacto')
        return { ...f, punto, aprox, dist: origen ? distanciaM(origen, punto) : null }
      })
      .sort((a, b) => (a.dist ?? 0) - (b.dist ?? 0))
  }, [filas, origen])

  const construir = () => {
    const lista = filasConDistancia.map((f) => {
      const { ent } = f
      const dist = f.dist != null ? `${f.aprox ? '~' : ''}${textoDistancia(f.dist)} ${vende ? 'de tu puesto' : 'de ti'}` : null
      if (vende) {
        const p = f.pedidos[0]
        return {
          id: ent.id, lat: f.punto[0], lng: f.punto[1], aprox: f.aprox, tipo: 'comprador', titulo: ent.nombre,
          lineas: [`${p.kg} kg ${p.producto} · hasta ${dinero(p.presupuestoKg, p.ciudad)}/kg`, dist].filter(Boolean),
          aviso: f.aprox ? AVISO_ZONA : null,
          accion: { etiqueta: 'Responder pedido', valor: `responder:${p.id}` },
        }
      }
      return {
        id: ent.id, lat: f.punto[0], lng: f.punto[1], aprox: f.aprox, tipo: f.frio ? 'frio' : 'ambiente', titulo: ent.nombre,
        lineas: [f.frio ? 'Con nevera / cuarto frío' : 'Sin nevera · Al ambiente (consumo hoy)', f.nLotes ? `${cant(f.nLotes, 'lote')} hoy` : 'Sin lotes hoy', dist].filter(Boolean),
        aviso: f.aprox ? AVISO_ZONA : null,
        accion: { etiqueta: f.nLotes ? 'Ver y apartar gratis' : 'Ver puesto', valor: `puesto:${ent.id}` },
      }
    })
    if (vende && miPuesto) {
      lista.unshift({
        id: miPuesto.id, lat: miPuesto.coord[0], lng: miPuesto.coord[1], aprox: false, tipo: 'tuPuesto', titulo: 'Tu puesto',
        lineas: [miPuesto.nombre, miPuesto.direccion], aviso: null, accion: null,
      })
    }
    return lista
  }
  // El mapa solo se vuelve a dibujar cuando cambia algo visible (así no se cierra el globo cada minuto).
  const crudo = construir()
  const clave = JSON.stringify(crudo)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const marcadores = useMemo(() => crudo, [clave])

  const alAccion = useCallback(
    (valor) => {
      const [tipo, id] = valor.split(':')
      if (tipo === 'puesto') navigate(`/puesto/${id}`)
      else {
        setAbierto(id)
        setTimeout(() => document.getElementById(`pedido-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
      }
    },
    [navigate],
  )

  // Aviso útil si abres la app lejos de la zona (ej. un jurado desde otra ciudad).
  const aviso = useMemo(() => {
    if (!pos) return null
    const aqui = distanciaM(pos, ciudad.centro)
    return aqui <= LIMITE_KM * 1000 ? null : { km: Math.round(aqui / 1000) }
  }, [pos, ciudad])
  const cerca = pos && !aviso

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl sm:text-4xl">{vende ? "Pedidos cerca de tu puesto" : 'Puestos cerca de ti'}</h1>
        <p className="mt-1 text-lg text-piedra">
          {vende
            ? "Restaurantes, juguerías y hogares que piden pa' la olla en " + ciudad.plaza + '.'
            : `Puestos de ${ciudad.plaza}: con nevera, al ambiente y con lotes hoy.`}
        </p>
      </div>
      <AvisoPlaza />

      <div className="space-y-2">
        <Button icono={gps === 'cargando' ? Loader2 : Crosshair} className="w-full sm:w-auto" onClick={usarUbicacion} disabled={gps === 'cargando'}>
          {gps === 'cargando' ? 'Buscando tu ubicación…' : pos ? 'Actualizar mi ubicación' : 'Usar mi ubicación'}
        </Button>
        {gps === 'ok' && cerca && <p className="text-base font-semibold text-olla">Listo, ya te ubicamos. Las distancias son reales.</p>}
        {gps === 'denegado' && (
          <p className="text-base font-semibold text-ambar" role="status">
            No pudimos usar tu ubicación porque no diste permiso. No pasa nada: sigue explorando el mapa y la lista.
          </p>
        )}
        {gps === 'error' && (
          <p className="text-base font-semibold text-ambar" role="status">
            Ahora mismo no logramos ubicarte. Puedes seguir explorando el mapa sin problema.
          </p>
        )}
      </div>

      {aviso && !lejosOculto && (
        <Card className="space-y-3 border-[#B5D9E3] bg-[#E2F1F5]">
          <p className="flex items-start gap-2 text-base">
            <Info size={22} className="mt-0.5 shrink-0 text-frio" aria-hidden="true" />
            <span>
              <b>Estás a {aviso.km} km de {ciudad.plaza}.</b> A la Olla trabaja en {ciudad.nombre}: puedes seguir explorando los puestos de la zona.
            </span>
          </p>
          <Button variante="suave" onClick={() => setLejosOculto(true)}>Seguir explorando</Button>
        </Card>
      )}

      <div ref={cajaMapa} className="isolate h-[60vh] min-h-[340px] overflow-hidden rounded-2xl border border-borde sm:h-[480px]">
        <MapaLeaflet
          centro={ciudad.centro}
          zoom={ciudad.zoom}
          marcadores={marcadores}
          usuario={pos}
          centrarEnUsuario={Boolean(cerca)}
          enfocar={enfoque}
          radioZona={RADIO_ZONA}
          alAccion={alAccion}
        />
      </div>
      <Leyenda vende={vende} />
      {!vende && <ComoFuncionanEstandares className="w-full sm:w-auto" />}

      <section ref={listaRef} className="space-y-3" aria-label={vende ? 'Pedidos cercanos' : 'Puestos cercanos'}>
        <h2 className="text-2xl">{vende ? "Pedidos pa' la olla" : 'Puestos de la plaza'}</h2>
        {ventaBloqueada && vende && <p className="text-base font-semibold text-ambar">Aquí puedes mirar, pero no responder: tu puesto opera en Barranquilla.</p>}
        {filasConDistancia.length === 0 && <p className="text-base text-piedra">{vende ? 'Por ahora no hay pedidos abiertos.' : 'No hay puestos registrados en esta plaza.'}</p>}
        <ul className="space-y-3">
          {filasConDistancia.map((f) => {
            const { ent } = f
            const dist = f.dist != null ? `${f.aprox ? '~' : ''}${textoDistancia(f.dist)}` : null
            return (
              <li key={ent.id}>
                <Card className="space-y-3 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl">{ent.nombre}</h3>
                      <p className="text-base text-piedra">
                        {ent.barrio}
                        {dist && ` · a ${dist}${vende ? (miPuesto ? ' de tu puesto' : '') : ''}`}
                      </p>
                    </div>
                    {!vende && (f.nLotes > 0 ? <Pill tono="tomate">{cant(f.nLotes, 'lote')} hoy</Pill> : <Pill>Sin lotes hoy</Pill>)}
                  </div>

                  {!vende && <SelloFrio frio={f.frio} />}

                  {f.aprox ? (
                    <p className="flex items-start gap-2 text-sm font-semibold text-ambar">
                      <MapPin size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> {AVISO_ZONA}
                    </p>
                  ) : (
                    <>
                      <p className="flex items-start gap-2 text-base">
                        <MapPin size={18} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" /> {ent.direccion}
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <a className={ENLACE} href={urlGoogleMaps(ent.coord)} target="_blank" rel="noreferrer">
                          <Navigation size={20} aria-hidden="true" /> Cómo llegar (Google Maps)
                        </a>
                        <a className={ENLACE} href={urlWaze(ent.coord)} target="_blank" rel="noreferrer">Abrir en Waze</a>
                      </div>
                    </>
                  )}

                  {vende ? (
                    f.pedidos.map((p) => (
                      <div key={p.id} id={`pedido-${p.id}`} className="space-y-2">
                        <p className="text-base font-bold">{p.kg} kg {p.producto} · hasta {dinero(p.presupuestoKg, p.ciudad)}/kg</p>
                        {abierto === p.id ? (
                          <PedidoVendedor p={p} />
                        ) : (
                          <Button className="w-full" disabled={ventaBloqueada} onClick={() => setAbierto(p.id)}>
                            Responder pedido
                          </Button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Button to={`/puesto/${ent.id}`} icono={f.nLotes ? undefined : Store} variante={f.nLotes ? 'primario' : 'contorno'} className="col-span-2 sm:col-span-1">
                        {f.nLotes ? 'Ver y apartar gratis' : 'Ver puesto'}
                      </Button>
                      <Button variante="suave" className="col-span-2 sm:col-span-1" onClick={() => { setEnfoque((e) => ({ id: ent.id, n: e.n + 1 })); cajaMapa.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}>Ver en el mapa</Button>
                    </div>
                  )}
                </Card>
              </li>
            )
          })}
        </ul>
        <p className="text-sm text-piedra">
          Mapa de <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>. Las distancias son en línea recta.{' '}
          <Link className="underline" to="/puestos">Ver directorio de puestos</Link>
        </p>
      </section>
    </div>
  )
}
