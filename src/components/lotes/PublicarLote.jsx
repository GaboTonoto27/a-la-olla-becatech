import { useState } from 'react'
import { CheckCircle2, ChefHat, Sprout } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { dinero, precioReferencia } from '../../lib/dinero.js'
import { CATEGORIAS, MOTIVOS, PRODUCTOS_RAPIDOS, USOS } from '../../data/semilla.js'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'
import Contador from '../ui/Contador.jsx'
import { cant } from '../../lib/unidades.js'

const UNIDADES = ['kg', 'lb', 'bolsa', 'unidad']
// Fórmulas de precio de los fruvers: sobre tu precio base.
const FORMULAS = [
  { pct: 40, etiqueta: '+40% Extra (ref.)' },
  { pct: 20, etiqueta: "+20% Regular / Pa' Cocina" },
  { pct: -20, etiqueta: '−20% Remate' },
  { pct: -40, etiqueta: '−40% Urgente' },
]
const conPct = (base, pct) => Math.max(1, Math.round(base * (1 + pct / 100)))
const VACIO = {
  producto: '', cat: 'fruta', unidad: 'kg', cantidad: 5, normal: 0, rescate: 0,
  motivo: MOTIVOS[0], uso: 'Guiso', nivel: 'cocina', apto: false,
}

