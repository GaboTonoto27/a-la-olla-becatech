// Única puerta de entrada a localStorage. Si cambia la forma de los datos, sube VERSION.
const VERSION = 3
const CLAVE = 'alaolla:v' + VERSION

const INICIAL = {
  usuarioId: null,
  modo: null,
  pactos: {},
  ciudadId: 'bq',
  sinCelular: {},
  estandares: {},
  lotes: null,
  apartados: null,
  pedidos: null,
}

export function leer() {
  try {
    const crudo = localStorage.getItem(CLAVE)
    return crudo ? { ...INICIAL, ...JSON.parse(crudo) } : { ...INICIAL }
  } catch {
    return { ...INICIAL }
  }
}

export function guardar(estado) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado))
  } catch {
    /* sin almacenamiento: la app sigue funcionando en memoria */
  }
}

export function resetDemo() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('alaolla:'))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    /* nada */
  }
  return { ...INICIAL }
}
