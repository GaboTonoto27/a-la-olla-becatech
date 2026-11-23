// Datos de prueba de Última Hora y Pide pa' tu Olla (precios reales de las entrevistas, en COP).

export const PERFILES = {
  wilmary: { tipo: 'Restaurante corrientazo', compras: 23, rechazos: 0 },
  mercedes: { tipo: 'Hogar', compras: 9, rechazos: 1 },
  edwin: { tipo: 'Fruver que también compra', compras: 4, rechazos: 0 },
  visitante: { tipo: 'Cuenta nueva', compras: 0, rechazos: 0 },
}
export const PERFIL_NUEVO = { tipo: 'Cuenta nueva', compras: 0, rechazos: 0 }

const BARRIOS = { edwin: 'Ciudadela 20 de Julio', ana: 'Metrocentro' }
export function barrioDe(usuarioId, ciudad) {
  return ciudad.piloto && BARRIOS[usuarioId] ? BARRIOS[usuarioId] : ciudad.plaza
}

export const CATEGORIAS = [
  { id: 'fruta', etiqueta: 'Frutas' },
  { id: 'verdura', etiqueta: 'Verduras' },
  { id: 'hoja', etiqueta: 'Hojas' },
]
export const NIVELES = {
  cocina: "Pa' Cocina / Pulpa (100% sano)",
  cria: "Pa' Cría / Abono",
}
export const MOTIVOS = ['Muy maduro', 'Machucado', 'Torcido', 'Hojas maltratadas']
export const USOS = ['Guiso', 'Jugo', 'Sopa', 'Fritos']

// Productos de un toque pa' publicar. precio = referencia en Barranquilla (por unidad indicada).
export const PRODUCTOS_RAPIDOS = [
  { nombre: 'Tomate', cat: 'verdura', precio: 6400, unidad: 'kg', uso: 'Guiso' },
  { nombre: 'Plátano', cat: 'fruta', precio: 1400, unidad: 'kg', uso: 'Fritos' },
  { nombre: 'Zanahoria', cat: 'verdura', precio: 1400, unidad: 'lb', uso: 'Sopa' },
  { nombre: 'Maracuyá', cat: 'fruta', precio: 8000, unidad: 'kg', uso: 'Jugo' },
  { nombre: 'Naranja', cat: 'fruta', precio: 5500, unidad: 'kg', uso: 'Jugo' },
  { nombre: 'Guayaba', cat: 'fruta', precio: 5600, unidad: 'kg', uso: 'Jugo' },
  { nombre: 'Lechuga', cat: 'hoja', precio: 4000, unidad: 'bolsa', uso: 'Guiso' },
]

const FOTO_LMC = '/fotos/puesto-lmc.jpg'
const FOTO_NEVERAS = '/fotos/lmc-neveras.jpg'
const FOTO_ANA = '/fotos/puesto-metrocentro.jpg'
const LMC = { vendedorId: 'edwin', puesto: 'Fruver LMC', barrio: 'Ciudadela 20 de Julio' }
const MANA = { vendedorId: 'mana', puesto: 'Fruvers El Maná', barrio: 'La 49' }
const ANA = { vendedorId: 'ana', puesto: 'Puesto Ana', barrio: 'Metrocentro', foto: FOTO_ANA, formal: false, frio: false }

// Cada lote demo se renueva al abrir la app si ya venció, pa' que el jurado siempre vea lotes vivos.
function lote(ciudad, id, d) {
  return {
    ciudad,
    id: `${ciudad}-${id}`,
    demo: true,
    unidad: 'kg',
    nivel: 'cocina',
    formal: true,
    frio: true,
    foto: null,
    ...d,
    cantidadInicial: d.cantidad,
  }
}

