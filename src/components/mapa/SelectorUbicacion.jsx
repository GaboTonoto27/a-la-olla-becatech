import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Crosshair, Loader2 } from 'lucide-react'
import Button from '../ui/Button.jsx'

const CENTRO = [10.929, -74.8045]
const PIN = L.divIcon({
  className: 'pin-olla',
  html: '<svg width="36" height="44" viewBox="0 0 36 44" aria-hidden="true"><path d="M18 43C18 43 33 28 33 16A15 15 0 0 0 3 16c0 12 15 27 15 27z" fill="#1B5E3A" stroke="#fff" stroke-width="2"/><circle cx="18" cy="16" r="6" fill="#fff"/></svg>',
  iconSize: [36, 44],
  iconAnchor: [18, 43],
})

// Mapa pequeño pa' marcar el puesto: toca el mapa o usa el GPS. Cuesta $0 (OpenStreetMap).
export default function SelectorUbicacion({ valor, onChange }) {
  const caja = useRef(null)
  const mapa = useRef(null)
  const marcador = useRef(null)
  const alCambiar = useRef(onChange)
  alCambiar.current = onChange
  const [gps, setGps] = useState('idle')

  useEffect(() => {
    const m = L.map(caja.current, { scrollWheelZoom: false }).setView(valor ?? CENTRO, 16)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m)
    m.on('click', (ev) => alCambiar.current([ev.latlng.lat, ev.latlng.lng]))
    mapa.current = m
    return () => {
      m.remove()
      mapa.current = null
      marcador.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!mapa.current || !valor) return
    if (marcador.current) marcador.current.setLatLng(valor)
    else marcador.current = L.marker(valor, { icon: PIN, title: 'Tu puesto' }).addTo(mapa.current)
  }, [valor])

  const usarGps = () => {
    if (!('geolocation' in navigator)) return setGps('error')
    setGps('cargando')
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const punto = [p.coords.latitude, p.coords.longitude]
        alCambiar.current(punto)
        mapa.current?.setView(punto, 17)
        setGps('ok')
      },
      (e) => setGps(e.code === 1 ? 'denegado' : 'error'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  return (
    <div className="space-y-2">
      <div className="isolate h-56 overflow-hidden rounded-2xl border border-borde">
        <div ref={caja} className="h-full w-full" role="region" aria-label="Mapa pa' marcar tu puesto" />
      </div>
      <Button variante="contorno" icono={gps === 'cargando' ? Loader2 : Crosshair} className="w-full" onClick={usarGps} disabled={gps === 'cargando'}>
        {gps === 'cargando' ? 'Buscando tu ubicación…' : 'Usar mi ubicación (GPS)'}
      </Button>
      <p className="text-sm text-piedra" role="status">
        {gps === 'denegado' && 'No diste permiso al GPS. Toca el mapa donde está tu puesto.'}
        {gps === 'error' && 'No pudimos ubicarte. Toca el mapa donde está tu puesto.'}
        {gps !== 'denegado' && gps !== 'error' && (valor ? 'Listo, tu puesto quedó marcado. Toca otro punto si quieres moverlo.' : 'Toca el mapa donde está tu puesto.')}
      </p>
    </div>
  )
}
