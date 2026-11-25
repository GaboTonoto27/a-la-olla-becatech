import { useState } from 'react'
import { Info, ShieldCheck } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { correoValido } from '../../lib/verificacion.js'
import { normalizarCorreo } from '../../lib/social.js'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'
import { campo } from './FormPuesto.jsx'

const ROLES = [
  { id: 'comprador', etiqueta: 'Solo compro' },
  { id: 'vendedor', etiqueta: 'Solo vendo' },
  { id: 'ambos', etiqueta: 'Compro y vendo' },
]

export const CODIGO_PRUEBA = '123456'
const DATOS_PRUEBA = {
  google: { nombre: 'Laura Prueba', correo: 'laura.prueba@gmail.com' },
  facebook: { nombre: 'Carlos Prueba', correo: 'carlos.prueba@facebook.com' },
}

const Banner = () => (
  <p role="status" className="mb-3 flex items-start gap-2 rounded-xl border border-[#EBCFA6] bg-[#FBEFDD] p-3 text-base font-bold">
    <Info size={20} className="mt-0.5 shrink-0 text-ambar" aria-hidden="true" />
    Modo prototipo · código de prueba: {CODIGO_PRUEBA}
  </p>
)

// Google y Facebook simulados (OAuth de mentiras): datos de prueba + código de 6 dígitos. Nunca se piden contraseñas reales.
export default function OAuthModal({ proveedor, onCerrar }) {
  const { entrarSimulado, cuentas } = useApp()
  const nombreProv = proveedor === 'google' ? 'Google' : 'Facebook'
  const [paso, setPaso] = useState(1)
  const [f, setF] = useState({ nombre: '', correo: '', barrio: '', rol: 'comprador' })
  const [codigo, setCodigo] = useState('')
  const [error, setError] = useState('')
  const existe = cuentas.some((c) => normalizarCorreo(c.correo) === normalizarCorreo(f.correo))

  const siguiente = (e) => {
    e.preventDefault()
    if (f.nombre.trim().length < 2) return setError('Escribe tu nombre.')
    if (!correoValido(f.correo)) return setError('Escribe un correo real, por ejemplo nombre@gmail.com.')
    setError('')
    setPaso(2)
  }

  const verificar = (e) => {
    e.preventDefault()
    if (codigo.trim() !== CODIGO_PRUEBA) return setError(`Ese código no es. En el prototipo es ${CODIGO_PRUEBA}.`)
    const r = entrarSimulado({ proveedor, ...f })
    if (!r.ok) {
      setError(r.error)
      setPaso(1)
    }
  }

  return (
    <Modal
      titulo={`Continuar con ${nombreProv}`}
      cerrable
      onCerrar={onCerrar}
      pie={
        <div className="space-y-1">
          <Button type="submit" form={paso === 1 ? 'oauth-datos' : 'oauth-codigo'} className="w-full" disabled={paso === 2 && codigo.length !== 6}>
            {paso === 1 ? 'Siguiente: recibir mi código' : 'Verificar y entrar'}
          </Button>
          {paso === 2 ? (
            <button type="button" onClick={() => { setPaso(1); setError(''); setCodigo('') }} className="min-h-[48px] w-full text-base font-semibold text-piedra underline">Volver</button>
          ) : (
            <button type="button" onClick={onCerrar} className="min-h-[48px] w-full text-base font-semibold text-piedra underline">Ahora no</button>
          )}
        </div>
      }
    >
      <Banner />
      {paso === 1 ? (
        <form id="oauth-datos" onSubmit={siguiente} className="space-y-4">
          <p className="text-sm text-piedra">Simulación: no se conecta con {nombreProv} ni te pide su contraseña. Tus datos se guardan solo en este navegador.</p>
          <button type="button" onClick={() => setF({ ...f, ...DATOS_PRUEBA[proveedor] })} className="min-h-[48px] w-full rounded-xl border border-borde bg-white text-base font-bold text-olla">
            Usar datos de prueba
          </button>
          <div>
            <label htmlFor="oa-nombre" className="mb-1 block text-base font-bold">Tu nombre</label>
            <input id="oa-nombre" className={campo} value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="oa-correo" className="mb-1 block text-base font-bold">Tu correo de {nombreProv}</label>
            <input id="oa-correo" type="email" inputMode="email" className={campo} value={f.correo} onChange={(e) => setF({ ...f, correo: e.target.value })} autoComplete="email" />
          </div>
          {!existe && (
            <>
              <div>
                <label htmlFor="oa-barrio" className="mb-1 block text-base font-bold">Tu barrio <span className="font-medium text-piedra">(opcional)</span></label>
                <input id="oa-barrio" className={campo} value={f.barrio} onChange={(e) => setF({ ...f, barrio: e.target.value })} placeholder="Escribe tu barrio o sector" autoComplete="off" />
              </div>
              <div>
                <p className="mb-2 text-base font-bold">¿Qué vas a hacer?</p>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => (
                    <Chip key={r.id} activo={f.rol === r.id} onClick={() => setF({ ...f, rol: r.id })}>{r.etiqueta}</Chip>
                  ))}
                </div>
                {f.rol !== 'comprador' && <p className="mt-2 text-sm text-piedra">Te armamos un puesto básico. Lo completas después en Mi cuenta.</p>}
              </div>
            </>
          )}
          {existe && <p className="text-sm font-semibold text-olla">Ya tienes cuenta con este correo: vas a entrar a ella.</p>}
          {error && <p role="alert" className="font-bold text-[#A8391B]">{error}</p>}
        </form>
      ) : (
        <form id="oauth-codigo" onSubmit={verificar} className="space-y-4">
          <p className="flex items-start gap-2 text-base"><ShieldCheck size={22} className="mt-0.5 shrink-0 text-olla" aria-hidden="true" /> Escribe el código de 6 números que "{nombreProv}" le mandó a <b className="break-all">{f.correo.trim()}</b>.</p>
          <label className="block text-base font-semibold">
            Código de 6 números
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
              className={`mt-1 text-center font-titulo text-2xl tracking-[0.4em] ${campo}`}
            />
          </label>
          {error && <p role="alert" className="font-bold text-[#A8391B]">{error}</p>}
        </form>
      )}
    </Modal>
  )
}
