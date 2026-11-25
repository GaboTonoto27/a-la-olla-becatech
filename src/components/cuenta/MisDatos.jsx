import { lazy, Suspense, useState } from 'react'
import { Crosshair, Loader2, MapPin, Pencil } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { PERFILES_COMPRADOR } from '../../data/seed.js'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'
import { campo } from '../auth/FormPuesto.jsx'

const SelectorUbicacion = lazy(() => import('../mapa/SelectorUbicacion.jsx'))

// Datos propios de la cuenta: igual para demos, Google, Facebook y correo. Sirve a Comprador, Vendedor y Ambos.
export default function MisDatos() {
  const { usuario, editarCuenta, notificar } = useApp()
  const compra = usuario.rol !== 'vendedor'
  const [abierto, setAbierto] = useState(false)
  const [f, setF] = useState({ nombre: usuario.nombre, barrio: usuario.barrio, perfilComprador: usuario.perfilComprador ?? 'hogar' })
  const [gps, setGps] = useState('idle')
  const [manual, setManual] = useState(false)
  const [borrador, setBorrador] = useState(usuario.ubicacion ?? null)

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

  const ponerUbicacion = (punto) => {
    editarCuenta(usuario.id, { ubicacion: punto })
    notificar('Ubicación actualizada. Las distancias ya son las tuyas')
  }

  const usarGps = () => {
    if (!('geolocation' in navigator)) return setGps('error')
    setGps('cargando')
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const punto = [p.coords.latitude, p.coords.longitude]
        setBorrador(punto)
        ponerUbicacion(punto)
        setGps('ok')
      },
      (e) => setGps(e.code === 1 ? 'denegado' : 'error'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
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
          <label className="block text-base font-semibold">
            Tu barrio
            <input value={f.barrio} onChange={(e) => setF({ ...f, barrio: e.target.value })} autoComplete="off" className={`mt-1 ${campo}`} />
          </label>
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

      <div className="space-y-2">
        <p className="flex items-center gap-2 text-base font-bold"><MapPin size={20} className="text-olla" aria-hidden="true" /> Mi ubicación actual</p>
        <p className="text-sm text-piedra">
          {usuario.ubicacion ? 'Guardada. Con ella calculamos las distancias reales a los puestos.' : "Sin guardar. Úsala pa' ver qué tan lejos queda cada puesto."}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button variante="contorno" icono={gps === 'cargando' ? Loader2 : Crosshair} onClick={usarGps} disabled={gps === 'cargando'}>
            {gps === 'cargando' ? 'Buscando…' : 'Usar mi GPS'}
          </Button>
          <Button variante="suave" icono={MapPin} onClick={() => setManual((v) => !v)}>
            {manual ? 'Cerrar el mapa' : 'Marcar en el mapa'}
          </Button>
        </div>
        {(gps === 'denegado' || gps === 'error') && (
          <p className="text-sm font-semibold text-[#A8391B]" role="status">
            {gps === 'denegado' ? 'No diste permiso al GPS.' : 'No pudimos ubicarte.'} Márcalo a mano en el mapa.
          </p>
        )}
        {manual && (
          <Suspense fallback={<p className="flex h-56 items-center justify-center rounded-2xl border border-borde bg-white text-piedra">Cargando el mapa…</p>}>
            <SelectorUbicacion puesto zona={false} pregunta="¿Estás aquí? Toca el mapa o arrastra el pin" etiqueta="Tu ubicación" id={usuario.id} valor={borrador} onChange={setBorrador} onConfirmar={ponerUbicacion} />
          </Suspense>
        )}
      </div>
    </Card>
  )
}
