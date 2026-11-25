import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ArrowLeft, ChefHat, Phone, Store, Users } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { PERFILES_COMPRADOR } from '../data/seed.js'
import { correoValido } from '../lib/verificacion.js'
import ConfirmaCorreo from '../components/auth/ConfirmaCorreo.jsx'
import BannerPrototipo from '../components/layout/BannerPrototipo.jsx'
import Button from '../components/ui/Button.jsx'
import Chip from '../components/ui/Chip.jsx'
import Logo from '../components/ui/Logo.jsx'
import Toast from '../components/ui/Toast.jsx'
import FormPuesto, { PUESTO_VACIO, campo } from '../components/auth/FormPuesto.jsx'
import OAuthModal from '../components/auth/OAuthModal.jsx'
import CuentasDemo from '../components/auth/CuentasDemo.jsx'

const ROLES = [
  { id: 'comprador', etiqueta: 'Solo compro', detalle: 'Pido y aparto comida', icono: ChefHat },
  { id: 'vendedor', etiqueta: 'Solo vendo', detalle: 'Publico lo que me sobra', icono: Store },
  { id: 'ambos', etiqueta: 'Compro y vendo', detalle: 'Las dos cosas, una cuenta', icono: Users },
]

function IconoGoogle() {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 48 48" className="shrink-0">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
      <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  )
}

function IconoFacebook() {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" className="shrink-0">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path fill="#fff" d="M16.67 15.47 17.2 12h-3.33V9.75c0-.95.47-1.88 1.96-1.88h1.51V4.92s-1.37-.23-2.68-.23c-2.74 0-4.53 1.66-4.53 4.67V12H7.1v3.47h3.03V24h3.74v-8.53h2.8z" />
    </svg>
  )
}

function Error({ children }) {
  return children ? <p role="alert" className="rounded-xl border border-[#F0C4B6] bg-[#FBE9E3] p-3 text-base font-bold text-[#A8391B]">{children}</p> : null
}

function IniciarSesion({ valores, onCambio }) {
  const { iniciarSesion } = useApp()
  const [error, setError] = useState('')
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        const r = iniciarSesion(valores.ident, valores.clave)
        if (!r.ok) setError(r.error)
      }}
    >
      <label className="block text-base font-semibold">
        Correo o usuario
        <input value={valores.ident} onChange={(e) => onCambio({ ident: e.target.value })} autoComplete="username" className={`mt-1 ${campo}`} />
      </label>
      <label className="block text-base font-semibold">
        Contraseña
        <input type="password" value={valores.clave} onChange={(e) => onCambio({ clave: e.target.value })} autoComplete="current-password" className={`mt-1 ${campo}`} />
      </label>
      <Error>{error}</Error>
      <Button type="submit" className="w-full">Entrar</Button>
    </form>
  )
}

