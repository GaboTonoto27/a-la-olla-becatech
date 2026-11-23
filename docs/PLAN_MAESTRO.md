# Plan Maestro — "A la Olla" v1.0 (4 bloques, commit + /clear entre cada uno)

## Contexto
Repo vacío de código (solo CLAUDE.md, DESIGN.md, docs/, public/fotos/ con 3 fotos, referencias/). Hay que construir el prototipo PWA para BecaTech (entrega 27-nov-2026 10:00 a.m.; meta 25-nov). Las entrevistas del 22-nov obligan pivotes: efectivo contra inspección, reseñas verificadas por código, Modo Sin Celular, Formal vs Informal, etiquetas Cocina/Cría, ROI vs cuota. **DESIGN.md manda** sobre las referencias (DoorDash/Instacart/Seed solo aportan estructura: chips de filtro, tarjeta de puesto con foto + sellos, mapa con lista de filas, chatbot con preguntas-píldora, panel con 2 cifras grandes + tabla). Nada de rojo DoorDash, amarillo Instacart, lima Seed ni morados.

## Reglas transversales (aplican a todos los bloques)
- Tokens en Tailwind v4 `@theme`: `--color-olla #1B5E3A` (hover `#14472B`), `--color-marfil #FAF8F5`, `--color-borde #E7E2D8`, `--color-tomate #D9532F`, `--color-frio #0E7490` (solo sello refrigeración), `--color-ambar #B45309`, `--color-carbon #1C1F1D`, `--color-piedra #57534E`.
- Fuentes: Bricolage Grotesque 700/800 (títulos) + Plus Jakarta Sans 400–700 vía Google Fonts `<link>` con `display=swap` (0 KB en bundle).
- Botones `min-h-[48px]`, pills, borde 1px, sombra mínima, íconos lucide (nunca emojis), español costeño cálido, cero jerga.
- **Ultraligera:** rutas con `React.lazy` por página; Leaflet y jsPDF solo se cargan en las pantallas que los usan (import dinámico). Meta: bundle inicial < 150 KB gz.
- Persistencia: un solo `src/data/store.js` (localStorage con versión + `resetDemo()`), semilla en `src/data/seed.js`. Estado global con React Context (`AppContext`), sin librería extra.
- Privacidad: el WhatsApp de Edwin NO aparece en la app (chat interno). Compradoras se muestran por nombre de negocio/nombre de pila.

---

## Bloque 1 — Base, rutas, navegación, login demo, Pacto
**Archivos clave**
- `package.json`, `vite.config.js` (plugin react + `@tailwindcss/vite`), `index.html` (fuentes, meta theme-color `#1B5E3A`, viewport), `vercel.json` (rewrite SPA → `/index.html`), `public/manifest.webmanifest` + ícono SVG (instalable tipo PWA, sin service worker).
- `src/main.jsx`, `src/App.jsx` (router + guards), `src/index.css` (@theme).
- `src/context/AppContext.jsx`: usuario actual, modo activo (comprador/vendedor), pacto aceptado, `toggleModo()`.
- `src/data/store.js`, `src/data/seed.js` (usuarios demo).
- `src/components/layout/`: `Header.jsx` (marca + interruptor Comprador/Vendedor si rol "ambos" + menú en `md:`), `BottomNav.jsx` (4 pestañas máx. en móvil: Inicio · Pedidos/Última hora · Mapa · Mi cuenta; cambian según modo), `AppShell.jsx`, `BannerPrototipo.jsx` (franja fina: "Prototipo académico — BecaTech 2027. Datos de prueba").
- `src/components/ui/`: `Button`, `Pill`, `Toggle`, `Card`, `Modal`, `Precio` (tachado + rescate) — base reutilizable para todos los bloques.
- `src/pages/`: `Login.jsx`, `Inicio.jsx` (placeholder por rol), `NoEncontrado.jsx` (404 amable con botón "Volver al inicio"), `admin/AdminInicio.jsx` (placeholder).
- `src/components/PactoCalidad.jsx`: modal obligatorio (solo alimentos aptos; maduro/golpeado/torcido SÍ, podrido/vencido JAMÁS; guardado limpio y tapado fuera de vitrina; pago en efectivo tras revisar). Checkbox + "Acepto el Pacto" → guarda en store; sin aceptar no entra.

**Login:** 3 botones (Google, Facebook, Usuario/Contraseña simulados) + sección "Entrar rápido (jurados)" con 5 tarjetas:
1. Vendedor Formal — Fruver LMC (Edwin) · rol ambos
2. Vendedora Informal — Puesto Ana (Modo Sin Celular activo)
3. Comprador Corrientazo — El Punto Clave (Wilmary)
4. Comprador Hogar — Mercedes (Conidec)
5. Administrador

