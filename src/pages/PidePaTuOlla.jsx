import { useApp } from '../context/AppContext.jsx'
import NuevoPedido from '../components/pedidos/NuevoPedido.jsx'
import { PedidoComprador, PedidoVendedor } from '../components/pedidos/PedidoCard.jsx'
import SinCelularCard from '../components/SinCelularCard.jsx'
import AvisoPlaza from '../components/layout/AvisoPlaza.jsx'

function Comprador() {
  const { pedidos, usuario, ciudad } = useApp()
  const mios = pedidos.filter((p) => p.compradorId === usuario.id && p.ciudad === ciudad.id && p.estado !== 'cerrado')
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl sm:text-4xl">Pide pa' tu olla</h1>
        <p className="mt-1 text-lg text-piedra">Cuéntanos qué vas a cocinar. Los puestos de {ciudad.plaza} te responden con su precio.</p>
      </div>
      <AvisoPlaza />
      <NuevoPedido />
      <section className="space-y-3" aria-label="Tus encargos">
        <h2 className="text-2xl">Tus encargos</h2>
        {mios.length === 0 ? (
          <p className="text-base text-piedra">Aún no has pedido nada hoy.</p>
        ) : (
          mios.map((p) => <PedidoComprador key={p.id} p={p} />)
        )}
      </section>
    </div>
  )
}

function Vendedor() {
  const { pedidos, usuario, ciudad } = useApp()
  const lista = pedidos
    .filter(
      (p) =>
        p.ciudad === ciudad.id &&
        (p.estado === 'abierto' || (p.estado === 'aceptado' && p.ganador?.vendedorId === usuario.id)),
    )
    .sort((a, b) => b.creado - a.creado)
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl sm:text-4xl">Encargos pa' tu puesto</h1>
        <p className="mt-1 text-lg text-piedra">Esto es lo que necesitan cocinar. Respondes sin tomar fotos de nada.</p>
      </div>
      <AvisoPlaza />
      <SinCelularCard />
      <section className="space-y-3" aria-label="Pedidos abiertos">
        {lista.length === 0 ? (
          <p className="text-base text-piedra">Por ahora no hay pedidos abiertos.</p>
        ) : (
          lista.map((p) => <PedidoVendedor key={p.id} p={p} />)
        )}
      </section>
    </div>
  )
}

export default function PidePaTuOlla() {
  const { modo } = useApp()
  return modo === 'vendedor' ? <Vendedor /> : <Comprador />
}
