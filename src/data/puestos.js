// Puestos y compradores de la zona (coordenadas de la Ciudadela 20 de Julio / Metropolitana, Barranquilla).
// tipo 'puesto' vende; tipo 'comprador' pide pa' su olla. privacidad 'exacto' muestra el pin; 'zona' solo un círculo.

const PAGO_EFECTIVO = 'Efectivo contra inspección (primero revisas, luego pagas)'
const E = (frio, tapada, techo, separa, domicilio, nequi) => ({ frio, tapada, techo, separa, domicilio, nequi })
const HORARIO = 'Lun–Sáb 5:00 a. m. – 4:00 p. m.'
const HORARIO_CORTO = 'Lun–Sáb 6:00 a. m. – 3:00 p. m.'

export const PUESTOS = [
  // Barranquilla — piloto real
  {
    id: 'edwin', ciudad: 'bq', tipo: 'puesto', nombre: 'Fruver LMC', barrio: 'Ciudadela 20 de Julio',
    direccion: 'Cra. 6 Sur #47-14', coord: [10.9268, -74.8052], privacidad: 'exacto', formal: true,
    fotos: ['/fotos/puesto-lmc.jpg', '/fotos/lmc-neveras.jpg'], horario: HORARIO,
    pagos: [PAGO_EFECTIVO, 'Nequi (opcional)'], estandares: E(true, true, true, true, false, true),
  },
  {
    id: 'ana', ciudad: 'bq', tipo: 'puesto', nombre: 'Puesto Ana', barrio: 'Metrocentro',
    direccion: 'Cra. 1A con Cll 45A, frente a Metrocentro', coord: [10.9301, -74.8031], privacidad: 'zona', formal: false,
    fotos: ['/fotos/puesto-metrocentro.jpg'], horario: HORARIO_CORTO,
    pagos: [PAGO_EFECTIVO], estandares: E(false, true, false, true, false, false),
  },
  {
    id: 'mana', ciudad: 'bq', tipo: 'puesto', nombre: 'Fruvers El Maná', barrio: 'La 49',
    direccion: 'Cll 49 (La 49)', coord: [10.9246, -74.8068], privacidad: 'exacto', formal: true,
    fotos: [], horario: 'Lun–Sáb 5:30 a. m. – 4:00 p. m.', pagos: [PAGO_EFECTIVO, 'Nequi (opcional)'],
    estandares: E(true, true, true, false, true, true),
  },
  {
    id: 'chelo', ciudad: 'bq', tipo: 'puesto', nombre: 'Fruver Don Chelo', barrio: 'Ciudadela 20 de Julio',
    direccion: 'Cra. 4 Sur con Cll 47', coord: [10.9237, -74.8013], privacidad: 'exacto', formal: true, muestra: true,
    fotos: [], horario: HORARIO, pagos: [PAGO_EFECTIVO, 'Nequi (opcional)'], estandares: E(true, true, true, true, false, true),
  },
  {
    id: 'esquina', ciudad: 'bq', tipo: 'puesto', nombre: 'Frutas La Esquina', barrio: 'Metropolitana',
    direccion: 'Cra. 2 con Cll 46', coord: [10.9289, -74.8089], privacidad: 'zona', formal: false, muestra: true,
    fotos: [], horario: 'Lun–Sáb 6:00 a. m. – 2:00 p. m.', pagos: [PAGO_EFECTIVO], estandares: E(false, false, true, true, false, false),
  },
  // Compradores de la zona (pedidos pa' la olla)
  { id: 'wilmary', ciudad: 'bq', tipo: 'comprador', nombre: 'Corrientazo El Punto Clave', pedidoComo: 'El Punto Clave', barrio: 'Metrocentro', direccion: 'Cra. 1A #45H-64', coord: [10.9312, -74.8024], privacidad: 'exacto', oficio: 'Corrientazo' },
  { id: 'nsantander', ciudad: 'bq', tipo: 'comprador', nombre: 'Restaurante Nuevo Santander', pedidoComo: 'Restaurante Nuevo Santander', barrio: 'Ciudadela 20 de Julio', direccion: 'Cra. 6 Sur', coord: [10.9279, -74.8076], privacidad: 'zona', oficio: 'Restaurante' },
  { id: 'fresco', ciudad: 'bq', tipo: 'comprador', nombre: 'Juguería Fresco Ya', pedidoComo: 'Juguería Fresco Ya', barrio: 'Metropolitana', direccion: 'Cll 47 con Cra. 3', coord: [10.9256, -74.8009], privacidad: 'exacto', oficio: 'Juguería' },
  { id: 'nelly', ciudad: 'bq', tipo: 'comprador', nombre: 'Fritos Doña Nelly', pedidoComo: 'Fritos Doña Nelly', barrio: 'Metropolitana', direccion: 'Cra. 2 con Cll 48', coord: [10.9262, -74.8037], privacidad: 'zona', oficio: 'Fritos' },
  { id: 'mercedes', ciudad: 'bq', tipo: 'comprador', nombre: 'Hogar de Mercedes', pedidoComo: 'Mercedes (Hogar)', barrio: 'Ciudadela 20 de Julio', direccion: 'Cll 46 con Cra. 5', coord: [10.9293, -74.8062], privacidad: 'zona', oficio: 'Hogar' },

  // Plazas de muestra: cada ciudad opera con sus propios puestos locales
  { id: 'bog1', ciudad: 'bog', tipo: 'puesto', nombre: 'Fruver Paloquemao 14', barrio: 'Paloquemao', direccion: 'Plaza de Paloquemao, local 14', coord: [4.6131, -74.0899], privacidad: 'exacto', formal: true, fotos: [], horario: HORARIO, pagos: [PAGO_EFECTIVO], estandares: E(true, true, true, true, false, true) },
  { id: 'bog2', ciudad: 'bog', tipo: 'puesto', nombre: 'Verduras Doña Rosa', barrio: 'Paloquemao', direccion: 'Plaza de Paloquemao', coord: [4.6119, -74.0912], privacidad: 'zona', formal: false, fotos: [], horario: HORARIO_CORTO, pagos: [PAGO_EFECTIVO], estandares: E(false, true, true, false, false, false) },
  { id: 'bogp', ciudad: 'bog', tipo: 'comprador', nombre: 'Restaurante La Candelaria', pedidoComo: 'Restaurante La Candelaria', barrio: 'Paloquemao', direccion: 'Cll 19', coord: [4.6139, -74.0921], privacidad: 'exacto', oficio: 'Restaurante' },
  { id: 'med1', ciudad: 'med', tipo: 'puesto', nombre: 'Frutas La Minorista 8', barrio: 'La Minorista', direccion: 'Plaza Minorista, local 8', coord: [6.2662, -75.5699], privacidad: 'exacto', formal: true, fotos: [], horario: HORARIO, pagos: [PAGO_EFECTIVO], estandares: E(true, true, true, true, false, true) },
  { id: 'med2', ciudad: 'med', tipo: 'puesto', nombre: 'Don Aníbal Verduras', barrio: 'La Minorista', direccion: 'Plaza Minorista', coord: [6.2646, -75.5713], privacidad: 'zona', formal: false, fotos: [], horario: HORARIO_CORTO, pagos: [PAGO_EFECTIVO], estandares: E(false, false, false, true, false, false) },
  { id: 'medp', ciudad: 'med', tipo: 'comprador', nombre: 'Corrientazo El Paisa', pedidoComo: 'Corrientazo El Paisa', barrio: 'La Minorista', direccion: 'Cra. 57', coord: [6.2671, -75.5722], privacidad: 'exacto', oficio: 'Corrientazo' },
  { id: 'mx1', ciudad: 'mx', tipo: 'puesto', nombre: 'Frutas y Verduras Lupita', barrio: 'Central de Abasto', direccion: 'Central de Abasto, nave C', coord: [19.3741, -99.0868], privacidad: 'exacto', formal: true, fotos: [], horario: HORARIO, pagos: [PAGO_EFECTIVO], estandares: E(true, true, true, true, false, false) },
  { id: 'mx2', ciudad: 'mx', tipo: 'puesto', nombre: 'Nopales Don Beto', barrio: 'Central de Abasto', direccion: 'Central de Abasto, nave F', coord: [19.3727, -99.0886], privacidad: 'zona', formal: false, fotos: [], horario: HORARIO_CORTO, pagos: [PAGO_EFECTIVO], estandares: E(false, true, true, false, false, false) },
  { id: 'mxp', ciudad: 'mx', tipo: 'comprador', nombre: 'Fonda Doña Chela', pedidoComo: 'Fonda Doña Chela', barrio: 'Central de Abasto', direccion: 'Calle 4', coord: [19.3749, -99.0889], privacidad: 'exacto', oficio: 'Fonda' },
]

export const puestoPorId = (id) => PUESTOS.find((p) => p.id === id) ?? null
export const puestosDe = (ciudadId) => PUESTOS.filter((p) => p.ciudad === ciudadId && p.tipo === 'puesto')
export const compradoresDe = (ciudadId) => PUESTOS.filter((p) => p.ciudad === ciudadId && p.tipo === 'comprador')

// Centro del círculo de zona aproximada: se corre unos metros pa' que no delate el punto exacto.
export const RADIO_ZONA = 220
export function centroZona([lat, lng], id) {
  let h = 0
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 997
  const a = (h / 997) * Math.PI * 2
  return [lat + Math.sin(a) * 0.0007, lng + Math.cos(a) * 0.0007]
}
