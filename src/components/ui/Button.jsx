import { Link } from 'react-router-dom'

const VARIANTES = {
  primario: 'bg-olla text-white hover:bg-olla-oscuro border border-olla',
  acento: 'bg-tomate text-white hover:bg-[#b94324] border border-tomate',
  contorno: 'bg-white text-olla border border-olla hover:bg-marfil',
  suave: 'bg-white text-carbon border border-borde hover:bg-marfil',
}

export default function Button({
  variante = 'primario',
  to,
  icono: Icono,
  className = '',
  children,
  ...resto
}) {
  const clases = `inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-5 py-2 text-base font-bold transition-colors disabled:opacity-50 ${VARIANTES[variante]} ${className}`
  const contenido = (
    <>
      {Icono && <Icono size={20} aria-hidden="true" />}
      {children}
    </>
  )
  if (to) {
    return (
      <Link to={to} className={clases} {...resto}>
        {contenido}
      </Link>
    )
  }
  return (
    <button type="button" className={clases} {...resto}>
      {contenido}
    </button>
  )
}
