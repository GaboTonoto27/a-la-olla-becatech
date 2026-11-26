import { lazy, Suspense, useState } from 'react'
import { MapPin, Pencil } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { PERFILES_COMPRADOR } from '../../data/seed.js'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'
import { campo } from '../auth/FormPuesto.jsx'
import CampoBarrio from '../auth/CampoBarrio.jsx'

const SelectorUbicacion = lazy(() => import('../mapa/SelectorUbicacion.jsx'))

// Ubicación personal (pa' comprar): sale de aquí y NUNCA toca la ubicación del puesto.
function UbicacionPersonal({ rol }) {
  const { usuario, editarCuenta, notificar } = useApp()
  const [borrador, setBorrador] = useState(usuario.ubicacion ?? null)
  const titulo = rol === 'ambos' ? 'Mi ubicación actual (para comprar)' : 'Mi ubicación actual (para ver puestos cercanos)'
  return (
    <div className="space-y-2" data-testid="ubicacion-personal">
      <h3 className="flex items-center gap-2 text-lg font-bold"><MapPin size={20} className="text-olla" aria-hidden="true" /> {titulo}</h3>
      <p className="text-sm text-piedra">
        {usuario.ubicacion ? 'Guardada: con ella calculamos las distancias reales a los puestos.' : "Aún sin guardar. Márcala pa' ver qué tan lejos queda cada puesto."}
      </p>
      <Suspense fallback={<p className="flex h-56 items-center justify-center rounded-2xl border border-borde bg-white text-piedra">Cargando el mapa…</p>}>
        <SelectorUbicacion
          modo="persona"
          etiquetaPin="Tu ubicación"
          etiquetaGps="Usar mi ubicación"
          valor={borrador}
          onChange={setBorrador}
          onGps={(punto) => editarCuenta(usuario.id, { ubicacion: punto })}
          onConfirmar={(punto) => {
            editarCuenta(usuario.id, { ubicacion: punto })
            notificar('Ubicación actualizada. Las distancias ya son las tuyas')
          }}
        />
      </Suspense>
    </div>
  )
}

// Datos propios de la cuenta: igual para demos, Google, Facebook y correo.
// Solo Vendedor no ve la ubicación de compras: su mapa vive en "Mi puesto".
export default function MisDatos() {
  const { usuario, editarCuenta, notificar } = useApp()
  const compra = usuario.rol !== 'vendedor'
  const [abierto, setAbierto] = useState(false)
  const [f, setF] = useState({ nombre: usuario.nombre, barrio: usuario.barrio, perfilComprador: usuario.perfilComprador ?? 'hogar' })

  const guardar = (e) => {
    e.preventDefault()
    if (f.nombre.trim().length < 2) return notificar('Escribe tu nombre.', 'error')
    editarCuenta(usuario.id, {
      nombre: f.nombre.trim(),
      barrio: f.barrio.trim() || usuario.barrio,
      ...(compra ? { perfilComprador: f.perfilComprador } : {}),
    })
    setAbierto(false)
    notificar('Perfil actualizado')
  }

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl">Mis datos</h2>
        {!abierto && (
          <Button variante="contorno" icono={Pencil} onClick={() => { setF({ nombre: usuario.nombre, barrio: usuario.barrio, perfilComprador: usuario.perfilComprador ?? 'hogar' }); setAbierto(true) }}>
            Editar mis datos
          </Button>
        )}
      </div>

      {abierto && (
        <form className="space-y-4" onSubmit={guardar}>
          <label className="block text-base font-semibold">
            Tu nombre
            <input value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} autoComplete="name" className={`mt-1 ${campo}`} />
          </label>
          <CampoBarrio id="datos-barrio" valor={f.barrio} onChange={(barrio) => setF({ ...f, barrio })} />
          {compra && (
            <div>
              <p className="mb-2 text-base font-bold">¿Pa' qué compras?</p>
              <div className="flex flex-wrap gap-2">
                {PERFILES_COMPRADOR.map((p) => (
                  <Chip key={p.id} activo={f.perfilComprador === p.id} onClick={() => setF({ ...f, perfilComprador: p.id })}>{p.etiqueta}</Chip>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variante="suave" onClick={() => setAbierto(false)}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      )}

      {compra && <UbicacionPersonal rol={usuario.rol} />}
    </Card>
  )
}