**Rutas:** `/login`, `/` (inicio por rol), `/pedidos`, `/ultima-hora`, `/mapa`, `/puestos`, `/puestos/:id`, `/chat`, `/chat/:id`, `/ayuda`, `/mi-semana`, `/cuenta`, `/admin/*`, `*` → 404. En Bloque 1 se crean las que existen; el resto se agrega en su bloque.

**Commit:** "Bloque 1: base, rutas, login demo y Pacto de Calidad".

---

## Bloque 2 — Modelo Híbrido con datos reales COP
**Semilla (`seed.js`)** con precios de ENTREVISTAS.md: LMC (tomate $6.400/kg, plátano $1.400/$1.200, zanahoria lb $1.400/$1.200, maracuyá $8.000, naranja $5.500–6.000, guayaba $5.600), El Maná (tomate de árbol $6.200, guayaba $6.200, fruta jugo $4.000, maracuyá $6.000, lulo $8.800), Ana (bolsitas $2.000–$5.000, rescate desde $3.000). Fotos: `/fotos/puesto-lmc.jpg`, `/fotos/lmc-neveras.jpg`, `/fotos/puesto-metrocentro.jpg`; El Maná sin foto → placeholder con ícono `Store`.

**`src/lib/`**: `dinero.js` (formato `$6.400` es-CO), `tiempo.js` (cuenta regresiva hasta cierre 4:00 p.m., sábado resaltado), `lotes.js` (auto-retiro de vencidos al cargar y cada minuto).

**"Pide para tu Olla"** (`src/pages/PidePaTuOlla.jsx` + `src/components/pedidos/`)
- Comprador: formulario corto (qué voy a cocinar · producto · kg · hora de recogida · uso guiso/jugo/sopa). Botón "Encargar temprano".
- Vendedor: lista de pedidos activos → "Ofrecer precio" (sin foto de la fruta). Comprador ve ofertas y elige.
- **Modo Sin Celular en Puesto:** interruptor en el perfil del vendedor; si está activo, el vendedor responde encargos desde casa (ventana horaria, ej. 5–7 a.m. y 8–9 p.m.) y el comprador ve el aviso "Este puesto contesta desde la casa, no en el puesto".

**"Última Hora"** (`src/pages/UltimaHora.jsx` + `src/components/lotes/`)
- Vendedor publica en 3 toques: Producto → Kilos → Precio de rescate (sugerido −20 % / −50 % con botones). Luego Etiqueta Rápida: motivo estético (machucado, muy maduro, torcido, hojas maltratadas), uso ideal, nivel **"Pa' Cocina / Pulpa (100 % sano)"** o **"Pa' Cría / Abono"**, y casilla obligatoria "Confirmo que está apto".
- Tarjeta de lote: precio normal tachado + rescate grande en verde, reloj ámbar, etiqueta de nivel, sellos del puesto.
- Flujo **"Aparta Gratis, Revisa y Paga en Efectivo"**: Apartar → genera código de recogida de 4 dígitos → al llegar: "Lo revisé y me lo llevo" (efectivo; Nequi opcional solo si el puesto es formal) o "Rechazar por calidad" (sin costo, queda registro para el Admin).

**Commit:** "Bloque 2: Pide para tu Olla, Última Hora y flujo Aparta-Revisa-Paga".

---

## Bloque 3 — Estándares dinámicos, puestos y mapa
- `src/data/estandares.js`: catálogo (Refrigeración/cuarto frío [azul], Canastilla tapada fuera de vitrina, Bajo techo y ventilado, Separación inmediata de maduros, Domicilio propio, Acepta Nequi) + texto libre.
- Perfil "Mi puesto" (vendedor): `Toggle` por estándar, se actualiza en 1 toque con fecha "actualizado hoy 7:12 a.m.". Tipo de puesto: **Formal** (con refrigeración) vs **Informal honesto** (sello "Sin nevera — pa' consumo inmediato", nunca oculto).
- `src/pages/Puestos.jsx`: directorio con chips de filtro ("Con refrigeración", "Formal", "Informal", "Abierto ahora", "Acepta encargos") y tarjetas (foto local, nombre, barrio, estrellas verificadas, sellos).
- `src/pages/PerfilPuesto.jsx`: foto, sellos, lotes activos, reseñas (se llenan en Bloque 4), botones "Encargar", "Chatear", "Denunciar este sitio" (form Asunto + Explicación → Admin).
- `src/pages/Mapa.jsx` + `src/components/mapa/MapaPuestos.jsx` (react-leaflet, tiles OSM con atribución): centro Ciudadela 20 de Julio, Barranquilla (~10.9420, -74.7960, zoom 15 — se afina con OSM al implementar). **Privacidad:** antes de apartar se muestra un círculo aproximado (~150 m) y solo el barrio; tras apartar, pin exacto + dirección + botones "Cómo llegar" (Google Maps `https://www.google.com/maps/dir/?api=1&destination=lat,lng`) y Waze (`https://waze.com/ul?ll=lat,lng&navigate=yes`). Lista de puestos bajo el mapa en móvil.

