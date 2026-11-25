import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Check, Crosshair, Loader2 } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { RADIO_ZONA, centroZona } from '../../data/puestos.js'

const CENTRO = [10.929, -74.8045]
const PIN = L.divIcon({
  className: 'pin-olla',
  html: '<svg width="36" height="44" viewBox="0 0 36 44" aria-hidden="true"><path d="M18 43C18 43 33 28 33 16A15 15 0 0 0 3 16c0 12 15 27 15 27z" fill="#1B5E3A" stroke="#fff" stroke-width="2"/><circle cx="18" cy="16" r="6" fill="#fff"/></svg>',
  iconSize: [36, 44],
  iconAnchor: [18, 43],
})
const YO = L.divIcon({
  className: 'pin-olla',
  html: '<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#1D4ED8;border:4px solid #fff;box-shadow:0 0 0 3px rgba(29,78,216,.35)"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

// Mini-mapa pa' marcar un punto: toca, arrastra el pin o usa el GPS. Cuesta $0 (OpenStreetMap).
// puesto=true: modo "¿Es aquí tu puesto?" con tu ubicación actual, botón Confirmar y radio aproximado si es informal.
// ubicacionActual: punto ya guardado de la persona (se dibuja aunque no pida el GPS otra vez).
export default function SelectorUbicacion({ valor, onChange, puesto = false, zona = false, id = 'x', onConfirmar, etiqueta = 'Tu puesto', onUbicacion, ubicacionActual = null, pregunta = '¿Es aquí tu puesto?' }) {
  const caja = useRef(null)
  const mapa = useRef(null)
  const marcador = useRef(null)
  const yo = useRef(null)
  const circulo = useRef(null)
  const alCambiar = useRef(onChange)
  alCambiar.current = onChange
  const alUbicar = useRef(onUbicacion)
  alUbicar.current = onUbicacion
  const [gps, setGps] = useState('idle')
  const [mia, setMia] = useState(ubicacionActual)
  const [confirmado, setConfirmado] = useState(false)

  useEffect(() => {
    const m = L.map(caja.current, { scrollWheelZoom: false }).setView(valor ?? CENTRO, 16)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m)
    m.on('click', (ev) => {
      setConfirmado(false)
      alCambiar.current([ev.latlng.lat, ev.latlng.lng])
    })
    mapa.current = m
    return () => {
      m.remove()
      mapa.current = marcador.current = yo.current = circulo.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const m = mapa.current
    if (!m || !valor) return
    if (marcador.current) marcador.current.setLatLng(valor)
    else {
      marcador.current = L.marker(valor, { icon: PIN, title: etiqueta, alt: etiqueta, draggable: true }).addTo(m)
      marcador.current.on('dragend', () => {
        const p = marcador.current.getLatLng()
        setConfirmado(false)
        alCambiar.current([p.lat, p.lng])
      })
    }
    if (puesto && zona) {
      const c = centroZona(valor, id)
      if (circulo.current) circulo.current.setLatLng(c)
      else circulo.current = L.circle(c, { radius: RADIO_ZONA, color: '#D9532F', weight: 2, fillColor: '#D9532F', fillOpacity: 0.12 }).addTo(m)
    } else if (circulo.current) {
      circulo.current.remove()
      circulo.current = null
    }
  }, [valor, puesto, zona, id, etiqueta])

  useEffect(() => {
    const m = mapa.current
    if (!m || !mia) return
    if (yo.current) yo.current.setLatLng(mia)
    else yo.current = L.marker(mia, { icon: YO, title: 'Tú estás aquí', alt: 'Tu ubicación actual', interactive: false }).addTo(m)
  }, [mia])

  const usarGps = () => {
    if (!('geolocation' in navigator)) return setGps('error')
    setGps('cargando')
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const punto = [p.coords.latitude, p.coords.longitude]
        setMia(punto)
        alUbicar.current?.(punto)
        if (!puesto) alCambiar.current(punto)
        mapa.current?.setView(punto, 17)
        setGps('ok')
      },
      (e) => setGps(e.code === 1 ? 'denegado' : 'error'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  const confirmar = () => {
    setConfirmado(true)
    onConfirmar?.(valor)
  }

  return (
    <div className="space-y-2">
      {puesto && (
        <p className="text-base font-bold">
          {pregunta} <span className="font-medium text-piedra">{pregunta.includes('puesto') ? 'Puedes mover el punto exacto tú mismo' : ''}</span>
        </p>
      )}
      <div className="isolate h-56 overflow-hidden rounded-2xl border border-borde">
        <div ref={caja} className="h-full w-full" role="region" aria-label={`Mapa pa' marcar ${etiqueta.toLowerCase()}`} />
      </div>
      {puesto && (
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-piedra">
          <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full border-2 border-white bg-[#1D4ED8] ring-1 ring-[#1D4ED8]" /> Tú estás aquí</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-olla" /> {etiqueta}</span>
          {zona && <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full border-2 border-[#D9532F]" /> Zona aproximada que ven los compradores</span>}
        </p>
      )}
      <Button variante="contorno" icono={gps === 'cargando' ? Loader2 : Crosshair} className="w-full" onClick={usarGps} disabled={gps === 'cargando'}>
        {gps === 'cargando' ? 'Buscando tu ubicación…' : 'Usar mi ubicación (GPS)'}
      </Button>
      {puesto && (
        <Button icono={Check} className="w-full" onClick={confirmar} disabled={!valor}>
          {confirmado ? 'Ubicación confirmada' : 'Confirmar ubicación'}
        </Button>
      )}
      <p className="text-sm text-piedra" role="status">
        {gps === 'denegado' && 'No diste permiso al GPS. Toca el mapa donde está tu punto.'}
        {gps === 'error' && 'No pudimos ubicarte. Toca el mapa donde está tu punto.'}
        {gps !== 'denegado' && gps !== 'error' && (valor ? 'Listo, quedó marcado. Toca otro punto o arrastra el pin si quieres moverlo.' : 'Toca el mapa donde está tu punto.')}
      </p>
    </div>
  )
}
