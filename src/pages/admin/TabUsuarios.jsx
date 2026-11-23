import { useApp } from '../../context/AppContext.jsx'
import { ETIQUETA_MEDIDA, sugerirMedida } from '../../lib/copiloto.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Pill from '../../components/ui/Pill.jsx'
import PillGravedad from './PillGravedad.jsx'

const ESTADO = {
  activo: { tono: 'olla', texto: 'Activo' },
  advertido: { tono: 'ambar', texto: 'Advertido' },
  suspendido: { tono: 'tomate', texto: 'Suspendido' },
  expulsado: { tono: 'tomate', texto: 'Expulsado' },
}
const ROL = { ambos: 'Compra y vende', vendedor: 'Vendedor', comprador: 'Comprador' }

const cuando = (t) => new Date(t).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

export default function TabUsuarios() {
  const { cuentas, marcados, cuentaPorId, reactivarCuenta, revisarMarcado } = useApp()
  const lista = cuentas.filter((c) => c.rol !== 'admin')
  return (
    <div className="space-y-6">
      <section className="space-y-3" aria-label="Usuarios">
        <h2 className="text-2xl">Cuentas ({lista.length})</h2>
        <ul className="space-y-3">
          {lista.map((c) => {
            const e = ESTADO[c.estado] ?? ESTADO.activo
            const hasta = c.estado === 'suspendido' && c.suspendidoHasta ? new Date(c.suspendidoHasta).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) : null
            return (
              <li key={c.id}>
                <Card className="flex flex-wrap items-center justify-between gap-3 !p-4">
                  <div className="min-w-0">
                    <p className="text-lg font-bold">{c.nombre} · {c.negocio}</p>
                    <p className="break-all text-sm text-piedra">{c.correo} · {ROL[c.rol]}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Pill tono={e.tono}>{e.texto}{hasta ? ` hasta ${hasta}` : ''}</Pill>
                      <Pill>{c.strikes ?? 0} {(c.strikes ?? 0) === 1 ? 'falta' : 'faltas'}</Pill>
                    </div>
                  </div>
                  {c.estado !== 'activo' && <Button variante="suave" onClick={() => reactivarCuenta(c.id)}>Reactivar cuenta</Button>}
                </Card>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="space-y-3" aria-label="Comentarios marcados">
        <h2 className="text-2xl">Comentarios marcados por el filtro</h2>
        <p className="text-base text-piedra">Mensajes y reseñas con lenguaje ofensivo. Revísalos y, si hace falta, sanciona desde Denuncias.</p>
        {marcados.length === 0 ? (
          <Card><p className="text-base text-piedra">No hay comentarios marcados.</p></Card>
        ) : (
          <ul className="space-y-3">
            {marcados.map((m) => {
              const autor = cuentaPorId(m.autorId)
              const sug = sugerirMedida(m.gravedad, autor?.strikes ?? 0)
              return (
                <li key={m.id}>
                  <Card className="space-y-2 !p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <PillGravedad nivel={m.gravedad} />
                      <Pill>{m.origen === 'chat' ? 'Chat' : 'Reseña'}</Pill>
                      {m.revisado && <Pill tono="olla">Revisado</Pill>}
                      <span className="ml-auto text-sm text-piedra">{cuando(m.creado)}</span>
                    </div>
                    <p className="text-base">“{m.texto}”</p>
                    <p className="text-sm text-piedra">De <b>{m.autorNombre}</b> para {m.objetivoNombre}. Copiloto sugiere: {ETIQUETA_MEDIDA[sug.medida]}.</p>
                    {!m.revisado && <Button variante="suave" onClick={() => revisarMarcado(m.id)}>Marcar como revisado</Button>}
                  </Card>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
