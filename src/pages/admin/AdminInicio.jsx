import { useState } from 'react'
import { Bell, BellRing, LogOut, ShieldCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import TabResumen from './TabResumen.jsx'
import TabDenuncias from './TabDenuncias.jsx'
import TabReembolsos from './TabReembolsos.jsx'
import TabUsuarios from './TabUsuarios.jsx'
import TabTickets from './TabTickets.jsx'
import TabExpansion from './TabExpansion.jsx'
import TabAnalitica from './TabAnalitica.jsx'
import TabPuestos from './TabPuestos.jsx'
import RestaurarDemo from '../../components/auth/RestaurarDemo.jsx'


const TABS = [
  { id: 'resumen', etiqueta: 'Resumen y Sostenibilidad' },
  { id: 'denuncias', etiqueta: 'Denuncias y Calidad' },
  { id: 'analitica', etiqueta: 'Analítica y Data Science' },
  { id: 'reembolsos', etiqueta: 'Reembolsos y Devoluciones' },
  { id: 'puestos', etiqueta: 'Verificación de puestos' },
  { id: 'usuarios', etiqueta: 'Usuarios y Moderación' },
  { id: 'tickets', etiqueta: 'Tickets de soporte' },
  { id: 'expansion', etiqueta: 'Expansión y Plazas' },
]

function Campana({ irA }) {
  const { denuncias, tickets, marcados, devoluciones, puestos, apelaciones, sinLeerAdmin, marcarTodoLeido } = useApp()
  const [abierta, setAbierta] = useState(false)
  const items = [
    ...denuncias.filter((d) => !d.leida).map((d) => ({ id: d.id, tab: 'denuncias', texto: d.asunto, tipo: 'Denuncia', t: d.creado })),
    ...tickets.filter((t) => !t.leida).map((t) => ({ id: t.id, tab: 'tickets', texto: t.asunto, tipo: 'Ticket', t: t.creado })),
    ...devoluciones.filter((d) => !d.leida).map((d) => ({ id: d.id, tab: 'reembolsos', texto: `${d.producto} · ${d.autorNombre}`, tipo: 'Devolución', t: d.creado })),
    ...puestos.filter((p) => p.tipo === 'puesto' && p.verificacion?.estado === 'enviado' && !p.verificacion.leida).map((p) => ({ id: `v-${p.id}`, tab: 'puestos', texto: p.nombre, tipo: 'Puesto por verificar', t: p.verificacion.enviadoEn ?? 0 })),
    ...apelaciones.filter((x) => x.estado === 'abierta' && !x.leida).map((x) => ({ id: x.id, tab: 'puestos', texto: `${x.folio} · ${x.puestoNombre}`, tipo: 'Ticket de apelación', t: x.creado })),
    ...marcados.filter((m) => !m.leida).map((m) => ({ id: m.id, tab: 'usuarios', texto: m.texto, tipo: 'Comentario marcado', t: m.creado })),
  ].sort((a, b) => b.t - a.t)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        aria-expanded={abierta}
        aria-label={`Alertas: ${sinLeerAdmin} sin leer`}
        className="relative flex h-12 w-12 items-center justify-center rounded-full border border-borde bg-white text-olla"
      >
        {sinLeerAdmin > 0 ? <BellRing size={24} aria-hidden="true" /> : <Bell size={24} aria-hidden="true" />}
        {sinLeerAdmin > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-tomate px-1 text-xs font-bold text-white">{sinLeerAdmin}</span>
        )}
      </button>
      {abierta && (
        <div className="absolute right-0 z-30 mt-2 w-[min(92vw,22rem)] space-y-2 rounded-2xl border border-borde bg-white p-3 shadow-[0_4px_12px_rgba(28,31,29,0.12)]">
          {items.length === 0 ? (
            <p className="p-2 text-base text-piedra">Todo al día. No hay alertas nuevas.</p>
          ) : (
            <>
              <ul className="max-h-72 divide-y divide-borde overflow-y-auto">
                {items.slice(0, 8).map((i) => (
                  <li key={i.id}>
                    <button type="button" onClick={() => { irA(i.tab); setAbierta(false) }} className="w-full py-2 text-left">
                      <span className="text-sm font-bold text-tomate">{i.tipo}</span>
                      <span className="block truncate text-base">{i.texto}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <Button variante="suave" className="w-full" onClick={marcarTodoLeido}>Marcar todo como leído</Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function BotonPush() {
  const { pushAdmin, activarPush } = useApp()
  const [msg, setMsg] = useState('')
  const pedir = async () => {
    const r = await activarPush()
    setMsg(r === 'granted' ? '' : r === 'no-disponible' ? 'Este navegador no permite avisos.' : 'El navegador bloqueó los avisos. Actívalos en los permisos del sitio.')
  }
  return (
    <div className="flex flex-col items-start gap-1">
      <Button variante={pushAdmin ? 'suave' : 'contorno'} icono={BellRing} onClick={pedir} disabled={pushAdmin}>
        {pushAdmin ? 'Avisos del navegador activados' : 'Activar avisos del navegador'}
      </Button>
      {msg && <p className="text-sm font-semibold text-ambar" role="status">{msg}</p>}
    </div>
  )
}

export default function AdminInicio() {
  const { salir } = useApp()
  const [tab, setTab] = useState('resumen')

  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <div className="flex items-start gap-3">
          <ShieldCheck size={28} className="mt-1 shrink-0 text-olla" aria-hidden="true" />
          <div className="flex-1">
            <h1 className="text-3xl">Panel de coordinación</h1>
            <p className="mt-1 text-base text-piedra">Denuncias, usuarios, soporte y cifras de la plaza. Solo para la coordinación.</p>
          </div>
          <Campana irA={setTab} />
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <BotonPush />
          <Button variante="suave" icono={LogOut} onClick={salir}>Salir</Button>
          <RestaurarDemo />
        </div>
      </Card>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Secciones del panel">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-[48px] shrink-0 rounded-full border px-4 text-base font-bold ${
              tab === t.id ? 'border-olla bg-olla text-white' : 'border-borde bg-white text-carbon hover:border-olla'
            }`}
          >
            {t.etiqueta}
          </button>
        ))}
      </div>

      {tab === 'resumen' && <TabResumen />}
      {tab === 'denuncias' && <TabDenuncias />}
      {tab === 'analitica' && <TabAnalitica />}
      {tab === 'reembolsos' && <TabReembolsos />}
      {tab === 'puestos' && <TabPuestos />}
      {tab === 'usuarios' && <TabUsuarios />}
      {tab === 'tickets' && <TabTickets />}
      {tab === 'expansion' && <TabExpansion />}
    </div>
  )
}