function lotesDemo() {
  return [
    lote('bq', 'tomate', { ...LMC, foto: FOTO_LMC, producto: 'Tomate', cat: 'verdura', cantidad: 12, normal: 6400, rescate: 3800, motivo: 'Muy maduro', uso: 'Guiso', minutos: 125 }),
    lote('bq', 'platano', { ...LMC, foto: FOTO_NEVERAS, producto: 'Plátano', cat: 'fruta', cantidad: 20, normal: 1400, rescate: 800, motivo: 'Machucado', uso: 'Fritos', minutos: 95 }),
    lote('bq', 'zanahoria', { ...LMC, foto: FOTO_LMC, producto: 'Zanahoria', cat: 'verdura', unidad: 'lb', cantidad: 15, normal: 1400, rescate: 900, motivo: 'Torcido', uso: 'Sopa', minutos: 200 }),
    lote('bq', 'maracuya', { ...LMC, foto: FOTO_NEVERAS, producto: 'Maracuyá', cat: 'fruta', cantidad: 6, normal: 8000, rescate: 5000, motivo: 'Muy maduro', uso: 'Jugo', minutos: 150 }),
    lote('bq', 'guayaba', { ...LMC, foto: FOTO_LMC, producto: 'Guayaba', cat: 'fruta', cantidad: 8, normal: 5600, rescate: 3200, motivo: 'Muy maduro', uso: 'Jugo', minutos: 40 }),
    lote('bq', 'platano-cria', { ...LMC, foto: FOTO_NEVERAS, producto: 'Plátano muy pasado', cat: 'fruta', cantidad: 30, normal: 1200, rescate: 300, motivo: 'Muy maduro', uso: 'Cerdos y gallinas', nivel: 'cria', minutos: 180 }),
    lote('bq', 'tomate-arbol', { ...MANA, producto: 'Tomate de árbol', cat: 'fruta', cantidad: 10, normal: 6200, rescate: 3700, motivo: 'Muy maduro', uso: 'Jugo', minutos: 175 }),
    lote('bq', 'lulo', { ...MANA, producto: 'Lulo', cat: 'fruta', cantidad: 5, normal: 8800, rescate: 5300, motivo: 'Machucado', uso: 'Jugo', minutos: 110 }),
    lote('bq', 'lechuga', { ...ANA, producto: 'Bolsita de lechuga', cat: 'hoja', unidad: 'bolsa', cantidad: 6, normal: 5000, rescate: 3000, motivo: 'Hojas maltratadas', uso: 'Guiso', minutos: 135 }),
    lote('bq', 'gallos', { ...ANA, producto: 'Verdura pasada', cat: 'verdura', unidad: 'bolsa', cantidad: 4, normal: 3000, rescate: 1000, motivo: 'Muy maduro', uso: 'Gallinas y abono', nivel: 'cria', minutos: 160 }),

    lote('bog', 'papa', { vendedorId: 'bog1', puesto: 'Fruver Paloquemao 14', barrio: 'Paloquemao', producto: 'Papa criolla', cat: 'verdura', cantidad: 18, normal: 3500, rescate: 2200, motivo: 'Machucado', uso: 'Sopa', minutos: 140 }),
    lote('bog', 'uchuva', { vendedorId: 'bog1', puesto: 'Fruver Paloquemao 14', barrio: 'Paloquemao', producto: 'Uchuva', cat: 'fruta', cantidad: 7, normal: 9000, rescate: 5500, motivo: 'Muy maduro', uso: 'Jugo', minutos: 90 }),
    lote('bog', 'lechuga', { vendedorId: 'bog2', puesto: 'Verduras Doña Rosa', barrio: 'Paloquemao', producto: 'Lechuga crespa', cat: 'hoja', cantidad: 9, normal: 3000, rescate: 1800, motivo: 'Hojas maltratadas', uso: 'Guiso', frio: false, minutos: 170 }),

    lote('med', 'aguacate', { vendedorId: 'med1', puesto: 'Frutas La Minorista 8', barrio: 'La Minorista', producto: 'Aguacate hass', cat: 'fruta', cantidad: 10, normal: 9000, rescate: 5000, motivo: 'Muy maduro', uso: 'Guiso', minutos: 120 }),
    lote('med', 'tomate', { vendedorId: 'med1', puesto: 'Frutas La Minorista 8', barrio: 'La Minorista', producto: 'Tomate chonto', cat: 'verdura', cantidad: 14, normal: 4500, rescate: 2500, motivo: 'Muy maduro', uso: 'Guiso', minutos: 75 }),
    lote('med', 'banano-cria', { vendedorId: 'med2', puesto: 'Don Aníbal Verduras', barrio: 'La Minorista', producto: 'Banano pintón', cat: 'fruta', cantidad: 25, normal: 800, rescate: 300, motivo: 'Muy maduro', uso: 'Cerdos', nivel: 'cria', frio: false, formal: false, minutos: 190 }),

    lote('mx', 'jitomate', { vendedorId: 'mx1', puesto: 'Frutas y Verduras Lupita', barrio: 'Central de Abasto', producto: 'Jitomate', cat: 'verdura', cantidad: 20, normal: 32, rescate: 18, motivo: 'Muy maduro', uso: 'Guiso', minutos: 130 }),
    lote('mx', 'aguacate', { vendedorId: 'mx1', puesto: 'Frutas y Verduras Lupita', barrio: 'Central de Abasto', producto: 'Aguacate', cat: 'fruta', cantidad: 8, normal: 70, rescate: 40, motivo: 'Machucado', uso: 'Jugo', minutos: 100 }),
    lote('mx', 'nopal', { vendedorId: 'mx2', puesto: 'Nopales Don Beto', barrio: 'Central de Abasto', producto: 'Nopal', cat: 'hoja', cantidad: 12, normal: 20, rescate: 10, motivo: 'Hojas maltratadas', uso: 'Guiso', frio: false, minutos: 165 }),
  ]
}

