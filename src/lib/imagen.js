// Comprime una foto subida: máx. ~600 px de lado y JPEG 0.7, pa' no desbordar localStorage.
export const MAX_FOTOS = 4

export function comprimirImagen(archivo, max = 600, calidad = 0.7) {
  return new Promise((resolver, rechazar) => {
    if (!archivo?.type?.startsWith('image/')) return rechazar(new Error('Ese archivo no es una foto.'))
    const url = URL.createObjectURL(archivo)
    const img = new Image()
    img.onload = () => {
      const escala = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.max(1, Math.round(img.width * escala))
      c.height = Math.max(1, Math.round(img.height * escala))
      const ctx = c.getContext('2d')
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, c.width, c.height)
      ctx.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolver(c.toDataURL('image/jpeg', calidad))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      rechazar(new Error('No pudimos leer esa foto.'))
    }
    img.src = url
  })
}
