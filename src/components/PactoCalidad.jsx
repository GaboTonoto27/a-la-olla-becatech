import { useState } from 'react'
import { Banknote, Check, ChefHat, Eye, Leaf, ShieldCheck, Snowflake, Sparkles, Sprout, Store, Truck, Users, X } from 'lucide-react'
import Modal from './ui/Modal.jsx'
import Button from './ui/Button.jsx'
import { useApp } from '../context/AppContext.jsx'

const SI = ['Maduro', 'Golpeado', 'Torcido', 'Con la hoja maltratada']
const NO = ['Podrido', 'Vencido', 'Con moho o mal olor']

// Puntos clave: cada quien marca los de su rol. Lenguaje de la app: pa' tu olla, a ojo y mano, sin cuentos.
const PUNTOS = {
  comun: [
    { id: 'sano', icono: Leaf, titulo: "Solo comida buena pa' comer", detalle: 'Maduro, golpeado o torcido sí. Podrido, vencido o con moho, jamás.' },
    { id: 'efectivo', icono: Banknote, titulo: 'Pago en efectivo, a ojo y mano', detalle: 'Se revisa primero y se paga después. Sin cuentos.' },
  ],
  comprador: [
    { id: 'revisar', icono: Eye, titulo: 'Reviso con mis ojos y recojo a la hora acordada', detalle: 'Si algo no me convence, lo digo ahí mismo y no pago.' },
  ],
  vendedor: [
    { id: 'recepcion', icono: Truck, titulo: 'Cuido la frescura desde que llega la mercancía', detalle: 'Recibo bien con mis proveedores, reviso cada caja y devuelvo lo que llega dañado.' },
    { id: 'separo', icono: Sprout, titulo: "Separo estricto: Pa' Cocina y Pa' Cría", detalle: "Pa' Cocina / Pulpa es 100% sano. Lo pasado va aparte, tapado y con etiqueta Pa' Cría / Abono, fuera de la vitrina, pa' que no haya moscas ni malos olores." },
    { id: 'normas', icono: ShieldCheck, titulo: 'Cumplo las normas sanitarias de las plazas', detalle: 'Las que se exigen en las plazas de mercado grandes de Colombia y Latinoamérica: puesto y canastillas limpios, producto tapado y la nevera funcionando si la declaré.' },
  ],
}

const ROLES = {
  comprador: { etiqueta: 'Solo Comprador', icono: ChefHat, frase: "Vas a conseguir comida buena pa' tu olla, a buen precio y antes de que se pierda." },
  vendedor: { etiqueta: 'Solo Vendedor', icono: Store, frase: 'Vas a rescatar lo que te sobra y a cobrarlo justo, sin tirar comida buena.' },
  ambos: { etiqueta: 'Compro y Vendo', icono: Users, frase: "Tienes las dos caras: cocinas pa' tu olla y vendes lo que te sobra." },
  admin: { etiqueta: 'Coordinación', icono: ShieldCheck, frase: 'Cuidas que la plaza cumpla el pacto.' },
}

export default function PactoCalidad() {
  const { aceptarPacto, salir, usuario, miPuesto } = useApp()
  const rol = usuario?.rol ?? 'comprador'
  const info = ROLES[rol] ?? ROLES.comprador
  const Icono = info.icono
  const puntos = [
    ...PUNTOS.comun,
    ...(rol === 'comprador' || rol === 'ambos' ? PUNTOS.comprador : []),
    ...(rol === 'vendedor' || rol === 'ambos' ? PUNTOS.vendedor : []),
  ]
  const [marcados, setMarcados] = useState({})
  const hechos = puntos.filter((p) => marcados[p.id]).length
  const completo = hechos === puntos.length
  const nombre = usuario?.nombre?.trim().split(' ')[0] ?? ''

  return (
    <Modal
      titulo="Pacto de A la Olla"
      festivo={rol !== 'admin'}
      pie={
        <div className="space-y-1">
          <Button className="min-h-[56px] w-full text-lg shadow-[0_2px_6px_rgba(27,94,58,0.35)]" icono={Sparkles} disabled={!completo} onClick={aceptarPacto}>
            Acepto el Pacto
          </Button>
          <p className="text-center text-sm text-piedra" role="status">
            {completo ? 'Todo marcado. ¡Listo pa' + "' entrar!" : `Marcaste ${hechos} de ${puntos.length}. Faltan ${puntos.length - hechos} pa' seguir.`}
          </p>
          <button type="button" onClick={salir} className="min-h-[48px] w-full text-base font-semibold text-piedra underline">
            No acepto, salir
          </button>
        </div>
      }
    >
      <div className="mb-3 space-y-2" data-testid="pacto-saludo">
        <p className="flex flex-wrap items-center gap-2 text-lg font-bold">
          <Snowflake size={18} className="text-frio" aria-hidden="true" />
          {nombre ? `Hola, ${nombre}` : 'Hola'}
          {miPuesto && rol !== 'comprador' && rol !== 'admin' ? <span className="font-medium text-piedra">· {miPuesto.nombre}</span> : null}
        </p>
        <p className="inline-flex items-center gap-1.5 rounded-full border border-[#BCD8C5] bg-[#E7F1EA] px-3 py-1 text-sm font-bold text-olla">
          <Icono size={16} aria-hidden="true" /> {info.etiqueta}
        </p>
        <p className="text-base text-piedra">{info.frase} Marca cada punto pa' entrar. Así cuidamos a todos y al inspector le va bien.</p>
      </div>

      <div className="mb-2 rounded-xl border border-[#BCD8C5] bg-[#E7F1EA] px-3 py-2">
        <p className="flex items-center gap-2 font-bold text-olla"><Check size={20} aria-hidden="true" /> Sí se puede</p>
        <p className="text-base leading-snug">{SI.join(' · ')}</p>
      </div>
      <div className="mb-3 rounded-xl border border-[#F0C4B6] bg-[#FBE9E3] px-3 py-2">
        <p className="flex items-center gap-2 font-bold text-[#A8391B]"><X size={20} aria-hidden="true" /> Jamás</p>
        <p className="text-base leading-snug">{NO.join(' · ')}</p>
      </div>

      <ul className="space-y-2 pb-2" aria-label="Puntos clave del pacto">
        {puntos.map((p) => {
          const P = p.icono
          const on = Boolean(marcados[p.id])
          return (
            <li key={p.id}>
              <label className={`flex min-h-[64px] cursor-pointer items-start gap-3 rounded-2xl border p-3 transition-colors ${on ? 'border-olla bg-[#E7F1EA]' : 'border-borde bg-white hover:border-olla'}`}>
                <input type="checkbox" checked={on} onChange={(e) => setMarcados({ ...marcados, [p.id]: e.target.checked })} className="mt-1 h-6 w-6 shrink-0 accent-[#1B5E3A]" />
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-base font-bold"><P size={20} className="shrink-0 text-olla" aria-hidden="true" /> {p.titulo}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-piedra">{p.detalle}</span>
                </span>
              </label>
            </li>
          )
        })}
      </ul>
      {!completo && (
        <button type="button" onClick={() => setMarcados(Object.fromEntries(puntos.map((p) => [p.id, true])))} className="min-h-[48px] w-full text-base font-bold text-olla underline">
          Leí todo y marco todos los puntos
        </button>
      )}
    </Modal>
  )
}
