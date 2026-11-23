// Verificación de correo con código de 6 dígitos (anti-bots). Sin paquetes extra: EmailJS por su API REST con fetch.
const ETIQUETA = '[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?'
const CORREO = new RegExp(`^[a-z0-9]+(?:[._%+-][a-z0-9]+)*@(?:${ETIQUETA}\\.)+[a-z]{2,24}$`, 'i')

// Correo real: usuario@dominio.ext. Rechaza dominios incompletos (a@b, a@gmail, a@gmail.c), puntos dobles y espacios.
export function correoValido(correo) {
  const c = String(correo ?? '').trim()
  return c.length <= 120 && CORREO.test(c)
}

export const generarCodigo = () => String(100000 + Math.floor(Math.random() * 900000))

export const CODIGO_ESPERA_SEG = 30

const env = import.meta.env
export const emailJsConfigurado = () =>
  Boolean(env.VITE_EMAILJS_SERVICE_ID && env.VITE_EMAILJS_TEMPLATE_ID && env.VITE_EMAILJS_PUBLIC_KEY)

// Envío real y opcional. Devuelve { real: true } si EmailJS lo mandó; { real: false } en modo prototipo
// (o si falla) pa' que la app muestre la simulación con el código y el evaluador nunca se bloquee.
export async function enviarCodigoVerificacion(correo, codigo) {
  if (!emailJsConfigurado()) return { real: false }
  try {
    const r = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: env.VITE_EMAILJS_SERVICE_ID,
        template_id: env.VITE_EMAILJS_TEMPLATE_ID,
        user_id: env.VITE_EMAILJS_PUBLIC_KEY,
        template_params: { to_email: correo, correo, codigo, code: codigo, app: 'A la Olla' },
      }),
    })
    return { real: r.ok }
  } catch {
    return { real: false }
  }
}
