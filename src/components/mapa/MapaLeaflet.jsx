import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Colores de DESIGN.md. El azul de nevera es solo pa' refrigeración; el de "Tú estás aquí" es otro y con otra forma.
const COLOR = { frio: '#0E7490', ambiente: '#57534E', comprador: '#D9532F', tuPuesto: '#1B5E3A' }
const INTERIOR = {
  frio: '<circle cx="18" cy="16" r="6" fill="#fff"/>',
  ambiente: '<circle cx="18" cy="16" r="6" fill="#fff"/><circle cx="18" cy="16" r="2.5" fill="#57534E"/>',
  comprador: '<rect x="12" y="10" width="12" height="12" rx="2" fill="#fff"/>',
  tuPuesto: '<path d="M18 8l2.6 5.3 5.8.8-4.2 4.1 1 5.8L18 21.2l-5.2 2.8 1-5.8-4.2-4.1 5.8-.8z" fill="#fff"/>',
}

function icono(tipo) {
  const grande = tipo === 'tuPuesto'
  const [w, h] = grande ? [44, 54] : [36, 44]
  return L.divIcon({
    className: 'pin-olla',
    html: `<svg width="${w}" height="${h}" viewBox="0 0 36 44" aria-hidden="true"><path d="M18 43C18 43 33 28 33 16A15 15 0 0 0 3 16c0 12 15 27 15 27z" fill="${COLOR[tipo]}" stroke="#fff" stroke-width="2"/>${INTERIOR[tipo]}</svg>`,
    iconSize: [w, h],
    iconAnchor: [w / 2, h - 1],
    popupAnchor: [0, -h + 6],
  })
}

const ICONO_USUARIO = L.divIcon({
  className: 'pin-olla',
  html: '<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#1D4ED8;border:4px solid #fff;box-shadow:0 0 0 3px rgba(29,78,216,.35)"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

function popup(m, alAccion) {
  const caja = document.createElement('div')
  caja.style.minWidth = '200px'
  const titulo = document.createElement('p')
  titulo.textContent = m.titulo
  titulo.style.cssText = 'margin:0;font-weight:800;font-size:16px;color:#1C1F1D'
  caja.appendChild(titulo)
  for (const linea of m.lineas ?? []) {
    const p = document.createElement('p')
    p.textContent = linea
    p.style.cssText = 'margin:4px 0 0;font-size:14px;color:#57534E'
    caja.appendChild(p)
  }
  if (m.aviso) {
    const p = document.createElement('p')
    p.textContent = m.aviso
    p.style.cssText = 'margin:6px 0 0;font-size:13px;font-weight:600;color:#B45309'
    caja.appendChild(p)
  }
  if (m.accion) {
    const b = document.createElement('button')
    b.type = 'button'
    b.textContent = m.accion.etiqueta
    b.style.cssText =
      'margin-top:8px;width:100%;min-height:48px;border:0;border-radius:12px;background:#1B5E3A;color:#fff;font-weight:700;font-size:15px;cursor:pointer'
    b.addEventListener('click', () => alAccion(m.accion.valor))
    caja.appendChild(b)
  }
  return caja
}

// Mapa de OpenStreetMap con Leaflet directo (sin wrapper). Pines con L.divIcon y círculos de zona aproximada.
export default function MapaLeaflet({ centro, zoom, marcadores, usuario, centrarEnUsuario, enfocar, radioZona, alAccion }) {
  const caja = useRef(null)
  const mapa = useRef(null)
  const capa = useRef(null)
  const capaUsuario = useRef(null)
  const abribles = useRef({})
  const accion = useRef(alAccion)
  accion.current = alAccion

  useEffect(() => {
    const m = L.map(caja.current, { zoomControl: true, scrollWheelZoom: false }).setView(centro, zoom)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(m)
    capa.current = L.layerGroup().addTo(m)
    capaUsuario.current = L.layerGroup().addTo(m)
    mapa.current = m
    return () => {
      m.remove()
      mapa.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    mapa.current?.setView(centro, zoom)
  }, [centro, zoom])

  useEffect(() => {
    capa.current.clearLayers()
    abribles.current = {}
    for (const m of marcadores) {
      const lugar = (x) => x.bindPopup(popup(m, (v) => accion.current(v)), { closeButton: true, autoPanPadding: [24, 24] })
      let objeto
      if (m.aprox) {
        objeto = L.circle([m.lat, m.lng], {
          radius: radioZona,
          color: COLOR[m.tipo],
          weight: 2,
          fillColor: COLOR[m.tipo],
          fillOpacity: 0.22,
          dashArray: '6 6',
        })
        lugar(objeto).addTo(capa.current)
        const punto = L.marker([m.lat, m.lng], { icon: icono(m.tipo), title: m.titulo, keyboard: true })
        lugar(punto).addTo(capa.current)
        abribles.current[m.id] = punto
      } else {
        objeto = L.marker([m.lat, m.lng], { icon: icono(m.tipo), title: m.titulo, keyboard: true, zIndexOffset: m.tipo === 'tuPuesto' ? 500 : 0 })
        lugar(objeto).addTo(capa.current)
        abribles.current[m.id] = objeto
      }
    }
  }, [marcadores, radioZona])

  useEffect(() => {
    capaUsuario.current.clearLayers()
    if (!usuario) return
    L.marker(usuario, { icon: ICONO_USUARIO, title: 'Tú estás aquí', zIndexOffset: 900 })
      .bindPopup('<b>Tú estás aquí</b>')
      .addTo(capaUsuario.current)
    if (centrarEnUsuario) mapa.current?.setView(usuario, 16)
  }, [usuario, centrarEnUsuario])

  useEffect(() => {
    const m = enfocar?.id && abribles.current[enfocar.id]
    if (!m || !mapa.current) return
    mapa.current.setView(m.getLatLng(), Math.max(mapa.current.getZoom(), 17))
    m.openPopup()
  }, [enfocar, marcadores])

  return <div ref={caja} className="h-full w-full" role="region" aria-label="Mapa de puestos y pedidos" />
}
