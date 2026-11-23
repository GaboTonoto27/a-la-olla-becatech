import { useState } from 'react'
import { CheckCircle2, Pencil, Store } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import FormPuesto from '../auth/FormPuesto.jsx'

const EFECTIVO = 'Efectivo contra inspección (primero revisas, luego pagas)'

// El puesto se puede cambiar cuando quieras: nombre, tipo, ubicación, pagos, plan y modo sin celular.
export default function MiPuestoEditor({ puesto }) {
  const { editarPuesto, cambiarEstandar, sinCelular, cambiarSinCelular, usuario } = useApp()
  const inicial = () => ({
    nombre: puesto.nombre,
    formal: Boolean(puesto.formal),
    coord: puesto.coord,
    zona: puesto.privacidad === 'zona',
    nequi: puesto.pagos.some((p) => p.includes('Nequi')),
    sinCelular: sinCelular(usuario.id),
    plan: puesto.plan,
  })
  const [abierto, setAbierto] = useState(false)
  const [f, setF] = useState(inicial)
  const [guardado, setGuardado] = useState(false)

  const guardar = () => {
    editarPuesto(puesto.id, {
      nombre: f.nombre.trim(),
      formal: f.formal,
      plan: f.plan,
      coord: f.coord,
      privacidad: f.zona ? 'zona' : 'exacto',
      pagos: f.nequi && f.formal ? [EFECTIVO, 'Nequi (opcional)'] : [EFECTIVO],
    })
    cambiarEstandar(puesto.id, 'frio', f.formal)
    cambiarEstandar(puesto.id, 'nequi', f.nequi && f.formal)
    cambiarSinCelular(usuario.id, f.sinCelular)
    setGuardado(true)
    setAbierto(false)
  }

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-2xl"><Store size={24} className="text-olla" aria-hidden="true" /> Mi puesto</h2>
          <p className="text-base text-piedra">{puesto.nombre} · {puesto.formal ? 'Formal, con nevera' : 'Informal, al ambiente'}</p>
        </div>
        {!abierto && (
          <Button variante="contorno" icono={Pencil} onClick={() => { setF(inicial()); setGuardado(false); setAbierto(true) }}>
            Editar mi puesto
          </Button>
        )}
      </div>
      {guardado && !abierto && (
        <p className="flex items-center gap-2 text-base font-bold text-olla" role="status">
          <CheckCircle2 size={20} aria-hidden="true" /> Cambios guardados. Los compradores ya los ven.
        </p>
      )}
      {abierto && (
        <>
          <FormPuesto valor={f} onChange={setF} />
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
