import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Map, PackageOpen } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useAhora } from '../lib/useAhora.js'
import { loteActivo } from '../lib/acciones.js'
import { cant } from '../lib/unidades.js'
import { promedioPuesto } from '../lib/social.js'
import { Star } from 'lucide-react'
import Card from '../components/ui/Card.jsx'
import Chip from '../components/ui/Chip.jsx'
import Button from '../components/ui/Button.jsx'
import Pill from '../components/ui/Pill.jsx'
import AvisoPlaza from '../components/layout/AvisoPlaza.jsx'
import FotoPuesto from '../components/puestos/FotoPuesto.jsx'
import HorarioPuesto from '../components/puestos/HorarioPuesto.jsx'
import Sellos from '../components/puestos/Sellos.jsx'
import ComoFuncionanEstandares from '../components/puestos/ComoFuncionanEstandares.jsx'

const FILTROS = [
  { id: 'todos', etiqueta: 'Todos' },
  { id: 'frio', etiqueta: 'Con nevera' },
  { id: 'ambiente', etiqueta: 'Sin nevera' },
  { id: 'lotes', etiqueta: 'Con lotes hoy' },
  { id: 'cria', etiqueta: "Pa' Cría/Abono" },
]

export default function Puestos() {
  const { ciudad, lotes, estandaresDe, puestosDe, resenas } = useApp()
  const ahora = useAhora(30000)
  const [filtro, setFiltro] = useState('todos')

  const lista = useMemo(() => {
    const vivos = lotes.filter((l) => l.ciudad === ciudad.id && loteActivo(l, ahora) && l.cantidad > 0)
    return puestosDe(ciudad.id).map((p) => ({ ...p, lotes: vivos.filter((l) => l.vendedorId === p.id), frio: Boolean(estandaresDe(p.id).frio) }))
  }, [lotes, ciudad.id, ahora, estandaresDe, puestosDe])

  const visibles = lista.filter((p) => {
    if (filtro === 'frio') return p.frio
    if (filtro === 'ambiente') return !p.frio
    if (filtro === 'lotes') return p.lotes.length > 0
    if (filtro === 'cria') return p.lotes.some((l) => l.nivel === 'cria')
    return true
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl sm:text-4xl">Puestos de {ciudad.plaza}</h1>
        <p className="mt-1 text-lg text-piedra">Mira quién tiene nevera, quién no y qué lotes tiene hoy.</p>
      </div>
      <AvisoPlaza />
      <div className="grid gap-2 sm:grid-cols-2">
        <Button to="/mapa" variante="contorno" icono={Map}>Ver en el mapa</Button>
        <ComoFuncionanEstandares />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="group" aria-label="Filtros de puestos">
        {FILTROS.map((f) => (
          <Chip key={f.id} activo={filtro === f.id} onClick={() => setFiltro(f.id)}>{f.etiqueta}</Chip>
        ))}
      </div>

      {visibles.length === 0 ? (
        <Card className="text-center">
          <PackageOpen size={40} className="mx-auto text-piedra" aria-hidden="true" />
          <p className="mt-2 text-xl font-bold">Ningún puesto con ese filtro</p>
          <p className="text-base text-piedra">Prueba con otro.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((p) => (
            <Link
              key={p.id}
              to={`/puesto/${p.id}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-borde bg-white shadow-[0_1px_2px_rgba(28,31,29,0.04)]"
            >
              <FotoPuesto puesto={p} className="h-36" />
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h2 className="text-2xl">{p.nombre}</h2>
                  <p className="text-base text-piedra">{p.barrio} · {p.formal ? 'Formal' : 'Informal'}</p>
                  {promedioPuesto(resenas, p.id) && (
                    <p className="mt-1 flex items-center gap-1 text-sm font-bold">
                      <Star size={16} className="fill-ambar text-ambar" aria-hidden="true" />
                      {String(promedioPuesto(resenas, p.id).promedio).replace('.', ',')} · compras verificadas
                    </p>
                  )}
                </div>
                <HorarioPuesto puesto={p} ahora={ahora} compacto />
                <Sellos vendedorId={p.id} avisoSinCelular />
                <div className="mt-auto flex items-center justify-between gap-2">
                  {p.lotes.length > 0 ? (
                    <Pill tono="tomate">{cant(p.lotes.length, 'lote')} hoy</Pill>
                  ) : (
                    <Pill>Sin lotes hoy</Pill>
                  )}
                  <span className="flex items-center gap-1 text-base font-bold text-olla">
                    Ver puesto <ChevronRight size={20} aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
