// Datos de prueba del prototipo (sin datos personales reales).
export const USUARIOS_DEMO = [
  {
    id: 'edwin',
    nombre: 'Edwin',
    negocio: 'Fruver LMC',
    etiqueta: 'Vendedor formal',
    detalle: 'Puesto con nevera. Compra y vende.',
    rol: 'ambos',
    modoInicial: 'vendedor',
    tipoPuesto: 'formal',
    sinCelular: false,
  },
  {
    id: 'ana',
    nombre: 'Ana',
    negocio: 'Puesto Ana',
    etiqueta: 'Vendedora informal',
    detalle: 'Contesta desde la casa, no en el puesto.',
    rol: 'vendedor',
    modoInicial: 'vendedor',
    tipoPuesto: 'informal',
    sinCelular: true,
  },
  {
    id: 'wilmary',
    nombre: 'Wilmary',
    negocio: 'El Punto Clave',
    etiqueta: 'Corrientazo',
    detalle: 'Restaurante que cocina todos los días.',
    rol: 'comprador',
    modoInicial: 'comprador',
  },
  {
    id: 'mercedes',
    nombre: 'Mercedes',
    negocio: 'Hogar',
    etiqueta: 'Comprador de hogar',
    detalle: 'Cocina para la familia.',
    rol: 'comprador',
    modoInicial: 'comprador',
  },
  {
    id: 'admin',
    nombre: 'Coordinación',
    negocio: 'Barranquilla',
    etiqueta: 'Administrador',
    detalle: 'Revisa denuncias, soporte y cifras.',
    rol: 'admin',
    modoInicial: 'admin',
  },
]

// Quien entra con Google, Facebook o usuario y contraseña (simulado).
export const USUARIO_VISITANTE = {
  id: 'visitante',
  nombre: 'Visitante',
  negocio: 'Mi cuenta',
  etiqueta: 'Cuenta nueva',
  detalle: 'Compra y vende con la misma cuenta.',
  rol: 'ambos',
  modoInicial: 'comprador',
  tipoPuesto: 'informal',
  sinCelular: false,
}

export function buscarUsuario(id) {
  return [...USUARIOS_DEMO, USUARIO_VISITANTE].find((u) => u.id === id) ?? null
}
