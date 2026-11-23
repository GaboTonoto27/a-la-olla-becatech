// Cuentas de campo pa' evaluación (sin datos personales reales). Las claves son de prueba.
export const ADMIN_CORREO = 'admin@alaolla.co'

export const PERFILES_COMPRADOR = [
  { id: 'restaurante', etiqueta: 'Restaurante / Corrientazo' },
  { id: 'jugueria', etiqueta: 'Juguería / Fritos' },
  { id: 'hogar', etiqueta: 'Hogar' },
]


export const USUARIOS_DEMO = [
  {
    id: 'edwin',
    nombre: 'Edwin',
    correo: 'edwin@fruverlmc.co',
    clave: '123456',
    negocio: 'Fruver LMC',
    etiqueta: 'Vendedor formal',
    detalle: 'Puesto con nevera. Compra y vende.',
    rol: 'ambos',
    modoInicial: 'vendedor',
    perfilComprador: 'restaurante',
    barrio: 'Ciudadela 20 de Julio',
    plan: 'formal',
    sinCelular: false,
  },
  {
    id: 'ana',
    nombre: 'Ana',
    correo: 'ana@metrocentro.co',
    clave: '123456',
    negocio: 'Puesto Ana',
    etiqueta: 'Vendedora informal',
    detalle: 'Contesta desde la casa, no en el puesto.',
    rol: 'vendedor',
    modoInicial: 'vendedor',
    barrio: 'Metrocentro',
    plan: 'popular',
    sinCelular: true,
  },
  {
    id: 'wilmary',
    nombre: 'Wilmary',
    correo: 'wilmary@puntoclave.co',
    clave: '123456',
    negocio: 'El Punto Clave',
    etiqueta: 'Corrientazo',
    detalle: 'Restaurante que cocina todos los días.',
    rol: 'comprador',
    modoInicial: 'comprador',
    perfilComprador: 'restaurante',
    barrio: 'Metrocentro',
  },
  {
    id: 'mercedes',
    nombre: 'Mercedes',
    correo: 'mercedes@conidec.co',
    clave: '123456',
    negocio: 'Hogar',
    etiqueta: 'Comprador de hogar',
    detalle: 'Cocina para la familia.',
    rol: 'comprador',
    modoInicial: 'comprador',
    perfilComprador: 'hogar',
    barrio: 'Conidec',
  },
  {
    id: 'admin',
    nombre: 'Coordinación',
    correo: ADMIN_CORREO,
    clave: 'AdminOlla2026*',
    negocio: 'Barranquilla',
    etiqueta: 'Administrador',
    detalle: 'Revisa denuncias, soporte y cifras.',
    rol: 'admin',
    modoInicial: 'admin',
  },
]

// Cuentas con su estado de moderación listo pa' guardar en el store.
export function cuentasDemo() {
  return USUARIOS_DEMO.map((u) => ({ ...u, demo: true, estado: 'activo', strikes: 0, suspendidoHasta: null, proveedor: 'clave' }))
}
