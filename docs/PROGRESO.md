# Progreso — Bloque 4 + 4 ajustes (falta tu revisión en el navegador)
- Producto real: `/login` (Crear cuenta / Iniciar sesión, OAuth simulado), puesto en 1 pantalla con mapa/GPS, rol por cuenta, `/admin` solo pa' `admin@alaolla.co`, zona fija Ciudadela 20 de Julio. Mapa Leaflet con "Cómo llegar"/Waze, chat seguro, reseñas verificadas, denuncias, Asistente 24/7, tickets y PDF semanal (`jspdf` dinámico).
- Ajuste 1: "Tu barrio" 100% libre y obligatorio (sin `datalist`, vacío, placeholder "Escribe tu barrio o sector"); `BARRIOS` eliminado.
- Ajuste 2: correo estricto (`src/lib/verificacion.js`) + paso "Confirma tu correo" con código de 6 dígitos y reenvío a 30 s (5 intentos). La cuenta se crea solo con el código bueno. `enviarCodigoVerificacion` usa EmailJS REST por `fetch` si hay `VITE_EMAILJS_*`; si no, tarjeta "Simulación de correo recibido en [correo]" con el código.
- Ajuste 3: devoluciones (`src/lib/devoluciones.js`, `devoluciones` en el store sin subir versión). `/cuenta`: "Mis compras" con "Solicitar devolución / reembolso" y estado en vivo; vendedor con "Garantía y devolución de cuota" (reembolso o saldo a favor). `/admin`: pestaña "Reembolsos y Devoluciones" (aprobar/rechazar con nota, campana y contador).
- Lo aprobado se descuenta de: balance y PDF del vendedor, ahorro del comprador y totales/resultado del mes del Admin.
- Ajuste 4: subtítulo de `/cuenta` sin nombre repetido ("Juguería / Fritos") y un solo punto en "…4:00 p. m. Atendemos ahora."
- `npm run build` OK: JS inicial 103,6 kB gz (< 150); jsPDF y Leaflet en chunks aparte. Lógica de correo y devoluciones probada con script; Playwright NO corrido.
- Pendiente: tu prueba en navegador, `git commit` y pulido final con Impeccable + Playwright.
