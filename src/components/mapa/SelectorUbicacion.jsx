import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Check, Crosshair, Loader2 } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Button from '../ui/Button.jsx'
import { RADIO_ZONA, centroZona } from '../../data/puestos.js'

const CENTRO = [10.929, -74.8045]
const PIN = L.divIcon({
  className: 'pin-olla',
  html: '<svg width="36" height="44" viewBox="0 0 36 44" aria-hidden="true"><path d="M18 43C18 43 33 28 33 16A15 15 0 0 0 3 16c0 12 15 27 15 27z" fill="#1B5E3A" stroke="#fff" stroke-width="2"/><circle cx="18" cy="16" r="6" fill="#fff"/></svg>',
  iconSize: [36, 44],
  iconAnchor: [18, 43],
})
const PUNTO_AZUL = '<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#1D4ED8;border:4px solid #fff;box-shadow:0 0 0 3px rgba(29,78,216,.35)"></span>'
const YO = L.divIcon({ className: 'pin-olla', html: PUNTO_AZUL, iconSize: [22, 22], iconAnchor: [11, 11] })

// Mini-mapa de OpenStreetMap ($0) con UN solo botón de GPS.
//  modo "persona": el pin es el punto azul de quien usa la app (pa' comprar).
//  modo "puesto":  el pin verde es el puesto; el punto azul solo es referencia de dónde está la persona.
// Al usar el GPS el pin salta directo a esa coordenada y el mapa se centra ahí. Se puede ajustar tocando o arrastrando.
export default function SelectorUbicacion({
  modo = 'puesto',
  valor,
  onChange,
  onGps,
  onConfirmar,
  zona = false,
  id = 'x',
  referencia = null,
  etiquetaGps = 'Usar mi ubicación',
  etiquetaPin = 'Tu puesto',
  pregunta = null,
  foco = null,
}) {
  const { notificar } = useApp()
  const esPuesto = modo === 'puesto'
  const caja = useRef(null)
  const mapa = useRef(null)
  const marcador = useRef(null)
  const yo = useRef(null)
  const circulo = useRef(null)
  const alCambiar = useRef(onChange)
  alCambiar.current = onChange
  const alGps = useRef(onGps)
  alGps.current = onGps
  const [gps, setGps] = useState('idle')
  const [mia, setMia] = useState(esPuesto ? referencia : null)
  const [confirmado, setConfirmado] = useState(false)

  useEffect(() => {
    const m = L.map(caja.current, { scrollWheelZoom: false }).setView(valor ?? CENTRO, 16)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m)
    m.on('click', (ev) => {
      setConfirmado(false)
      setGps((g) => (g === 'ok' ? 'manual' : g))
      alCambiar.current([ev.latlng.lat, ev.latlng.lng])
    })
    mapa.current = m
    return () => {
      m.remove()
      mapa.current = marcador.current = yo.current = circulo.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Pin principal (arrastrable) y, si es un puesto informal, el círculo de zona aproximada.
  useEffect(() => {
    const m = mapa.current
    if (!m || !valor) return
    if (marcador.current) marcador.current.setLatLng(valor)
    else {
      marcador.current = L.marker(valor, { icon: esPuesto ? PIN : YO, title: etiquetaPin, draggable: true }).addTo(m)
      marcador.current.on('dragend', () => {
        const p = marcador.current.getLatLng()
        setConfirmado(false)
        setGps((g) => (g === 'ok' ? 'manual' : g))
        alCambiar.current([p.lat, p.lng])
      })
    }
    if (esPuesto && zona) {
      const c = centroZona(valor, id)
      if (circulo.current) circulo.current.setLatLng(c)
      else circulo.current = L.circle(c, { radius: RADIO_ZONA, color: '#D9532F', weight: 2, fillColor: '#D9532F', fillOpacity: 0.12 }).addTo(m)
    } else if (circulo.current) {
      circulo.current.remove()
      circulo.current = null
    }
  }, [valor, esPuesto, zona, id, etiquetaPin])

  // Punto azul de referencia (solo en modo puesto): dónde está la persona ahora.
  useEffect(() => {
    const m = mapa.current
    if (!m || !esPuesto || !mia) return
    if (yo.current) yo.current.setLatLng(mia)
    else yo.current = L.marker(mia, { icon: YO, title: 'Tú estás aquí', interactive: false, keyboard: false }).addTo(m)
  }, [mia, esPuesto])

  // Una búsqueda de dirección pide centrar el mapa con vuelo suave.
  useEffect(() => {
    if (foco?.punto && mapa.current) mapa.current.flyTo(foco.punto, 17, { duration: 0.6 })
  }, [foco?.n]) // eslint-disable-line react-hooks/exhaustive-deps

  const usarGps = () => {
    if (!('geolocation' in navigator)) return setGps('error')
    setGps('cargando')
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const punto = [p.coords.latitude, p.coords.longitude]
        // El pin salta directo al GPS (sin esperar a que React repinte) y el mapa se acerca ahí.
        marcador.current?.setLatLng(punto)
        mapa.current?.flyTo(punto, 17, { duration: 0.6 })
        if (esPuesto) setMia(punto)
        setConfirmado(false)
        alCambiar.current(punto)
        alGps.current?.(punto)
        setGps('ok')
        notificar('Listo, apuntamos a tu ubicación actual')
      },
      (e) => setGps(e.code === 1 ? 'denegado' : 'error'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  const confirmar = () => {
    setConfirmado(true)
    onConfirmar?.(valor)
  }

  const mensaje =
    gps === 'denegado' ? 'No diste permiso al GPS. Toca el mapa o arrastra el pin hasta el punto correcto.'
    : gps === 'error' ? 'No pudimos ubicarte. Toca el mapa o arrastra el pin hasta el punto correcto.'
    : gps === 'ok' ? 'Listo, apuntamos a tu ubicación actual. Si no es exacto, toca el mapa o arrastra el pin.'
    : valor ? 'Toca el mapa o arrastra el pin si quieres moverlo.'
    : 'Toca el mapa para marcar el punto.'

  return (
    <div className="space-y-2">
      {pregunta && <p className="text-base font-bold">{pregunta}</p>}
      <div className="isolate h-56 overflow-hidden rounded-2xl border border-borde">
        <div ref={caja} className="h-full w-full" role="region" aria-label={esPuesto ? "Mapa pa' marcar tu puesto" : "Mapa pa' marcar dónde estás"} />
      </div>
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-piedra">
        {esPuesto ? (
          <>
            <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full border-2 border-white bg-[#1D4ED8] ring-1 ring-[#1D4ED8]" /> Punto azul: dónde estás ahora</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-olla" /> Pin verde: tu puesto</span>
            {zona && <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full border-2 border-[#D9532F]" /> Zona aproximada que ven los compradores</span>}
          </>
        ) : (
          <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full border-2 border-white bg-[#1D4ED8] ring-1 ring-[#1D4ED8]" /> El punto azul eres tú</span>
        )}
      </p>
      <Button variante="contorno" icono={gps === 'cargando' ? Loader2 : Crosshair} className="w-full" onClick={usarGps} disabled={gps === 'cargando'}>
        {gps === 'cargando' ? 'Buscando tu ubicación…' : etiquetaGps}
      </Button>
      <Button icono={Check} className="w-full" onClick={confirmar} disabled={!valor}>
        {confirmado ? 'Ubicación confirmada' : 'Confirmar ubicación'}
      </Button>
      <p className="text-sm text-piedra" role="status">{mensaje}</p>
    </div>
  )
}
