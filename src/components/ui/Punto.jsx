// Punto terracota discreto: "hay algo por atender". Lleva texto pa' lectores de pantalla.
export default function Punto({ className = '', texto = 'Hay algo pendiente' }) {
  return (
    <span className={`inline-block h-3 w-3 rounded-full border-2 border-white bg-tomate ${className}`}>
      <span className="sr-only">{texto}</span>
    </span>
  )
}
