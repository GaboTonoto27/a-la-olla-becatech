import { useState } from 'react'
import { Gavel, Mail, Save, Send, Sparkles } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { ETIQUETA_MEDIDA, sugerirMedida } from '../../lib/copiloto.js'
import { scoreRiesgo } from '../../lib/analitica.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Pill from '../../components/ui/Pill.jsx'
import PillGravedad from './PillGravedad.jsx'

const ORDEN = { alta: 0, media: 1, baja: 2 }
const TIPO = { sitio: 'Denuncia de sitio', chat: 'Denuncia de chat', rechazo: 'Rechazo por calidad', engano: 'Engaño' }
const MEDIDAS = ['desestimar', 'advertencia', 'suspender', 'expulsar']
const campo = 'w-full rounded-xl border border-borde bg-white p-3 text-base'

const cuando = (t) => new Date(t).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

function ConfigCorreo() {
  const { adminCorreo, guardarAdminCorreo, probarAlerta } = useApp()
  const [correo, setCorreo] = useState(adminCorreo)
  const [error, setError] = useState('')
  const guardado = adminCorreo !== '' && correo.trim() === adminCorreo

  const guardar = (e) => {
    e.preventDefault()
    setError(guardarAdminCorreo(correo) ? '' : 'Escribe un correo válido, por ejemplo nombre@correo.com.')
  }

  return (
    <Card className="space-y-2">
      <form onSubmit={guardar} className="space-y-2" noValidate>
        <label htmlFor="admin-correo" className="block text-lg font-bold">Tu correo pa' recibir alertas</label>
        <input
          id="admin-correo"
          type="email"
          value={correo}
          onChange={(e) => { setCorreo(e.target.value); setError('') }}
          placeholder="tucorreo@ejemplo.com"
          aria-invalid={Boolean(error)}
          className="min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base"
        />
        {error && <p role="alert" className="text-sm font-bold text-[#A8391B]">{error}</p>}
        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="submit" icono={Save}>Guardar correo</Button>
          <Button type="button" variante="contorno" icono={Send} disabled={!guardado} onClick={probarAlerta}>Probar alerta</Button>
        </div>
      </form>
      <p className="text-sm text-piedra">
        {guardado ? `Guardado: ${adminCorreo}. ` : 'Guarda tu correo pa' + "' poder probar la alerta. "}
        Se queda solo en este navegador. No usamos servidores de correo: cada alerta tiene un botón que abre tu app de correo con el mensaje listo.
      </p>
    </Card>
  )
}

