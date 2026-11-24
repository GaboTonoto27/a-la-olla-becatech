// Isotipo oficial de "A la Olla": el mismo dibujo de public/icono.svg (el favicon). Una sola fuente de marca en toda la app.
export function Isotipo({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" className={`shrink-0 ${className}`} role="img" aria-label="A la Olla">
      <rect width="512" height="512" rx="112" fill="#1B5E3A" />
      <path d="M116 236h280v48c0 70-56 126-126 126h-28c-70 0-126-56-126-126z" fill="#FAF8F5" />
      <rect x="96" y="216" width="320" height="28" rx="14" fill="#FAF8F5" />
      <path d="M256 190c-34-10-48-44-34-78 34 6 54 40 34 78z" fill="#D9532F" />
      <path d="M262 190c8-36 38-58 72-52-4 36-34 60-72 52z" fill="#8FC9A3" />
    </svg>
  )
}

// Isotipo + nombre. Se usa igual en el encabezado de todas las vistas y en el login.
export default function Logo({ size = 36, texto = 'text-2xl', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-titulo font-extrabold text-olla ${texto} ${className}`}>
      <Isotipo size={size} />
      <span>A la Olla</span>
    </span>
  )
}
