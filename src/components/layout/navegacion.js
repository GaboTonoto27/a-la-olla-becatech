import { Home, ShoppingBasket, Zap, MapPin, Store, User } from 'lucide-react'

// Máximo 4 pestañas en móvil. Puestos y mapa aparecen en el menú de escritorio y como acceso en Inicio y Última hora.
export function pestanasPara(modo, escritorio = false) {
  const inicio = { to: '/', etiqueta: 'Inicio', icono: Home, fin: true }
  const ultima = { to: '/ultima-hora', etiqueta: 'Última hora', icono: Zap }
  const pedidos = { to: '/pedidos', etiqueta: 'Pedidos', icono: ShoppingBasket }
  const mapa = { to: '/mapa', etiqueta: 'Mapa', icono: MapPin }
  const puestos = { to: '/puestos', etiqueta: 'Puestos', icono: Store }
  const cuenta = { to: '/cuenta', etiqueta: 'Mi cuenta', icono: User }
  return escritorio ? [inicio, ultima, pedidos, puestos, mapa, cuenta] : [inicio, ultima, pedidos, cuenta]
}