function Bandeja() {
  const { alertasCorreo, adminCorreo } = useApp()
  return (
    <section className="space-y-3" aria-label="Bandeja de Alertas por Correo">
      <h2 className="flex items-center gap-2 text-2xl"><Mail size={24} className="text-olla" aria-hidden="true" /> Bandeja de Alertas por Correo</h2>
      {alertasCorreo.length === 0 ? (
        <p className="text-base text-piedra">Aún no hay alertas. Cada denuncia, rechazo por calidad o comentario marcado queda registrado aquí.</p>
      ) : (
        <ul className="space-y-3">
          {alertasCorreo.slice(0, 20).map((a) => {
            const cuerpo = `Perfil infractor: ${a.infractor}\nGravedad (Copiloto): ${a.gravedad}\n\nEvidencia:\n${a.evidencia}`
            const href = `mailto:${adminCorreo}?subject=${encodeURIComponent(a.asunto)}&body=${encodeURIComponent(cuerpo)}`
            return (
              <li key={a.id}>
                <Card className="space-y-2 !p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex flex-wrap items-center gap-2"><PillGravedad nivel={a.gravedad} />{a.prueba && <Pill>Prueba</Pill>}</span>
                    <span className="text-sm text-piedra">{cuando(a.creado)}</span>
                  </div>
                  <p className="text-sm text-piedra">Para: {a.para || adminCorreo || 'sin correo configurado'}</p>
                  <p className="text-base font-bold">{a.asunto}</p>
                  <p className="text-base">Perfil infractor: <b>{a.infractor}</b></p>
                  <p className="text-base text-piedra">“{a.evidencia}”</p>
                  {adminCorreo ? (
                    <a href={href} className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-olla bg-white px-5 text-base font-bold text-olla hover:bg-marfil">
                      <Mail size={20} aria-hidden="true" /> Enviar copia a mi correo
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-ambar">Escribe tu correo arriba pa' poder enviarte la copia.</p>
                  )}
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

const TONO_RIESGO = { alto: 'tomate', medio: 'ambar', bajo: 'olla' }
const COLOR_RIESGO = { alto: 'bg-tomate', medio: 'bg-ambar', bajo: 'bg-olla' }

function Riesgo({ r }) {
  return (
    <div className="space-y-2 border-t border-[#B5D9E3] pt-2">
      <p className="flex flex-wrap items-center gap-2 text-base font-bold">
        Puntaje de riesgo: {r.total} de 100
        <Pill tono={TONO_RIESGO[r.nivel]}>Riesgo {r.nivel}</Pill>
      </p>
      <div className="h-3 overflow-hidden rounded-full bg-white" role="presentation">
        <div className={`h-full rounded-full ${COLOR_RIESGO[r.nivel]}`} style={{ width: `${r.total}%` }} />
      </div>
      <ul className="space-y-1 text-sm">
        {r.partes.map((p) => (
          <li key={p.id} className="flex justify-between gap-3">
            <span>{p.etiqueta} <span className="text-piedra">({p.nota})</span></span>
            <b>{p.valor} / {p.max}</b>
          </li>
        ))}
      </ul>
      <p className="text-xs text-piedra">Modelo heurístico local, sin costo ni envío de datos. Está listo pa' cambiarse por aprendizaje automático cuando haya historial real.</p>
    </div>
  )
}

function Denuncia({ d }) {
  const { cuentaPorId, guardarNotas, aplicarMedida, apartados } = useApp()
  const [notas, setNotas] = useState({ notaComprador: d.notaComprador, notaVendedor: d.notaVendedor })
  const [guardado, setGuardado] = useState(false)
  const objetivo = cuentaPorId(d.objetivoId)
  const strikes = objetivo?.strikes ?? 0
  const sug = sugerirMedida(d.gravedad, strikes)
  const rechazos = apartados.filter((a) => a.vendedorId === d.objetivoId && a.estado === 'rechazado').length
  const riesgo = scoreRiesgo({ gravedad: d.gravedad, motivos: d.motivos, strikes, rechazos })
  const resuelta = d.estado === 'resuelta'

  return (
    <Card className={`space-y-3 ${resuelta ? 'opacity-80' : ''}`}>
      <div className="flex flex-wrap items-center gap-2">
        <PillGravedad nivel={d.gravedad} />
        <Pill>{TIPO[d.tipo] ?? d.tipo}</Pill>
        {!d.leida && <Pill tono="tomate">Nueva</Pill>}
        <span className="ml-auto text-sm text-piedra">{cuando(d.creado)}</span>
      </div>
      <div>
        <h3 className="text-xl">{d.asunto}</h3>
        <p className="text-sm text-piedra">De {d.autorNombre} sobre <b>{d.objetivoNombre}</b>{d.ref ? ` · ${d.ref}` : ''}</p>
      </div>
      <p className="text-base">{d.detalle}</p>
      {d.motivos.length > 0 && <p className="text-sm text-piedra">Palabras que detectó el Copiloto: {d.motivos.join(', ')}.</p>}

      <p className="text-base">
        Perfil denunciado: <b>{objetivo ? objetivo.negocio : d.objetivoNombre}</b>{' '}
        {objetivo ? <Pill tono={objetivo.estado === 'activo' ? 'olla' : 'ambar'}>{objetivo.estado} · {strikes} {strikes === 1 ? 'falta' : 'faltas'}</Pill> : <span className="text-sm text-piedra">(puesto de muestra, sin cuenta)</span>}
      </p>

      {resuelta ? (
        <p className="rounded-xl border border-[#BCD8C5] bg-[#E7F1EA] p-3 text-base font-bold text-olla">
          Resuelta: {ETIQUETA_MEDIDA[d.resolucion]}.
        </p>
      ) : (
        <>
          <div className="space-y-2 rounded-xl border border-[#B5D9E3] bg-[#E2F1F5] p-3">
            <p className="flex items-center gap-2 text-base font-bold text-frio"><Sparkles size={18} aria-hidden="true" /> Copiloto de moderación</p>
            <p className="text-base">Sugiere: <b>{ETIQUETA_MEDIDA[sug.medida]}</b>. {sug.razon}</p>
            <p className="text-sm text-piedra">Es solo una sugerencia. La decisión es tuya.</p>
            <Riesgo r={riesgo} />
          </div>

          <div className="space-y-2">
            <p className="text-base font-bold">Escuchar ambas partes</p>
            <label className="block text-sm font-semibold text-piedra">
              Versión del comprador
              <textarea rows={2} value={notas.notaComprador} onChange={(e) => { setNotas({ ...notas, notaComprador: e.target.value }); setGuardado(false) }} className={`mt-1 ${campo}`} />
            </label>
            <label className="block text-sm font-semibold text-piedra">
              Versión del vendedor
              <textarea rows={2} value={notas.notaVendedor} onChange={(e) => { setNotas({ ...notas, notaVendedor: e.target.value }); setGuardado(false) }} className={`mt-1 ${campo}`} />
            </label>
            <Button variante="suave" onClick={() => { guardarNotas(d.id, notas); setGuardado(true) }}>{guardado ? 'Notas guardadas' : 'Guardar notas'}</Button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {MEDIDAS.map((m) => (
              <Button
                key={m}
                variante={m === sug.medida ? 'primario' : m === 'expulsar' ? 'acento' : 'contorno'}
                icono={m === 'desestimar' ? undefined : Gavel}
                onClick={() => aplicarMedida(d.id, m)}
              >
                {ETIQUETA_MEDIDA[m]}
              </Button>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}

export default function TabDenuncias() {
  const { denuncias } = useApp()
  const lista = [...denuncias].sort(
    (a, b) => (a.estado === 'resuelta') - (b.estado === 'resuelta') || ORDEN[a.gravedad] - ORDEN[b.gravedad] || b.creado - a.creado,
  )
  return (
    <div className="space-y-5">
      <ConfigCorreo />
      <section className="space-y-3" aria-label="Denuncias">
        <h2 className="text-2xl">Denuncias y rechazos por calidad</h2>
        <p className="text-base text-piedra">Ordenadas por gravedad según el Copiloto. Escucha a las dos partes y decide.</p>
        {lista.length === 0 ? (
          <Card><p className="text-base text-piedra">No hay denuncias. Cuando alguien denuncie un sitio o un chat, o rechace un lote por calidad, aparece aquí al instante.</p></Card>
        ) : (
          lista.map((d) => <Denuncia key={d.id} d={d} />)
        )}
      </section>
      <Bandeja />
    </div>
  )
}
