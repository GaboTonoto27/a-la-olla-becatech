import { useState } from 'react'
import { Globe2, LogOut, RotateCcw } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Pill from '../components/ui/Pill.jsx'
import PanelEconomico from '../components/cuenta/PanelEconomico.jsx'
import MisDatos from '../components/cuenta/MisDatos.jsx'
import MiPuestoEditor from '../components/cuenta/MiPuestoEditor.jsx'
import LlevarCiudadModal from '../components/cuenta/LlevarCiudadModal.jsx'
import { GarantiaCuota, MisCompras } from '../components/cuenta/MisDevoluciones.jsx'
import { ESTADOS } from '../lib/planPuesto.js'
import { PERFILES_COMPRADOR } from '../data/seed.js'

const ROL = { ambos: 'Compra y vende', vendedor: 'Vendedor', comprador: 'Comprador' }

export default function Cuenta() {
  const { usuario, salir, reiniciarDemo, miPuesto, modo, sinCelular } = useApp()
  const [ciudadAbierta, setCiudadAbierta] = useState(false)
  const perfil = PERFILES_COMPRADOR.find((p) => p.id === usuario.perfilComprador)
  const vende = usuario.rol !== 'comprador' && modo === 'vendedor'
  // Sin negocio propio el nombre quedaba repetido ("Gabriel · Juguería / Fritos"): se muestra solo el tipo.
  const prefijo = `${usuario.nombre} · `
  const subtitulo = usuario.negocio?.startsWith(prefijo) ? usuario.negocio.slice(prefijo.length) : usuario.negocio

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-3xl">Mi cuenta</h1>
      <Card>
        <p className="text-2xl font-bold">{usuario.nombre}</p>
        <p className="text-base text-piedra">{subtitulo}</p>
        <p className="mb-3 break-all text-sm text-piedra">{usuario.correo} · {usuario.barrio}</p>
        <div className="flex flex-wrap gap-2">
          <Pill tono="olla">{ROL[usuario.rol]}</Pill>
          {perfil && usuario.rol !== 'vendedor' && <Pill>{perfil.etiqueta}</Pill>}
          {miPuesto && usuario.rol !== 'comprador' && (
            <Pill tono={(ESTADOS[miPuesto.verificacion?.estado] ?? ESTADOS.verificado).tono}>{(ESTADOS[miPuesto.verificacion?.estado] ?? ESTADOS.verificado).texto}</Pill>
          )}
          {sinCelular(usuario.id) && <Pill tono="ambar">Contesta desde la casa</Pill>}
        </div>
      </Card>

      <MisDatos key={`${usuario.id}-${usuario.nombre}`} />
      {miPuesto && vende && <MiPuestoEditor key={`${miPuesto.id}-${miPuesto.nombre}`} puesto={miPuesto} />}
      <PanelEconomico key={vende ? 'v' : 'c'} />
      {vende ? <GarantiaCuota /> : <MisCompras />}

      <Card className="space-y-3">
        <div className="flex items-start gap-3">
          <Globe2 size={24} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" />
          <div>
            <p className="text-lg font-bold">¿Quieres llevar A la Olla a tu ciudad?</p>
            <p className="text-base text-piedra">Cada plaza funciona sola, con su coordinador y su moneda.</p>
          </div>
        </div>
        <Button variante="contorno" className="w-full" onClick={() => setCiudadAbierta(true)}>Cuéntame cómo</Button>
      </Card>

      <Button variante="contorno" icono={LogOut} className="w-full" onClick={salir}>
        Salir
      </Button>
      <Button variante="suave" icono={RotateCcw} className="w-full" onClick={reiniciarDemo}>
        Borrar datos de prueba
      </Button>
      {ciudadAbierta && <LlevarCiudadModal onCerrar={() => setCiudadAbierta(false)} />}
    </div>
  )
}
