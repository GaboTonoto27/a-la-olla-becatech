import { useState } from 'react'
import { MapPin, Store } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { dinero } from '../../lib/dinero.js'
import { APROBACIONES, ESTADOS, PREGUNTAS, metodoDe, respuestasDe, sugerirPlan, tarifaDe } from '../../lib/planPuesto.js'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Pill from '../../components/ui/Pill.jsx'
import { campo } from '../../components/auth/FormPuesto.jsx'

const cuando = (t) => (t ? new Date(t).toLocaleString('es-CO', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '')
const ORDEN = { enviado: 0, ajuste: 1, prueba: 2, verificado: 3 }

function Fila({ p }) {
  const { cuentaPorId, resolverVerificacion, notificar } = useApp()
  const dueno = cuentaPorId(p.id)
  const v = p.verificacion
  const e = ESTADOS[v.estado] ?? ESTADOS.prueba
  const r = respuestasDe(p)
  const sugerido = p.sugerido ?? sugerirPlan(r)
  const [nota, setNota] = useState(v.nota ?? '')
  const [error, setError] = useState('')
  const [abierto, setAbierto] = useState(v.estado === 'enviado')

  const decidir = (id) => {
    const res = resolverVerificacion(p.id, id, nota)
    if (!res.ok) {
      setError(res.error)
      notificar(res.error, 'error')
    } else setError('')
  }

  return (
    <li>
      <Card className="space-y-3 !p-4" data-testid={`puesto-${p.id}`}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-lg font-bold"><Store size={20} className="shrink-0 text-olla" aria-hidden="true" /> {p.nombre}</p>
            <p className="break-all text-sm text-piedra">Dueño: {dueno?.nombre ?? '—'} · {dueno?.correo ?? ''} · Registro: <b>{metodoDe(dueno)}</b></p>
          </div>
          <Pill tono={e.tono}>{e.texto}</Pill>
        </div>
        <button type="button" onClick={() => setAbierto((a) => !a)} aria-expanded={abierto} className="min-h-[48px] text-base font-bold text-olla underline">
          {abierto ? 'Ocultar detalle' : 'Ver detalle y decidir'}
        </button>
        {abierto && (
          <div className="space-y-3">
            <p className="flex items-start gap-2 text-base">
              <MapPin size={20} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
              <span>{p.direccion}<span className="block text-sm text-piedra">{p.coord?.[0]?.toFixed(5)}, {p.coord?.[1]?.toFixed(5)} · {p.barrio}</span></span>
            </p>
            {p.fotos?.length > 0 ? (
              <ul className="grid grid-cols-3 gap-2">
                {p.fotos.map((f, i) => (
                  <li key={i}><img src={f} alt={`Foto ${i + 1} de ${p.nombre}`} className="h-24 w-full rounded-xl border border-borde object-cover" /></li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-piedra">Sin fotos subidas.</p>
            )}
            <ul className="divide-y divide-borde rounded-xl border border-borde bg-white px-3 text-base">
              {PREGUNTAS.map((q) => (
                <li key={q.id} className="py-2"><span className="text-sm text-piedra">{q.titulo}</span><br /><b>{q.opciones.find((o) => o.id === r[q.id])?.titulo}</b></li>
              ))}
              <li className="py-2"><span className="text-sm text-piedra">Punto muy concurrido o conocido</span><br /><b>{r.concurrido ? 'Sí' : 'No'}</b></li>
            </ul>
            <p className="text-base">Plan sugerido por la app: <b>{sugerido.etiqueta} · {sugerido.precio}</b>{typeof p.tarifa === 'number' && <> · Tarifa actual: <b>{dinero(tarifaDe(p))}/sem</b></>}</p>
            {v.enviadoEn && <p className="text-sm text-piedra">Enviado el {cuando(v.enviadoEn)}.</p>}

            <label className="block text-base font-bold" htmlFor={`nota-${p.id}`}>Nota para el vendedor <span className="font-medium text-piedra">(obligatoria si pides un ajuste)</span></label>
            <textarea id={`nota-${p.id}`} rows={2} maxLength={300} className={`${campo} py-2`} value={nota} onChange={(ev) => setNota(ev.target.value)} placeholder="Ej.: Sube una foto donde se vea la nevera." />
            {error && <p role="alert" className="font-bold text-[#A8391B]">{error}</p>}
            <div className="grid gap-2 sm:grid-cols-2">
              {APROBACIONES.map((a) => (
                <Button key={a.id} onClick={() => decidir(a.id)} variante={a.plan === 'formal' ? 'primario' : 'contorno'}>{a.etiqueta}</Button>
              ))}
            </div>
            <Button variante="suave" className="w-full" onClick={() => decidir('ajuste')}>Solicitar ajuste</Button>
          </div>
        )}
      </Card>
    </li>
  )
}

// Cola de verificación: el vendedor se autodeclara, el equipo confirma la tarifa justa.
export default function TabPuestos() {
  const { puestos } = useApp()
  const lista = puestos.filter((p) => p.tipo === 'puesto' && p.verificacion).sort((a, b) => (ORDEN[a.verificacion.estado] ?? 9) - (ORDEN[b.verificacion.estado] ?? 9))
  const pendientes = lista.filter((p) => p.verificacion.estado === 'enviado').length
  return (
    <section className="space-y-3" aria-label="Verificación de puestos y asignación de plan">
      <div>
        <h2 className="text-2xl">Verificación de puestos y asignación de plan</h2>
        <p className="text-base text-piedra">{pendientes} por revisar · {lista.length} en total. Revisa lo que declaró el vendedor y confirma la tarifa justa.</p>
      </div>
      {lista.length === 0 ? (
        <Card><p className="text-base text-piedra">Todavía no hay puestos nuevos. Cuando un vendedor cree o cambie su puesto, aparece aquí.</p></Card>
      ) : (
        <ul className="space-y-3">{lista.map((p) => <Fila key={`${p.id}-${p.verificacion.estado}`} p={p} />)}</ul>
      )}
    </section>
  )
}
