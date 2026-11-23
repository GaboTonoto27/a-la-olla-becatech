import { ChevronDown } from 'lucide-react'
import { USUARIOS_DEMO } from '../../data/seed.js'

// Acordeón cerrado: cuentas de prueba pa' los jurados. "Autocompletar" llena el formulario, no entra solo.
export default function CuentasDemo({ onAutocompletar }) {
  return (
    <details className="group mt-10 rounded-2xl border border-borde bg-white">
      <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-2 px-4 text-base font-bold [&::-webkit-details-marker]:hidden">
        Cuentas demo de campo (Solo evaluación BecaTech)
        <ChevronDown size={20} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <ul className="divide-y divide-borde border-t border-borde">
        {USUARIOS_DEMO.map((u) => (
          <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
            <div className="min-w-0">
              <p className="text-base font-bold">{u.etiqueta} · {u.negocio}</p>
              <p className="break-all text-sm text-piedra">{u.correo} · clave {u.clave}</p>
            </div>
            <button
              type="button"
              onClick={() => onAutocompletar(u)}
              className="min-h-[48px] rounded-xl px-3 text-sm font-bold text-olla underline"
            >
              Autocompletar
            </button>
          </li>
        ))}
      </ul>
    </details>
  )
}
