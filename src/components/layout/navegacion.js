import { Home, ShoppingBasket, Zap, MapPin, Store, User, ChefHat, TrendingUp, MessageCircle } from 'lucide-react'

// Máximo 4 pestañas en móvil. Mapa y Chat quedan en la barra de zona (móvil) y en el menú de escritorio.
// Comprador: Inicio, Última hora, Pide pa' tu olla, Mapa, Chat y Cuenta.
// Vendedor: Inicio, Pon pa' la olla, Ganancias, Mapa, Chat y Cuenta. Las rutas viejas siguen existiendo (no hay 404).
export function pestanasPara(modo, escritorio = false) {
  const inicio = { to: '/', etiqueta: 'Inicio', icono: Home, fin: true }
  const cuenta = { to: '/cuenta', etiqueta: 'Mi cuenta', icono: User }
  const mapa = { to: '/mapa', etiqueta: 'Mapa', icono: MapPin }
  const chat = { to: '/chat', etiqueta: 'Chat', icono: MessageCircle }
  if (modo === 'vendedor') {
    const pon = { to: '/ultima-hora', etiqueta: "Pon pa' la olla", icono: ChefHat }
    const ganancias = { to: '/ganancias', etiqueta: 'Ganancias', icono: TrendingUp }
    return escritorio ? [inicio, pon, ganancias, mapa, chat, cuenta] : [inicio, pon, ganancias, cuenta]
  }
  const ultima = { to: '/ultima-hora', etiqueta: 'Última hora', icono: Zap }
  const pedidos = { to: '/pedidos', etiqueta: "Pide pa' tu olla", icono: ShoppingBasket }
  const puestos = { to: '/puestos', etiqueta: 'Puestos', icono: Store }
  return escritorio ? [inicio, ultima, pedidos, puestos, mapa, chat, cuenta] : [inicio, ultima, { ...pedidos, etiqueta: 'Pedidos' }, cuenta]
}
