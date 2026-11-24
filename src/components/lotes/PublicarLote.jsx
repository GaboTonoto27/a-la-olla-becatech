import { useState } from 'react'
import { AlertCircle, CheckCircle2, ChefHat, Sprout } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { dinero, precioReferencia } from '../../lib/dinero.js'
import { FORMULAS, calidadDeFormula, conPct, formulaQueCoincide, infoPrecio } from '../../lib/precios.js'
import { CATEGORIAS, MOTIVOS, PRODUCTOS_RAPIDOS, USOS } from '../../data/semilla.js'
import Card from '../ui/Card.jsx'
import Button from '../ui/Button.jsx'
import Chip from '../ui/Chip.jsx'
import Contador from '../ui/Contador.jsx'
import { cant } from '../../lib/unidades.js'
import { plazaAbierta } from '../../lib/horario.js'

const UNIDADES = ['kg', 'lb', 'bolsa', 'unidad']
const FALTA = 'Selecciona al menos una opción para continuar'
// formula: % de la calculadora rápida que está activo (null = ninguno). calidad solo sale de Extra o Regular.
const VACIO = {
  producto: '', cat: 'fruta', unidad: 'kg', cantidad: 5, normal: 0, rescate: 0, formula: null,
  motivo: MOTIVOS[0], uso: 'Guiso', nivel: 'cocina', apto: false,
}

function Aviso({ texto, id }) {
  if (!texto) return null
  return (
    <p id={id} data-error role="alert" className="flex items-start gap-1.5 text-sm font-bold text-[#A8391B]">
      <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" /> {texto}
    </p>
  )
}

const irAlError = () => requestAnimationFrame(() => document.querySelector('[data-error]')?.scrollIntoView({ block: 'center', behavior: 'smooth' }))

