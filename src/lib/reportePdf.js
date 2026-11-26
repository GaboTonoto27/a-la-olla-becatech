// Reporte semanal en PDF. Este archivo solo se carga al tocar "Descargar", y jsPDF se carga recién ahí.
import { textoRescate } from './economia.js'
const dinero = (n) => '$' + new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(Math.round(n))
const dia = (t) => new Date(t).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' })
const diaLargo = (t) => new Date(t).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
const VERDE = [27, 94, 58]
const PIEDRA = [87, 83, 78]
const CARBON = [28, 31, 29]

// datos: { vendedor, nombre, puesto, plan, planTexto, resumen }
export async function descargarReporte(datos) {
  const { jsPDF } = await import('jspdf')
  const { vendedor, nombre, puesto, planTexto, resumen: r } = datos
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const ancho = 210
  let y = 0

  doc.setFillColor(...VERDE)
  doc.rect(0, 0, ancho, 32, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.text('A la Olla', 15, 16)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(12)
  doc.text(vendedor ? 'Reporte semanal del vendedor' : 'Reporte semanal del comprador', 15, 25)

  y = 44
  doc.setTextColor(...CARBON)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text(vendedor ? puesto : nombre, 15, y)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(...PIEDRA)
  y += 7
  if (vendedor) {
    doc.text(`Responsable: ${nombre}`, 15, y)
    y += 6
  }
  doc.text(`Semana: ${dia(r.desde)} al ${dia(r.hasta)}  |  Generado el ${diaLargo(Date.now())}`, 15, y)

  // Cifras principales
  y += 12
  const cifras = vendedor
    ? [['Rescatado', textoRescate(r.kilos, r.bolsas)], ['Ingresos de la semana', dinero(r.ingresos)], ['Entregas completadas', String(r.entregas.length)]]
    : [['Comprado', textoRescate(r.kilos, r.bolsas)], ['Plata ahorrada', dinero(r.ahorro)], ['Compras completadas', String(r.entregas.length)]]
  cifras.forEach(([etiqueta, valor], i) => {
    const x = 15 + i * 62
    doc.setDrawColor(231, 226, 216)
    doc.roundedRect(x, y, 58, 24, 3, 3)
    doc.setTextColor(...VERDE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(15)
    doc.text(valor, x + 4, y + 11)
    doc.setTextColor(...PIEDRA)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(etiqueta, x + 4, y + 19)
  })

  // Detalle de entregas
  y += 36
  doc.setTextColor(...CARBON)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(vendedor ? 'Detalle de entregas' : 'Detalle de compras', 15, y)
  y += 7
  doc.setFontSize(10)
  doc.setFillColor(244, 249, 245)
  doc.rect(15, y - 5, 180, 7, 'F')
  doc.text('Fecha', 17, y)
  doc.text('Producto', 40, y)
  doc.text(vendedor ? 'Comprador' : 'Puesto', 100, y)
  doc.text('Cantidad', 140, y)
  doc.text('Valor', 193, y, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  y += 7
  if (r.entregas.length === 0) {
    doc.setTextColor(...PIEDRA)
    doc.text('Aun no hay entregas confirmadas esta semana.', 17, y)
    y += 7
  }
  for (const a of r.entregas) {
    if (y > 265) {
      doc.addPage()
      y = 20
    }
    doc.setTextColor(...CARBON)
    doc.text(dia(a.actualizado ?? a.creado), 17, y)
    doc.text(String(a.producto).slice(0, 26), 40, y)
    doc.text(String(vendedor ? a.comprador.nombre : a.puesto).slice(0, 24), 100, y)
    doc.text(`${a.cantidad} ${a.unidad}`, 140, y)
    doc.text(dinero(a.total), 193, y, { align: 'right' })
    y += 6.5
  }

  // Balance frente a la cuota
  if (vendedor) {
    if (y > 235) {
      doc.addPage()
      y = 20
    }
    y += 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(...CARBON)
    doc.text('Balance frente a la cuota', 15, y)
    y += 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    const filas = [
      ['Plan', planTexto],
      ['Ganado en la semana', dinero(r.ingresos)],
      ...(r.devuelto > 0 ? [['Devoluciones a compradores (ya descontadas)', `- ${dinero(r.devuelto)}`]] : []),
      ['Cuota de la semana', dinero(r.cuota)],
      ...(r.cuotaDevuelta > 0 ? [['Cuota devuelta (aprobada)', `+ ${dinero(r.cuotaDevuelta)}`]] : []),
      ...(r.saldoFavor > 0 ? [['Saldo a favor para la proxima cuota', dinero(r.saldoFavor)]] : []),
    ]
    for (const [k, v] of filas) {
      doc.setTextColor(...PIEDRA)
      doc.text(k, 17, y)
      doc.setTextColor(...CARBON)
      doc.text(v, 193, y, { align: 'right' })
      y += 7
    }
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...VERDE)
    doc.text('Te quedan', 17, y)
    doc.text(dinero(r.balance), 193, y, { align: 'right' })
    y += 7
    if (r.roi) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(...PIEDRA)
      doc.text(`Por cada $1 de cuota, recuperaste ${String(r.roi).replace('.', ',')}.`, 17, y)
      y += 6
    }
  }

  if (!vendedor && r.devuelto > 0) {
    y += 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...PIEDRA)
    doc.text(`Reembolsos aprobados esta semana: ${dinero(r.devuelto)} (ya no cuentan como ahorro).`, 17, y)
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...PIEDRA)
  doc.text('Prototipo academico BecaTech 2027. Datos de prueba guardados en este navegador. Pagos siempre en efectivo contra inspeccion.', 15, 288)

  doc.save(`reporte-semanal-a-la-olla-${new Date().toISOString().slice(0, 10)}.pdf`)
}
