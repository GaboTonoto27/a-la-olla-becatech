import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, MailCheck, MailOpen } from 'lucide-react'
import { CODIGO_ESPERA_SEG, enviarCodigoVerificacion, generarCodigo } from '../../lib/verificacion.js'
import Button from '../ui/Button.jsx'
import { campo } from './FormPuesto.jsx'

// Paso intermedio: la cuenta solo se crea cuando la persona escribe el código correcto.
export default function ConfirmaCorreo({ correo, onVerificado, onVolver }) {
  const codigo = useRef('')
  const intentos = useRef(0)
  const [real, setReal] = useState(null) // null = enviando · true = correo real · false = simulación
  const [espera, setEspera] = useState(CODIGO_ESPERA_SEG)
  const [escrito, setEscrito] = useState('')
  const [error, setError] = useState('')

  const enviar = () => {
    codigo.current = generarCodigo()
    intentos.current = 0
    setReal(null)
    setEscrito('')
    setError('')
    setEspera(CODIGO_ESPERA_SEG)
    const este = codigo.current
    enviarCodigoVerificacion(correo, este).then((r) => {
      if (codigo.current === este) setReal(r.real)
    })
  }

  useEffect(() => {
    if (!codigo.current) enviar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (espera <= 0) return
    const id = setTimeout(() => setEspera((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [espera])

  const confirmar = (e) => {
    e.preventDefault()
    if (escrito.trim() === codigo.current) return onVerificado()
    intentos.current += 1
    if (intentos.current >= 5) {
      setError('Muchos intentos. Pide un código nuevo.')
      codigo.current = ''
      setEscrito('')
      return
    }
    setError('Ese código no es. Revísalo e inténtalo otra vez.')
  }

  const vencido = !codigo.current && intentos.current >= 5

  return (
    <form className="space-y-5" onSubmit={confirmar}>
      <button type="button" onClick={onVolver} className="flex min-h-[48px] items-center gap-2 text-base font-bold text-olla">
        <ArrowLeft size={20} aria-hidden="true" /> Volver
      </button>
      <div>
        <h2 className="text-2xl">Confirma tu correo</h2>
        <p className="text-base text-piedra">Te mandamos un código de 6 números a <b className="break-all text-carbon">{correo}</b>. Así sabemos que eres una persona.</p>
      </div>

      {real === false && codigo.current && (
        <div className="space-y-1 rounded-2xl border border-[#EBCFA6] bg-[#FBEFDD] p-4" role="status">
          <p className="flex items-center gap-2 text-base font-bold text-ambar"><MailOpen size={20} aria-hidden="true" /> Simulación de correo recibido en {correo}</p>
          <p className="text-base">Tu código de A la Olla es:</p>
          <p className="font-titulo text-4xl font-extrabold tracking-[0.3em] text-carbon">{codigo.current}</p>
          <p className="text-sm text-piedra">Es una prueba: en la versión real llega a tu bandeja de entrada.</p>
        </div>
      )}
      {real === true && (
        <p className="flex items-start gap-2 rounded-2xl border border-[#BCD8C5] bg-[#E7F1EA] p-4 text-base font-bold text-olla" role="status">
          <MailCheck size={22} className="mt-0.5 shrink-0" aria-hidden="true" /> Listo, revisa tu bandeja de entrada (y el spam).
        </p>
      )}

      <label className="block text-base font-semibold">
        Código de 6 números
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={escrito}
          onChange={(e) => setEscrito(e.target.value.replace(/\D/g, ''))}
          disabled={vencido}
          className={`mt-1 text-center font-titulo text-2xl tracking-[0.4em] ${campo}`}
        />
      </label>
      {error && <p role="alert" className="rounded-xl border border-[#F0C4B6] bg-[#FBE9E3] p-3 text-base font-bold text-[#A8391B]">{error}</p>}

      <Button type="submit" className="w-full" disabled={escrito.length !== 6 || vencido}>Confirmar y crear mi cuenta</Button>
      <Button type="button" variante="suave" className="w-full" onClick={enviar} disabled={espera > 0}>
        {espera > 0 ? `Reenviar código en ${espera} s` : 'Reenviar código'}
      </Button>
    </form>
  )
}
