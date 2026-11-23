import { useState } from 'react'
import { Info } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'
import { campo } from './FormPuesto.jsx'

const ROLES = [
  { id: 'comprador', etiqueta: 'Solo compro' },
  { id: 'vendedor', etiqueta: 'Solo vendo' },
  { id: 'ambos', etiqueta: 'Compro y vendo' },
]

// Google y Facebook simulados: confirmas tus datos y entras con tu propio perfil. Nada sale del navegador.
export default function OAuthModal({ proveedor, onCerrar }) {
  const { entrarSimulado } = useApp()
  const nombreProv = proveedor === 'google' ? 'Google' : 'Facebook'
  const [f, setF] = useState({ nombre: '', correo: '', rol: 'comprador' })
  const [error, setError] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    const r = entrarSimulado({ proveedor, ...f })
    if (!r.ok) setError(r.error)
  }

  return (
    <Modal
      titulo={`Continuar con ${nombreProv}`}
      cerrable
      onCerrar={onCerrar}
      pie={
        <div className="space-y-1">
          <Button type="submit" form="oauth-form" className="w-full">Entrar con mi perfil</Button>
          <button type="button" onClick={onCerrar} className="min-h-[48px] w-full text-base font-semibold text-piedra underline">Ahora no</button>
        </div>
      }
    >
      <p className="mb-3 flex items-start gap-2 rounded-xl border border-[#B5D9E3] bg-[#E2F1F5] p-3 text-sm">
        <Info size={18} className="mt-0.5 shrink-0 text-frio" aria-hidden="true" />
        Simulación del prototipo: no se conecta con {nombreProv}. Tus datos se guardan solo en este navegador.
      </p>
      <form id="oauth-form" onSubmit={enviar} className="space-y-4">
        <div>
          <label htmlFor="oa-nombre" className="mb-1 block text-base font-bold">Tu nombre</label>
          <input id="oa-nombre" className={campo} value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="oa-correo" className="mb-1 block text-base font-bold">Tu correo</label>
          <input id="oa-correo" type="email" className={campo} value={f.correo} onChange={(e) => setF({ ...f, correo: e.target.value })} autoComplete="email" />
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
        {error && <p role="alert" className="font-bold text-[#A8391B]">{error}</p>}
      </form>
    </Modal>
  )
}