// Publicar en 3 pasos: 1) qué es, 2) cuántos, 3) precio de rescate + etiqueta rápida.
export default function PublicarLote() {
  const { ciudad, publicarLote } = useApp()
  const [paso, setPaso] = useState(1)
  const [f, setF] = useState(VACIO)
  const [otro, setOtro] = useState(false)
  const [publicado, setPublicado] = useState(null)
  const poner = (cambios) => setF((x) => ({ ...x, ...cambios }))

  const elegirRapido = (p) => {
    const normal = precioReferencia(p.precio, ciudad.id)
    poner({ producto: p.nombre, cat: p.cat, unidad: p.unidad, uso: p.uso, normal, rescate: Math.round(normal * 0.6) })
    setOtro(false)
    setPaso(2)
  }

  const valido = f.rescate > 0 && f.normal > 0 && f.apto
  const cambioPct = f.normal > 0 ? Math.round((f.rescate / f.normal - 1) * 100) : 0
  const cria = f.nivel === 'cria'

  const publicar = () => {
    const lote = publicarLote({
      producto: f.producto.trim(),
      cat: f.cat,
      unidad: f.unidad,
      cantidad: f.cantidad,
      normal: Math.max(f.normal, f.rescate),
      rescate: f.rescate,
      motivo: f.motivo,
      uso: cria ? 'Cría y abono' : f.uso,
      nivel: f.nivel,
    })
    setPublicado(lote)
    setF(VACIO)
    setPaso(1)
  }

  if (publicado) {
    return (
      <Card className="space-y-3 border-[#BCD8C5] bg-[#E7F1EA]">
        <p className="flex items-center gap-2 text-xl font-bold text-olla">
          <CheckCircle2 size={24} aria-hidden="true" /> ¡Publicado!
        </p>
        <p className="text-base">
          {cant(publicado.cantidad, publicado.unidad)} de {publicado.producto} a {dinero(publicado.rescate, publicado.ciudad)}. Se retira solo a las 4:00 p. m. si nadie lo aparta.
        </p>
        <Button onClick={() => setPublicado(null)} className="w-full sm:w-auto">Publicar otro</Button>
      </Card>
    )
  }

  return (
    <Card className="space-y-4">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-piedra">Paso {paso} de 3</p>
        <h2 className="text-2xl">{paso === 1 ? '¿Qué te sobró?' : paso === 2 ? '¿Cuánto es?' : 'Precio de rescate'}</h2>
        <div className="mt-2 flex gap-1.5" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= paso ? 'bg-olla' : 'bg-stone-200'}`} />
          ))}
        </div>
      </div>

      {paso === 1 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {PRODUCTOS_RAPIDOS.map((p) => (
              <Chip key={p.nombre} onClick={() => elegirRapido(p)}>{p.nombre}</Chip>
            ))}
            <Chip activo={otro} onClick={() => setOtro(true)}>Otro</Chip>
          </div>
          {otro && (
            <div className="space-y-3">
              <input
                value={f.producto}
                onChange={(e) => poner({ producto: e.target.value })}
                placeholder="¿Cuál producto?"
                aria-label="Nombre del producto"
                className="min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base"
              />
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS.map((c) => (
                  <Chip key={c.id} activo={f.cat === c.id} onClick={() => poner({ cat: c.id })}>{c.etiqueta}</Chip>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {UNIDADES.map((u) => (
                  <Chip key={u} activo={f.unidad === u} onClick={() => poner({ unidad: u })}>Por {u}</Chip>
                ))}
              </div>
              <Button className="w-full" disabled={f.producto.trim().length < 2} onClick={() => setPaso(2)}>
                Siguiente
              </Button>
            </div>
          )}
        </div>
      )}

      {paso === 2 && (
        <div className="space-y-4">
          <p className="text-lg font-semibold">{f.producto}</p>
          <Contador valor={f.cantidad} onChange={(v) => poner({ cantidad: v })} max={500} unidad={f.unidad} etiqueta="Cantidad que te sobra" />
          <div className="grid grid-cols-2 gap-2">
            <Button variante="suave" onClick={() => setPaso(1)}>Atrás</Button>
            <Button onClick={() => setPaso(3)}>Siguiente</Button>
          </div>
        </div>
      )}

      {paso === 3 && (
        <div className="space-y-4">
          <p className="text-lg font-semibold">
            {cant(f.cantidad, f.unidad)} de {f.producto}
          </p>

          <div className="space-y-3 rounded-2xl border border-borde bg-white p-3">
            <div>
              <label className="mb-1 block text-base font-bold" htmlFor="normal">Tu precio base por {f.unidad}</label>
              <input
                id="normal"
                type="number"
                inputMode="numeric"
                min="1"
                value={f.normal || ''}
                onChange={(e) => {
                  const base = Number(e.target.value)
                  poner({ normal: base, rescate: conPct(base, cambioPct) })
                }}
                className="min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base"
              />
            </div>
            <div>
              <p className="mb-2 text-base font-bold">Calculadora rápida (opcional)</p>
              <div className="flex flex-wrap gap-2">
                {FORMULAS.map((fm) => (
                  <Chip key={fm.pct} activo={f.normal > 0 && f.rescate === conPct(f.normal, fm.pct)} onClick={() => f.normal > 0 && poner({ rescate: conPct(f.normal, fm.pct) })}>
                    {fm.etiqueta}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-base font-bold" htmlFor="final">Precio final (puedes escribir el monto que quieras)</label>
              <input
                id="final"
                type="number"
                inputMode="numeric"
                min="1"
                value={f.rescate || ''}
                onChange={(e) => poner({ rescate: Number(e.target.value) })}
                className="min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base"
              />
            </div>
            {f.normal > 0 && f.rescate > 0 && (
              <p className="text-base font-bold" aria-live="polite">
                <span className="font-titulo text-2xl font-extrabold text-olla">{dinero(f.rescate, ciudad.id)}/{f.unidad}</span>
                {' · '}
                {cambioPct < 0 ? `Ahorra ${Math.abs(cambioPct)}%` : cambioPct > 0 ? `${cambioPct}% sobre tu base` : 'Igual a tu base'}
              </p>
            )}
          </div>

          <div className="space-y-3 rounded-2xl border border-borde bg-marfil p-3">
            <p className="text-base font-bold">Etiqueta rápida</p>
            <div className="flex flex-wrap gap-2">
              {MOTIVOS.map((m) => (
                <Chip key={m} activo={f.motivo === m} onClick={() => poner({ motivo: m })}>{m}</Chip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip icono={ChefHat} activo={!cria} onClick={() => poner({ nivel: 'cocina' })}>Pa' Cocina / Pulpa</Chip>
              <Chip icono={Sprout} activo={cria} onClick={() => poner({ nivel: 'cria' })}>Pa' Cría / Abono</Chip>
            </div>
            {!cria && (
              <div className="flex flex-wrap gap-2">
                {USOS.map((u) => (
                  <Chip key={u} activo={f.uso === u} onClick={() => poner({ uso: u })}>{u}</Chip>
                ))}
              </div>
            )}
            <label className="flex min-h-[48px] cursor-pointer items-start gap-3 text-base font-semibold">
              <input
                type="checkbox"
                checked={f.apto}
                onChange={(e) => poner({ apto: e.target.checked })}
                className="mt-0.5 h-6 w-6 shrink-0 accent-[#1B5E3A]"
              />
              {cria
                ? "Confirmo que este lote va pa' cría o abono, no pa' la mesa."
                : "Confirmo que está apto pa' comer: nada podrido ni vencido."}
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variante="suave" onClick={() => setPaso(2)}>Atrás</Button>
            <Button disabled={!valido} onClick={publicar}>Publicar lote</Button>
          </div>
        </div>
      )}
    </Card>
  )
}