**Commit:** "Bloque 3: estándares dinámicos, directorio, perfil y mapa Leaflet".

---

## Bloque 4 (Sprint 3) — Chat, reseñas, ayuda, panel económico + PDF, admin
- **Chat seguro** (`src/pages/Chat*.jsx`, `src/components/chat/`): conversaciones por apartado/encargo, simulación de respuesta del otro lado; respuestas rápidas de 1 toque ("Ya lo aparté", "Listo pa' recoger", "¿A qué hora pasa?", "Voy en camino"); menú ⋯ con Silenciar, Bloquear, Denunciar chat (asunto + detalle). Nunca muestra teléfonos; filtro de palabras ofensivas y de números de teléfono → alerta al Admin.
- **Reseñas verificadas** (`src/components/resenas/`): solo se habilita calificar tras ingresar el código de recogida del Bloque 2. 1–5 estrellas en puntualidad, trato y aptitud pa' cocinar + "¿Cumplió los sellos que declaró?" (sí/no por sello). Insignia "Compra verificada". Botón visible "Rechazar por calidad / Denunciar engaño".
- **Ayudante 24/7** (`src/components/ayuda/AyudanteFlotante.jsx`): botón flotante; preguntas-píldora listas (¿Cómo aparto?, ¿Cómo pago?, ¿Qué es Pa' Cría?, ¿Cómo publico en 3 toques?, ¿Y si llega feo?) con respuestas paso a paso por reglas/palabras clave (costo $0, sin API externa). Botón "Hablar con soporte" → horario Lun–Sáb 6:00 a.m.–4:00 p.m., coordinador local de la ciudad, crea ticket al Admin.
- **Mi semana + PDF** (`src/pages/MiSemana.jsx`, `src/lib/reportePdf.js` con jsPDF importado dinámicamente):
  - Vendedor: kilos salvados, ventas, plata recuperada, cuota del plan (**Formal $10.000/sem** · **Popular $0–$3.000/sem**) y ROI ("Ganaste $X por cada $1 de cuota").
  - Comprador: kilos comprados y plata ahorrada vs precio normal.
  - Botón "Descargar mi semana (PDF)" → archivo real con marca, tabla y nota de prototipo.
- **Panel Admin** (`src/pages/admin/`): Usuarios (suspender/expulsar), Denuncias (sitio, chat, engaño, rechazos por calidad) con "escuchar ambas partes" y estado, Comentarios marcados por filtro, Tickets de soporte, Cifras globales (kg rescatados, plata recuperada, puestos activos, por ciudad/coordinador).

**Commit:** "Bloque 4: chat seguro, reseñas verificadas, ayudante, PDF semanal y panel admin". Luego push a GitHub + deploy Vercel.

---

## Paquetes exactos a instalar
Base (Bloque 1, `npm create vite@latest . -- --template react` → React 19 + Vite):
```
npm i react-router-dom lucide-react
npm i -D tailwindcss @tailwindcss/vite
```
Bloque 3:
```
npm i leaflet react-leaflet
```
Bloque 4:
```
npm i jspdf
```
Sin librería de estado, de UI, de fechas, de PWA ni de gráficos (las cifras van como números grandes/tablas; si se necesita una barra simple se hace con CSS). Fuentes por Google Fonts `<link>`.

## Verificación (al final de cada bloque)
1. `npm run build` sin errores y revisar tamaño de chunks.
2. `npm run dev` + Playwright MCP: viewport 375×812 y 1280×800, recorrer el flujo del bloque con cada cuenta demo, screenshot.
3. Revisar consola sin errores; botones ≥48 px; contraste; cero emojis/morados.
4. Skill `qa-movil` / `diseno-pro` en el Bloque 4 antes del deploy; probar 404, recarga en ruta profunda (rewrite Vercel) y descarga del PDF.