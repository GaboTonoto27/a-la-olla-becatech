// Única puerta de entrada a localStorage. Si cambia la forma de los datos, sube VERSION.
// v4: cuentas reales, chats, reseñas, denuncias, tickets y coordenadas exactas. Al subir la versión
// se borran solas las claves viejas (coordenadas y sesiones de versiones anteriores).
const VERSION = 4
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
  cuentas: null,
  chats: null,
  puestosExtra: [],
  puestoOverrides: {},
  resenas: [],
  denuncias: [],
  tickets: [],
  marcados: [],
  alertasCorreo: [],
  adminCorreo: '',
  pushAdmin: false,
  plazas: [],
}

function limpiarViejas() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('alaolla:') && k !== CLAVE)
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    /* nada */
  }
}

export function leer() {
  try {
    limpiarViejas()
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
