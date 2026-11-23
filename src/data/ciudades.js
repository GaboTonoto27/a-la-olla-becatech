// Plazas disponibles. Barranquilla es el piloto real; las demás muestran que A la Olla se replica.
export const CIUDADES = [
  {
    id: 'bq',
    nombre: 'Barranquilla',
    plaza: 'Ciudadela 20 de Julio',
    estado: 'Piloto Activo',
    piloto: true,
    locale: 'es-CO',
    moneda: 'pesos colombianos',
    codigo: 'COP',
    factor: 1,
    coordinador: 'Coordinación Barranquilla',
  },
  {
    id: 'bog',
    nombre: 'Bogotá',
    plaza: 'Paloquemao',
    estado: 'Demo',
    locale: 'es-CO',
    moneda: 'pesos colombianos',
    codigo: 'COP',
    factor: 1,
    coordinador: 'Coordinación Bogotá',
  },
  {
    id: 'med',
    nombre: 'Medellín',
    plaza: 'La Minorista',
    estado: 'Demo',
    locale: 'es-CO',
    moneda: 'pesos colombianos',
    codigo: 'COP',
    factor: 1,
    coordinador: 'Coordinación Medellín',
  },
  {
    id: 'mx',
    nombre: 'CDMX',
    plaza: 'Central de Abasto',
    estado: 'Demo',
    locale: 'es-MX',
    moneda: 'pesos mexicanos',
    codigo: 'MXN',
    factor: 0.0055,
    coordinador: 'Coordinación CDMX',
  },
]

export function ciudadPorId(id) {
  return CIUDADES.find((c) => c.id === id) ?? CIUDADES[0]
}