function CrearCuenta() {
  const { registrar, cuentas } = useApp()
  const [paso, setPaso] = useState(1)
  const [f, setF] = useState({ nombre: '', correo: '', clave: '', barrio: '', rol: 'comprador', perfilComprador: 'hogar' })
  const [puesto, setPuesto] = useState(PUESTO_VACIO)
  const [error, setError] = useState('')
  const vende = f.rol !== 'comprador'
  const compra = f.rol !== 'vendedor'

  // Solo aquí se crea la cuenta: después de que la persona escribió el código correcto.
  const crear = () => {
    const r = registrar({ ...f, perfilComprador: compra ? f.perfilComprador : undefined, puesto: vende ? puesto : null })
    if (!r.ok) {
      setError(r.error)
      setPaso(1)
    }
  }

  if (paso === 3) {
    return <ConfirmaCorreo correo={f.correo.trim()} onVerificado={crear} onVolver={() => setPaso(vende ? 2 : 1)} />
  }

  if (paso === 2) {
    return (
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault()
          setPaso(3)
        }}
      >
        <button type="button" onClick={() => setPaso(1)} className="flex min-h-[48px] items-center gap-2 text-base font-bold text-olla">
          <ArrowLeft size={20} aria-hidden="true" /> Volver
        </button>
        <div>
          <h2 className="text-2xl">Tu puesto</h2>
          <p className="text-base text-piedra">Una sola pantalla. Después lo cambias cuando quieras en Mi cuenta.</p>
        </div>
        <FormPuesto valor={puesto} onChange={setPuesto} />
        <Button type="submit" className="w-full" disabled={puesto.nombre.trim().length < 2 || !puesto.coord}>
          Crear mi cuenta y mi puesto
        </Button>
        {!puesto.coord && <p className="text-sm text-piedra">Marca tu puesto en el mapa pa' poder seguir.</p>}
      </form>
    )
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        const correo = f.correo.trim().toLowerCase()
        if (!correoValido(correo)) return setError('Escribe un correo real, por ejemplo nombre@gmail.com.')
        if (cuentas.some((c) => c.correo.toLowerCase() === correo)) return setError('Ese correo ya tiene cuenta. Entra desde "Iniciar sesión".')
        setError('')
        setPaso(vende ? 2 : 3)
      }}
    >
      <label className="block text-base font-semibold">
        Tu nombre
        <input required value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} autoComplete="name" className={`mt-1 ${campo}`} />
      </label>
      <label className="block text-base font-semibold">
        Correo
        <input required type="email" inputMode="email" value={f.correo} onChange={(e) => setF({ ...f, correo: e.target.value })} autoComplete="email" className={`mt-1 ${campo}`} />
      </label>
      <label className="block text-base font-semibold">
        Contraseña (mínimo 6)
        <input required type="password" minLength={6} value={f.clave} onChange={(e) => setF({ ...f, clave: e.target.value })} autoComplete="new-password" className={`mt-1 ${campo}`} />
      </label>
      <label className="block text-base font-semibold">
        Tu barrio
        <input required value={f.barrio} onChange={(e) => setF({ ...f, barrio: e.target.value })} placeholder="Escribe tu barrio o sector" autoComplete="off" className={`mt-1 ${campo}`} />
      </label>

      <div>
        <p className="mb-2 text-base font-bold">¿Qué vas a hacer?</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {ROLES.map(({ id, etiqueta, detalle, icono: Icono }) => (
            <button
              key={id}
              type="button"
              aria-pressed={f.rol === id}
              onClick={() => setF({ ...f, rol: id })}
              className={`flex min-h-[72px] items-center gap-3 rounded-2xl border p-3 text-left sm:flex-col sm:items-start ${
                f.rol === id ? 'border-olla bg-[#E7F1EA]' : 'border-borde bg-white hover:border-olla'
              }`}
            >
              <Icono size={24} className="shrink-0 text-olla" aria-hidden="true" />
              <span>
                <span className="block text-base font-bold">{etiqueta}</span>
                <span className="block text-sm text-piedra">{detalle}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

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

      <Error>{error}</Error>
      <Button type="submit" className="w-full">{vende ? 'Siguiente: mi puesto' : 'Crear mi cuenta'}</Button>
    </form>
  )
}

export default function Login() {
  const { usuario } = useApp()
  const [tab, setTab] = useState('crear')
  const [oauth, setOauth] = useState(null)
  const [datos, setDatos] = useState({ ident: '', clave: '' })

  if (usuario) return <Navigate to={usuario.rol === 'admin' ? '/admin' : '/'} replace />

  const autocompletar = (u) => {
    setDatos({ ident: u.correo, clave: u.clave })
    setTab('entrar')
    setTimeout(() => document.getElementById('formulario-acceso')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  return (
    <div className="min-h-dvh">
      <BannerPrototipo />
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1><Logo size={56} texto="text-5xl" /></h1>
        <p className="mb-6 mt-2 text-lg text-piedra">La comida buena de la plaza llega a tu olla, a buen precio y antes de que se pierda.</p>

        <div className="space-y-3">
          <Button variante="suave" className="w-full justify-start" onClick={() => setOauth('google')}>
            <IconoGoogle /> Continuar con Google
          </Button>
          <Button variante="suave" className="w-full justify-start" onClick={() => setOauth('facebook')}>
            <IconoFacebook /> Continuar con Facebook
          </Button>
        </div>

        <div id="formulario-acceso" className="mt-8 scroll-mt-4">
          <div role="tablist" aria-label="Acceso" className="mb-5 grid grid-cols-2 rounded-xl border border-borde bg-white p-1">
            {[['crear', 'Crear cuenta'], ['entrar', 'Iniciar sesión']].map(([id, texto]) => (
              <button
                key={id}
                role="tab"
                type="button"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`min-h-[48px] rounded-lg text-base font-bold ${tab === id ? 'bg-olla text-white' : 'text-piedra'}`}
              >
                {texto}
              </button>
            ))}
          </div>
          {tab === 'crear' ? <CrearCuenta /> : <IniciarSesion valores={datos} onCambio={(c) => setDatos((d) => ({ ...d, ...c }))} />}
        </div>

        <CuentasDemo onAutocompletar={autocompletar} />

        <p className="mt-8 flex items-start gap-2 text-sm text-piedra">
          <Phone size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          Tu número nunca se muestra: el chat es dentro de la app.
        </p>
      </main>
      <Toast />
      {oauth && <OAuthModal proveedor={oauth} onCerrar={() => setOauth(null)} />}
    </div>
  )
}
