import { useState } from 'react'
import { Send, Ticket } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { MOTIVOS } from '../../lib/apelaciones.js'
import Button from '../ui/Button.jsx'
import Pill from '../ui/Pill.jsx'
import { campo } from '../auth/FormPuesto.jsx'

// Apelación de tarifa: solo aparece cuando el puesto ya tiene una tarifa asignada por el equipo.
export default function ApelacionTarifa({ puesto }) {
  const { abrirApelacion } = useApp()
  const [abierto, setAbierto] = useState(false)
  const [motivo, setMotivo] = useState('')
  const [texto, setTexto] = useState('')
  const [error, setError] = useState('')
  if (!puesto || typeof puesto.tarifa !== 'number') return null

  if (puesto.apelacion?.estado === 'abierta') {
    return (
      <div className="flex flex-wrap items-center gap-2" data-testid="apelacion-en-curso">
        <Pill tono="frio" icono={Ticket}>Revisión de tarifa en curso</Pill>
        <span className="text-base text-piedra">Ticket {puesto.apelacion.folio}. El equipo te responde pronto.</span>
      </div>
    )
  }

  const enviar = (e) => {
    e.preventDefault()
    const r = abrirApelacion({ puestoId: puesto.id, motivo, texto })
    if (!r.ok) return setError(r.error)
    setAbierto(false)
    setMotivo('')
    setTexto('')
    setError('')
  }

  if (!abierto) {
    return (
      <Button variante="suave" icono={Ticket} className="w-full" onClick={() => setAbierto(true)}>
        ¿No estás de acuerdo con tu tarifa? Abrir ticket de revisión
      </Button>
    )
  }

  return (
    <form onSubmit={enviar} className="space-y-3 rounded-2xl border border-borde bg-white p-4" data-testid="form-apelacion">
      <p className="text-lg font-bold">Ticket de revisión de tarifa</p>
      <label className="block text-base font-bold" htmlFor={`ap-motivo-${puesto.id}`}>Motivo</label>
      <select id={`ap-motivo-${puesto.id}`} className={campo} value={motivo} onChange={(e) => setMotivo(e.target.value)}>
        <option value="">Elige un motivo…</option>
        {MOTIVOS.map((m) => <option key={m.id} value={m.id}>{m.etiqueta}</option>)}
      </select>
      <label className="block text-base font-bold" htmlFor={`ap-texto-${puesto.id}`}>Cuéntanos qué pasa</label>
      <textarea id={`ap-texto-${puesto.id}`} rows={3} maxLength={400} className={`${campo} py-2`} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Ej.: Esta semana vendí poco por la lluvia." />
      {error && <p role="alert" className="font-bold text-[#A8391B]">{error}</p>}
      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variante="suave" onClick={() => { setAbierto(false); setError('') }}>Cancelar</Button>
        <Button type="submit" icono={Send}>Enviar ticket</Button>
      </div>
    </form>
  )
}
