import { useState } from 'react'
import { CheckCircle2, MessageSquareWarning, Pencil, Send, Store } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { dinero } from '../../lib/dinero.js'
import { ESTADOS, respuestasDe, sugerirPlan, tarifaDe } from '../../lib/planPuesto.js'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import Pill from '../ui/Pill.jsx'
import FormPuesto from '../auth/FormPuesto.jsx'

const EFECTIVO = 'Efectivo contra inspección (primero revisas, luego pagas)'

// Lo que el equipo revisa: si esto cambia, el puesto vuelve a "en prueba".
const firma = (p) => JSON.stringify([p.nombre, p.direccion, p.coord, p.respuestas, p.fotos])

// Estado del puesto frente a la verificación: insignia, nota del equipo, cuota y botón de envío.
function EstadoVerificacion({ puesto }) {
  const { enviarVerificacion } = useApp()
  const v = puesto.verificacion ?? { estado: 'verificado' }
  const e = ESTADOS[v.estado] ?? ESTADOS.verificado
  const sugerido = sugerirPlan(respuestasDe(puesto))
  const definitiva = v.estado === 'verificado' && typeof puesto.tarifa === 'number'
  return (
    <div className="space-y-3 rounded-2xl border border-borde bg-marfil p-4" data-testid="estado-verificacion">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tono={e.tono} icono={v.estado === 'verificado' ? CheckCircle2 : undefined}>{e.texto}</Pill>
      </div>
      <p className="text-base">
        {definitiva ? (
          <>Tu cuota confirmada: <b>{dinero(tarifaDe(puesto))} por semana</b> ({puesto.plan === 'formal' ? 'Plan Formal' : 'Plan Popular'}).</>
        ) : (
          <>Plan sugerido: <b>{sugerido.etiqueta} · {sugerido.precio}</b>. El equipo confirma la tarifa final.</>
        )}
      </p>
      {v.nota && (
        <p className="flex items-start gap-2 rounded-xl border border-[#EBCFA6] bg-[#FBEFDD] p-3 text-base" data-testid="nota-admin">
          <MessageSquareWarning size={20} className="mt-0.5 shrink-0 text-ambar" aria-hidden="true" />
          <span><b>Nota del equipo:</b> {v.nota}</span>
        </p>
      )}
      {v.estado === 'enviado' && <p className="text-base text-piedra">Ya mandaste tu puesto. Mientras tanto puedes seguir vendiendo.</p>}
      {(v.estado === 'prueba' || v.estado === 'ajuste') && (
        <>
          <p className="text-base text-piedra">Tu puesto está activo en prueba. Mándalo a verificación pa' confirmar tu tarifa.</p>
          <Button icono={Send} className="w-full" onClick={() => enviarVerificacion(puesto.id)}>Enviar a verificación</Button>
        </>
      )}
    </div>
  )
}

// El puesto se puede cambiar cuando quieras: nombre, tipo, ubicación, pagos y modo sin celular.
export default function MiPuestoEditor({ puesto }) {
  const { editarPuesto, cambiarEstandar, sinCelular, cambiarSinCelular, usuario, notificar } = useApp()
  const inicial = () => ({
    nombre: puesto.nombre,
    formal: Boolean(puesto.formal),
    respuestas: respuestasDe(puesto),
    coord: puesto.coord,
    zona: puesto.privacidad === 'zona',
    nequi: puesto.pagos.some((p) => p.includes('Nequi')),
    sinCelular: sinCelular(usuario.id),
    plan: puesto.plan,
    direccion: puesto.direccion === 'Ubicación marcada en el mapa' ? '' : puesto.direccion ?? '',
    horario: puesto.horario ?? '',
    descripcion: puesto.descripcion ?? '',
    fotos: puesto.fotos ?? [],
  })
  const [abierto, setAbierto] = useState(false)
  const [f, setF] = useState(inicial)
  const [guardado, setGuardado] = useState(false)

  // Un puesto verificado o en revisión que cambia datos clave vuelve a "pendiente (en prueba)".
  const volverAPrueba = (cambios) => {
    const v = puesto.verificacion
    return !v || v.estado === 'verificado' || v.estado === 'enviado' ? { ...cambios, verificacion: { ...(v ?? {}), estado: 'prueba', leida: false } } : cambios
  }

  // Las fotos y la ubicación confirmada se guardan al instante, sin esperar a "Guardar cambios".
  const cambiarFotos = (fotos) => {
    setF((v) => ({ ...v, fotos }))
    editarPuesto(puesto.id, volverAPrueba({ fotos }))
  }
  const confirmarUbicacion = (coord) => editarPuesto(puesto.id, volverAPrueba({ coord, privacidad: f.zona ? 'zona' : 'exacto' }))

  const guardar = () => {
    const sugerido = sugerirPlan(f.respuestas)
    const cambios = {
      nombre: f.nombre.trim(),
      formal: f.formal,
      respuestas: f.respuestas,
      sugerido,
      coord: f.coord,
      direccion: f.direccion.trim() || 'Ubicación marcada en el mapa',
      horario: f.horario.trim() || puesto.horario,
      descripcion: f.descripcion.trim(),
      fotos: f.fotos,
      privacidad: f.zona ? 'zona' : 'exacto',
      pagos: f.nequi && f.formal ? [EFECTIVO, 'Nequi (opcional)'] : [EFECTIVO],
    }
    // La tarifa definitiva solo la cambia el equipo; mientras no esté verificado, el plan sigue a la sugerencia.
    const verificado = puesto.verificacion?.estado === 'verificado' && typeof puesto.tarifa === 'number'
    if (!verificado) cambios.plan = sugerido.plan
    editarPuesto(puesto.id, firma({ ...puesto, ...cambios }) !== firma(puesto) ? volverAPrueba(cambios) : cambios)
    cambiarEstandar(puesto.id, 'frio', f.formal)
    cambiarEstandar(puesto.id, 'nequi', f.nequi && f.formal)
    cambiarSinCelular(usuario.id, f.sinCelular)
    setGuardado(true)
    setAbierto(false)
    notificar('Perfil del puesto actualizado')
  }

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-2xl"><Store size={24} className="text-olla" aria-hidden="true" /> Mi puesto</h2>
          <p className="text-base text-piedra">{puesto.nombre} · {puesto.formal ? 'Con refrigeración' : 'Al ambiente'}</p>
        </div>
        {!abierto && (
          <Button variante="contorno" icono={Pencil} onClick={() => { setF(inicial()); setGuardado(false); setAbierto(true) }}>
            Editar mi puesto
          </Button>
        )}
      </div>
      <EstadoVerificacion puesto={puesto} />
      {guardado && !abierto && (
        <p className="flex items-center gap-2 text-base font-bold text-olla" role="status">
          <CheckCircle2 size={20} aria-hidden="true" /> Cambios guardados. Los compradores ya los ven.
        </p>
      )}
      {abierto && (
        <>
          <FormPuesto valor={f} onChange={setF} puestoId={puesto.id} onFotos={cambiarFotos} onConfirmarUbicacion={confirmarUbicacion} ubicacionActual={usuario.ubicacion ?? null} />
          <div className="grid grid-cols-2 gap-2">
            <Button variante="suave" onClick={() => setAbierto(false)}>Cancelar</Button>
            <Button onClick={guardar} disabled={f.nombre.trim().length < 2 || !f.coord}>Guardar cambios</Button>
          </div>
        </>
      )}
      <Button to={`/puesto/${puesto.id}`} variante="suave" className="w-full">Ver cómo me ven y cambiar mis sellos</Button>
    </Card>
  )
}
