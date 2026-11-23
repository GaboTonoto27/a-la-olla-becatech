import { Home, ShoppingBasket, Zap, MapPin, User } from 'lucide-react'

// Máximo 4 pestañas en móvil. Cambian según el modo activo.
export function pestanasPara(modo) {
  const inicio = { to: '/', etiqueta: 'Inicio', icono: Home, fin: true }
  const mapa = { to: '/mapa', etiqueta: 'Mapa', icono: MapPin }
  const cuenta = { to: '/cuenta', etiqueta: 'Mi cuenta', icono: User }
  const medio =
    modo === 'vendedor'
      ? { to: '/ultima-hora', etiqueta: 'Última hora', icono: Zap }
      : { to: '/pedidos', etiqueta: 'Pedidos', icono: ShoppingBasket }
  return [inicio, medio, mapa, cuenta]
}