// Publicar en 3 pasos: 1) qué es, 2) cuántos, 3) precio + etiqueta rápida. Los grupos de opciones se pueden desmarcar.
export default function PublicarLote() {
  const { ciudad, publicarLote } = useApp()
  const [paso, setPaso] = useState(1)
  const [f, setF] = useState(VACIO)
  const [otro, setOtro] = useState(false)
  const [publicado, setPublicado] = useState(null)
  const [err, setErr] = useState({})
  const poner = (cambios) => setF((x) => ({ ...x, ...cambios }))
  // Elegir una opción de un grupo; si ya estaba elegida, se desmarca. Al elegir, se limpia su aviso.
  const alternar = (campo, valor) => {
    poner({ [campo]: f[campo] === valor ? null : valor })
    setErr((e) => ({ ...e, [campo]: undefined }))
  }

  const elegirRapido = (p) => {
    const normal = precioReferencia(p.precio, ciudad.id)
    poner({ producto: p.nombre, cat: p.cat, unidad: p.unidad, uso: p.uso, normal, rescate: conPct(normal, -30, ciudad.id), formula: -30 })
    setOtro(false)
    setErr({})
    setPaso(2)
  }

  const siguienteOtro = () => {
    const e = {}
    if (f.producto.trim().length < 2) e.producto = 'Escribe cómo se llama el producto.'
    if (!f.cat) e.cat = FALTA
    if (!f.unidad) e.unidad = FALTA
    setErr(e)
    if (Object.keys(e).length) return irAlError()
    setPaso(2)
  }

  // Calculadora: elegir aplica el % sobre la base; volver a tocarla la desmarca (el precio queda como está).
  const alternarFormula = (pct) => {
    if (f.formula === pct) return poner({ formula: null })
    if (!(f.normal > 0)) return setErr((e) => ({ ...e, precio: 'Primero escribe tu precio base.' }))
    poner({ formula: pct, rescate: conPct(f.normal, pct, ciudad.id) })
    setErr((e) => ({ ...e, precio: undefined }))
  }
  // Base nueva: si hay botón activo, el precio final se recalcula; si no, el final no se toca.
  const cambiarBase = (base) => poner({ normal: base, ...(f.formula != null && base > 0 ? { rescate: conPct(base, f.formula, ciudad.id) } : {}) })
  // Final manual: el botón queda activo solo si da exactamente ese número; si no, se desmarca todo.
  const cambiarFinal = (valor) => poner({ rescate: valor, formula: formulaQueCoincide(f.normal, valor, ciudad.id) })

  const cria = f.nivel === 'cria'
  const calidad = f.formula != null ? calidadDeFormula(f.formula) : null
  const info = infoPrecio(f.normal, f.rescate, calidad)
  const cambioPct = f.normal > 0 ? Math.round((f.rescate / f.normal - 1) * 100) : 0

  const publicar = () => {
    const e = {}
    if (!(f.normal > 0) || !(f.rescate > 0)) e.precio = 'Escribe tu precio base y el precio final.'
    if (!f.motivo) e.motivo = FALTA
    if (!f.nivel) e.nivel = FALTA
    else if (f.nivel === 'cocina' && !f.uso) e.uso = FALTA
    if (!f.apto) e.apto = 'Marca la confirmación para poder publicar.'
    setErr(e)
    if (Object.keys(e).length) return irAlError()
    const lote = publicarLote({
      producto: f.producto.trim(),
      cat: f.cat,
      unidad: f.unidad,
      cantidad: f.cantidad,
      normal: f.normal, // precio de referencia: la rebaja solo existe si el final queda por debajo
      rescate: f.rescate,
      calidad,
      motivo: f.motivo,
      uso: cria ? 'Cría y abono' : f.uso,
      nivel: f.nivel,
    })
    setPublicado(lote)
    setF(VACIO)
    setOtro(false)
    setErr({})
    setPaso(1)
  }

  if (publicado) {
    const pi = infoPrecio(publicado.normal, publicado.rescate, publicado.calidad)
    return (
      <Card className="space-y-3 border-[#BCD8C5] bg-[#E7F1EA]">
        <p className="flex items-center gap-2 text-xl font-bold text-olla">
          <CheckCircle2 size={24} aria-hidden="true" /> ¡Publicado!
        </p>
        <p className="text-base">
          {cant(publicado.cantidad, publicado.unidad)} de {publicado.producto} a {dinero(publicado.rescate, publicado.ciudad)}
          {pi.rebaja ? ` (rebaja −${pi.pct}%)` : pi.etiqueta ? ` (${pi.etiqueta})` : ''}. Se retira solo a las 4:00 p. m. si nadie lo aparta{plazaAbierta() ? '' : ' (simulación de cierre)'}.
        </p>
        <Button onClick={() => setPublicado(null)} className="w-full sm:w-auto">Publicar otro</Button>
      </Card>
    )
  }

  return (
    <Card className="space-y-4">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-piedra">Paso {paso} de 3</p>
        <h2 className="text-2xl">{paso === 1 ? '¿Qué te sobró?' : paso === 2 ? '¿Cuánto es?' : 'Precio y etiqueta'}</h2>
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
            <Chip activo={otro} onClick={() => { setOtro(!otro); setErr({}) }}>Otro</Chip>
          </div>
          {otro && (
            <div className="space-y-3">
              <div className="space-y-1">
                <input
                  value={f.producto}
                  onChange={(e) => { poner({ producto: e.target.value }); setErr((x) => ({ ...x, producto: undefined })) }}
                  placeholder="¿Cuál producto?"
                  aria-label="Nombre del producto"
                  className="min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base"
                />
                <Aviso texto={err.producto} />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Categoría">
                  {CATEGORIAS.map((c) => (
                    <Chip key={c.id} activo={f.cat === c.id} onClick={() => alternar('cat', c.id)}>{c.etiqueta}</Chip>
                  ))}
                </div>
                <Aviso texto={err.cat} />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Unidad">
                  {UNIDADES.map((u) => (
                    <Chip key={u} activo={f.unidad === u} onClick={() => alternar('unidad', u)}>Por {u}</Chip>
                  ))}
                </div>
                <Aviso texto={err.unidad} />
              </div>
              <Button className="w-full" onClick={siguienteOtro}>
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
                onChange={(e) => cambiarBase(Number(e.target.value))}
                className="min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base"
              />
            </div>
            <div>
              <p className="mb-2 text-base font-bold">Calculadora rápida <span className="font-medium text-piedra">(opcional)</span></p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Calculadora rápida">
                {FORMULAS.map((fm) => (
                  <Chip key={fm.pct} activo={f.formula === fm.pct} onClick={() => alternarFormula(fm.pct)}>
                    {fm.etiqueta}
                  </Chip>
                ))}
              </div>
              <p className="mt-2 text-sm text-piedra">Extra y Regular son calidad, no rebaja. Los remates sí bajan el precio.</p>
            </div>
            <div>
              <label className="mb-1 block text-base font-bold" htmlFor="final">Precio final (puedes escribir el monto que quieras)</label>
              <input
                id="final"
                type="number"
                inputMode="numeric"
                min="1"
                value={f.rescate || ''}
                onChange={(e) => { cambiarFinal(Number(e.target.value)); setErr((x) => ({ ...x, precio: undefined })) }}
                className="min-h-[48px] w-full rounded-xl border border-borde bg-white px-4 text-base"
              />
            </div>
            {f.normal > 0 && f.rescate > 0 && (
              <p className="text-base font-bold" aria-live="polite">
                <span className="font-titulo text-2xl font-extrabold text-olla">{dinero(f.rescate, ciudad.id)}/{f.unidad}</span>
                {' · '}
                {cambioPct < 0 ? `Rebaja de ${Math.abs(cambioPct)}% frente a tu base` : cambioPct > 0 ? `${cambioPct}% sobre tu base (no es rebaja)` : 'Igual a tu base'}
              </p>
            )}
            <Aviso texto={err.precio} />
          </div>

          <div className="space-y-3 rounded-2xl border border-borde bg-marfil p-3">
            <p className="text-base font-bold">Etiqueta rápida</p>
            <div className="space-y-1">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Por qué está feo">
                {MOTIVOS.map((m) => (
                  <Chip key={m} activo={f.motivo === m} onClick={() => alternar('motivo', m)}>{m}</Chip>
                ))}
              </div>
              <Aviso texto={err.motivo} />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Pa' dónde va">
                <Chip icono={ChefHat} activo={f.nivel === 'cocina'} onClick={() => alternar('nivel', 'cocina')}>Pa' Cocina / Pulpa</Chip>
                <Chip icono={Sprout} activo={cria} onClick={() => alternar('nivel', 'cria')}>Pa' Cría / Abono</Chip>
              </div>
              <Aviso texto={err.nivel} />
            </div>
            {f.nivel === 'cocina' && (
              <div className="space-y-1">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Uso ideal">
                  {USOS.map((u) => (
                    <Chip key={u} activo={f.uso === u} onClick={() => alternar('uso', u)}>{u}</Chip>
                  ))}
                </div>
                <Aviso texto={err.uso} />
              </div>
            )}
            <div className="space-y-1">
              <label className="flex min-h-[48px] cursor-pointer items-start gap-3 text-base font-semibold">
                <input
                  type="checkbox"
                  checked={f.apto}
                  onChange={(e) => { poner({ apto: e.target.checked }); setErr((x) => ({ ...x, apto: undefined })) }}
                  className="mt-0.5 h-6 w-6 shrink-0 accent-[#1B5E3A]"
                />
                {cria
                  ? "Confirmo que este lote va pa' cría o abono, no pa' la mesa."
                  : "Confirmo que está apto pa' comer: nada podrido ni vencido."}
              </label>
              <Aviso texto={err.apto} />
            </div>
          </div>

          {f.normal > 0 && f.rescate > 0 && (
            <p className="rounded-xl border border-borde bg-white p-3 text-base" aria-live="polite" data-vista-previa>
              <b>Así lo verá el comprador:</b> {dinero(f.rescate, ciudad.id)}/{f.unidad}{' · '}
              {info.rebaja ? (
                <><b className="text-[#A8391B]">Rebaja −{info.pct}%</b> (antes {dinero(f.normal, ciudad.id)})</>
              ) : info.etiqueta ? (
                <b className="text-olla">{info.etiqueta}</b>
              ) : (
                <span className="text-piedra">precio normal, sin rebaja</span>
              )}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Button variante="suave" onClick={() => setPaso(2)}>Atrás</Button>
            <Button onClick={publicar}>Publicar lote</Button>
          </div>
        </div>
      )}
    </Card>
  )
}
