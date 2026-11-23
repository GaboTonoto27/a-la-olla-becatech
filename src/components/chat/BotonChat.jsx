import { MessageCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import Button from '../ui/Button.jsx'

// Abre (o crea) el chat seguro entre un comprador y un vendedor. Nunca muestra teléfonos.
export default function BotonChat({ vendedorId, compradorId, contexto, children = 'Escribir por el chat', variante = 'suave', className = '' }) {
  const { abrirChat } = useApp()
  const navigate = useNavigate()
  return (
    <Button variante={variante} icono={MessageCircle} className={className} onClick={() => navigate(`/chat/${abrirChat({ vendedorId, compradorId, contexto })}`)}>
      {children}
    </Button>
  )
}