const MIN = 60000

function pedidosDemo(ahora) {
  const base = (ciudad, id, d) => ({
    id: `${ciudad}-${id}`,
    ciudad,
    demo: true,
    estado: 'abierto',
    ofertas: [],
    dia: 'hoy',
    creado: ahora - 40 * MIN,
    ...d,
  })
  return [
    base('bq', 'p1', { compradorId: 'wilmary', comprador: 'El Punto Clave', producto: 'Tomate maduro', kg: 15, hora: '6:30 a. m.', presupuestoKg: 4500, uso: 'Guiso', cocino: "Guiso pa' el almuerzo corriente" }),
    base('bq', 'p2', { compradorId: null, comprador: 'Juguería Fresco Ya', producto: 'Maracuyá', kg: 8, hora: '7:00 a. m.', presupuestoKg: 5500, uso: 'Jugo', cocino: "Jugo pa' el día" }),
    base('bq', 'p3', { compradorId: null, comprador: 'Fritos Doña Nelly', producto: 'Plátano maduro', kg: 20, hora: '5:30 a. m.', presupuestoKg: 1000, uso: 'Fritos', cocino: 'Patacones y tajadas' }),
    base('bq', 'p4', { compradorId: 'mercedes', comprador: 'Mercedes (Hogar)', producto: 'Zanahoria', kg: 3, hora: '8:00 a. m.', presupuestoKg: 1000, uso: 'Sopa', cocino: "Sancocho pa' la familia" }),
    base('bog', 'p1', { compradorId: null, comprador: 'Restaurante La Candelaria', producto: 'Papa criolla', kg: 10, hora: '6:00 a. m.', presupuestoKg: 2000, uso: 'Sopa', cocino: 'Ajiaco' }),
    base('med', 'p1', { compradorId: null, comprador: 'Corrientazo El Paisa', producto: 'Tomate chonto', kg: 12, hora: '6:30 a. m.', presupuestoKg: 2300, uso: 'Guiso', cocino: "Hogao pa' el almuerzo" }),
    base('mx', 'p1', { compradorId: null, comprador: 'Fonda Doña Chela', producto: 'Jitomate', kg: 15, hora: '6:00 a. m.', presupuestoKg: 17, uso: 'Guiso', cocino: "Salsa pa' la comida corrida" }),
  ]
}

export function semilla(ahora = Date.now()) {
  const lotes = lotesDemo().map((l) => ({ ...l, creado: ahora, vence: ahora + l.minutos * MIN }))
  const apartados = []
  const reservar = (loteId, codigo, compradorId, nombre, cantidad, minutosAntes) => {
    const l = lotes.find((x) => x.id === loteId)
    l.cantidad -= cantidad
    apartados.push({
      id: `a-${codigo}`,
      codigo,
      loteId,
      ciudad: l.ciudad,
      vendedorId: l.vendedorId,
      puesto: l.puesto,
      barrio: l.barrio,
      producto: l.producto,
      unidad: l.unidad,
      nivel: l.nivel,
      cantidad,
      total: cantidad * l.rescate,
      comprador: { id: compradorId, nombre, ...PERFILES[compradorId] },
      estado: 'apartado',
      creado: ahora - minutosAntes * MIN,
    })
  }
  reservar('bq-tomate', 'OLLA-482', 'wilmary', 'El Punto Clave', 3, 25)
  reservar('bq-lechuga', 'OLLA-317', 'mercedes', 'Mercedes (Hogar)', 2, 12)
  return { lotes, apartados, pedidos: pedidosDemo(ahora) }
}
