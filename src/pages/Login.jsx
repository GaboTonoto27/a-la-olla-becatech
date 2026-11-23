import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { ArrowLeft, KeyRound, Phone, ShieldCheck, Store, ChefHat, Users } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { USUARIOS_DEMO, USUARIO_VISITANTE } from '../data/seed.js'
import BannerPrototipo from '../components/layout/BannerPrototipo.jsx'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'

const ICONO_ROL = { ambos: Users, vendedor: Store, comprador: ChefHat, admin: ShieldCheck }

function Marca({ letra, className }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-7 w-7 items-center justify-center rounded-full font-titulo text-base font-extrabold ${className}`}
    >
      {letra}
    </span>
  )
}

export default function Login() {
  const { usuario, entrar } = useApp()
  const [conClave, setConClave] = useState(false)
  const [nombre, setNombre] = useState('')
  const [clave, setClave] = useState('')

  if (usuario) return <Navigate to={usuario.rol === 'admin' ? '/admin' : '/'} replace />

  const entrarVisitante = () => entrar(USUARIO_VISITANTE.id)

  return (
    <div className="min-h-dvh">
      <BannerPrototipo />
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="font-titulo text-5xl font-extrabold text-olla">A la Olla</h1>
        <p className="mb-8 mt-2 text-lg text-piedra">
          La comida buena de la plaza llega a tu olla, a buen precio y antes de que se pierda.
        </p>

        {!conClave ? (
          <div className="space-y-3">
            <Button variante="suave" className="w-full justify-start" onClick={entrarVisitante}>
              <Marca letra="G" className="bg-[#F3EFE7] text-carbon" />
              Continuar con Google
            </Button>
            <Button variante="suave" className="w-full justify-start" onClick={entrarVisitante}>
              <Marca letra="f" className="bg-[#F3EFE7] text-carbon" />
              Continuar con Facebook
            </Button>
            <Button variante="suave" className="w-full justify-start" icono={KeyRound} onClick={() => setConClave(true)}>
              Usuario y contraseña
            </Button>
          </div>
        ) : (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              entrarVisitante()
            }}
          >
            <button
              type="button"
              onClick={() => setConClave(false)}
              className="flex min-h-[48px] items-center gap-2 text-base font-bold text-olla"
            >
              <ArrowLeft size={20} aria-hidden="true" /> Volver
            </button>
            <label className="block text-base font-semibold">
              Usuario
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="username"
                className="mt-1 min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base"
              />
            </label>
            <label className="block text-base font-semibold">
              Contraseña
              <input
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                autoComplete="current-password"
                className="mt-1 min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base"
              />
            </label>
            <p className="text-sm text-piedra">Es una demostración: cualquier usuario y contraseña sirven.</p>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        )}

        <section className="mt-10" aria-labelledby="rapido">
          <h2 id="rapido" className="text-2xl text-carbon">
            Entrar rápido (jurados)
          </h2>
          <p className="mb-4 mt-1 text-base text-piedra">Toca una cuenta de prueba y listo.</p>
          <ul className="space-y-3">
            {USUARIOS_DEMO.map((u) => {
              const Icono = ICONO_ROL[u.rol]
              return (
                <li key={u.id}>
                  <Card className="!p-0">
                    <button
                      type="button"
                      onClick={() => entrar(u.id)}
                      className="flex min-h-[72px] w-full items-center gap-4 rounded-2xl p-4 text-left hover:bg-marfil"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E7F1EA] text-olla">
                        <Icono size={24} aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-lg font-bold">
                          {u.etiqueta} — {u.negocio}
                        </span>
                        <span className="block text-base text-piedra">{u.detalle}</span>
                      </span>
                    </button>
                  </Card>
                </li>
              )
            })}
          </ul>
        </section>

        <p className="mt-8 flex items-start gap-2 text-sm text-piedra">
          <Phone size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          Tu número nunca se muestra: el chat es dentro de la app.
        </p>
      </main>
    </div>
  )
}
