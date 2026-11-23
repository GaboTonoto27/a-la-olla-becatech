// Distancias reales entre dos puntos (fórmula Haversine).
const R = 6371000

const rad = (g) => (g * Math.PI) / 180

export function distanciaM(a, b) {
  const dLat = rad(b[0] - a[0])
  const dLng = rad(b[1] - a[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// 350 m · 1,2 km · 14 km
export function textoDistancia(m) {
  if (m < 1000) return `${Math.max(10, Math.round(m / 10) * 10)} m`
  const km = m / 1000
  return `${km < 10 ? km.toFixed(1).replace('.', ',') : Math.round(km)} km`
}

export const urlGoogleMaps = ([lat, lng]) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
export const urlWaze = ([lat, lng]) => `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
