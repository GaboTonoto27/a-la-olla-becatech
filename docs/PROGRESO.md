# Progreso — Cierre integral del prototipo (sin commit; listo pa' Vercel tras tu revisión)
- Transparencia: etiqueta "Respuesta automática de prototipo" en `/chat` (mensajes `auto`) y desplegable "Metodología y alcance del prototipo" (campo / simulación / proyección) en `/cuenta` y `/admin`.
- `/admin` ahora tiene 7 pestañas; nueva "Analítica y Data Science" (`src/lib/analitica.js`, `TabAnalitica.jsx`, solo CSS): KPIs en vivo, barra circular Cocina vs Cría, franjas horarias y simulador What-If (CO₂e con factor FAO 2,5 kg/kg citado).
- Denuncias: puntaje de riesgo 0–100 explicable (palabras clave 50 + faltas 30 + rechazos 20), heurística local lista pa' ML.
- Pulido: `ventaBloqueada` eliminada; "Tu barrio" opcional en modal Google/Facebook; enlaces del encabezado a 48 px; `¿Ayuda?` va dentro de la barra inferior en móvil (ya no tapa nada) y redondo en escritorio; interruptores con área táctil de 48 px.
- QA Playwright (375x812 y 1280x800): login/OTP/Google, `/admin` bloqueado a compradores, rutas de comprador y vendedor, ajuste de precio, PDF jsPDF, 7 pestañas admin, recarga en `/ultima-hora` y 404: 0 errores de consola, 0 desborde horizontal.
- `npm run build` OK: JS inicial 103,7 kB gz (< 150). Pendiente: tu revisión, `git commit`/`push` y Vercel.
