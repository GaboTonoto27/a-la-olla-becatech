// Botón tipo píldora pa' filtros y opciones (48 px de alto, fácil de tocar).
export default function Chip({ activo, onClick, icono: Icono, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className={`inline-flex min-h-[48px] shrink-0 items-center gap-2 rounded-full border px-4 text-base font-bold transition-colors ${
        activo ? 'border-olla bg-olla text-white' : 'border-borde bg-white text-carbon hover:border-olla'
      } ${className}`}
    >
      {Icono && <Icono size={18} aria-hidden="true" />}
      {children}
    </button>
  )
}
