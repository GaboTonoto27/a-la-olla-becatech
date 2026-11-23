export default function Toggle({ activo, onChange, etiqueta, className = '' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      aria-label={etiqueta}
      onClick={() => onChange(!activo)}
      className={`relative inline-flex h-8 w-14 shrink-0 before:absolute before:-inset-2 before:content-[''] items-center rounded-full border transition-colors ${
        activo ? 'border-olla bg-olla' : 'border-stone-300 bg-stone-200'
      } ${className}`}
    >
      <span
        className={`inline-block h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
          activo ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
