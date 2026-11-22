# PROYECTO: "A la Olla" (Versión 1.0) — Builder Case BecaTech Cohorte 2027

## 1. CONTEXTO Y REGLAS DEL RETO
- **Objetivo:** Crear una Web App prototipo 100% funcional (móvil y PC, estilo PWA sin descargas) para el reto Builder Case de Ver+ Beca Tech (VélezReyes+).
- **Fecha límite oficial:** 27 de noviembre de 2026 a las 10:00 a.m.
- **Meta personal:** Prototipo y PDF terminados el 25 de noviembre; QA total el 26 de noviembre.
- **Problema base del caso:** En una plaza de mercado de 120 puestos (~35 de frutas y verduras), se botan ~400 kg/semana de comida perfectamente comestible pero de mal aspecto (plátano machucado, tomate muy maduro, zanahoria torcida, lechuga maltratada) valorada en ~$2.500 COP/kg ($1.000.000 COP/semana). Razones base: espanta clientes y miedo a moscas/multas del inspector de sanidad. El sábado en la tarde es el día crítico porque la plaza cierra el domingo.
- **Contexto real de campo:** Barranquilla, Colombia (clima muy caluroso, donde la refrigeración y conservación rápida son críticas).
- **Las 4 condiciones obligatorias que la solución debe respetar siempre:**
  1. **El inspector existe:** Nunca fomentar exhibir comida maltratada ni vender comida dañada; actuar preventivamente ANTES de que pierda aptitud de consumo humano.
  2. **Sostenibilidad financiera:** Sin depender de donaciones ni subsidios (usar herramientas/APIs de costo $0 en el prototipo y modelo autosostenible por microcomisión/suscripción).
  3. **Confianza con vendedores mayores (+25 a 60+ años):** Cero jerga técnica, ultra intuitiva, sin necesidad de tutorial, botones grandes, alto contraste (pensada para usarse bajo el sol y con las manos ocupadas).
  4. **Escalable a otro país de Latinoamérica sin depender del creador:** El soporte humano y la administración deben estar planteados para operar por coordinadores locales al expandirse.
- **Principio guía:** "Lo mínimo que funciona vale más que algo perfecto que nunca llega a existir".

## 2. ARQUITECTURA FUNCIONAL CONGELADA (A LA OLLA V1.0)
Todas las funciones siguientes deben estar implementadas de forma limpia, interactiva y coherente:

### Bloque 1: Modelo Híbrido de Rescate
1. **Modo Principal — "Pide para tu Olla" (Demanda Inversa):** Cualquier persona (restaurantes, corrientazos, juguerías, fritos o vecinos/familias) publica qué necesita cocinar hoy, cantidad (kg) y hora exacta de recogida. Los vendedores ven pedidos activos y ofertan precio sin exhibir ni fotografiar fruta fea.
2. **Modo Respaldo — "Última Hora" (Rescate Relámpago):** Faltando pocas horas para el cierre (clave sábados), el vendedor publica sobrantes sin pedido previo en máximo 3 toques (Tipo/Producto + Kilos + Precio de rescate).

### Bloque 2: Acceso, Roles y Mapa en Tiempo Real
- **Login simple (3 opciones):** Continuar con Google, Continuar con Facebook, o Usuario y Contraseña (simulados de forma fluida para demo + acceso rápido de prueba para evaluadores).
- **Cuenta Unificada (Híbrida):** El usuario elige su perfil principal (*Comprador*, *Vendedor* o *Ambos*) y puede alternar entre modo Comprador y Vendedor con un interruptor sin crear dos cuentas.
- **Rol Administrador:** Panel separado con control total de usuarios, moderación de denuncias/comentarios, tickets de soporte y métricas globales.
- **Mapa Interactivo ($0 costo):** Integrar **OpenStreetMap + Leaflet** mostrando pines de puestos registrados. Al hacer clic en la dirección de un puesto, ofrecer botón directo de **"Cómo llegar"** que abre la ruta en Google Maps / Waze.

### Bloque 3: Calidad Preventiva, Estándares Dinámicos y Marco Legal
- **Términos, Condiciones y Pacto de Alimentos Aptos:** Modal obligatorio antes de ingresar a usar la app. Deja claro que solo se comercian alimentos aptos para consumo humano (maduros, golpeados o deformes, JAMÁS podridos/vencidos) y que se guardan limpios/tapados fuera de vitrina.
- **Perfil del Puesto (sin fotografiar fruta diaria):** 1 foto del local limpio + dirección + **Estándares de Calidad Dinámicos**:
  - Botones activables/desactivables en tiempo real por el vendedor según su estado actual (ej. *"Cuenta con refrigeración / cuarto frío"*, *"Canastilla tapada fuera de vitrina"*, *"Local bajo techo y ventilado"*, *"Separación inmediata de maduros"*). Si se le daña la nevera o compra una, lo actualiza en 1 toque.
  - Campo de texto libre para estándares propios del vendedor.
  - El comprador puede ver estos sellos, filtrar por ellos (ej. "Con refrigeración") y confirmar en su reseña si el puesto cumplió lo declarado.
- **Etiqueta Rápida de Aptitud + Reloj de Caducidad Automática:** Al publicar/aceptar un lote, el vendedor marca motivo estético, uso ideal (guiso/jugo/sopa) y confirma aptitud humana. Cada lote tiene cuenta regresiva antes del cierre; si vence, se retira automáticamente para que nunca circule producto en mal estado.

### Bloque 4: Confianza, Reseñas y Chat Seguro Interno
- **Valoraciones (1 a 5 estrellas) y Comentarios:** Evaluando puntualidad, trato y aptitud para cocinar. Filtro básico que alerta al Admin ante palabras ofensivas.
- **Botón "Denunciar este sitio":** Sin checklist rígida; formulario abierto con **Asunto** y **Explicación detallada** que llega directo al Panel de Administrador para investigar escuchando ambas partes.
- **Chat interno Comprador-Vendedor:** Evita compartir teléfonos personales. Incluye **botones de respuesta rápida de 1 toque** (*"Ya lo aparté"*, *"Listo pa' recoger"*, *"¿A qué hora pasa?"*, *"Voy en camino"*) + menú de seguridad en cada chat con **Silenciar**, **Bloquear** y **Denunciar chat** (con asunto y detalle libre al Admin).

### Bloque 5: Acompañamiento, Panel Admin y Reporte Semanal en PDF
- **ChatBot IA Guía 24/7:** Botón flotante que resuelve dudas frecuentes paso a paso en lenguaje de calle sin tecnicismos.
- **Soporte Especializado con Horario:** Botón *"Contactar soporte especializado"* dentro del asistente/ayuda que muestra días y horario de atención (ej. Lun–Sáb 6:00 a.m. a 4:00 p.m.) y envía un ticket al Panel Admin (con opción opcional de correo/FormSubmit). Diseñado bajo modelo escalable por coordinadores locales.
- **Reporte Semanal Descargable en PDF (Funcional):** Botón real usando `jsPDF` (o equivalente en navegador) tanto para Vendedor (kilos salvados, ventas y plata recuperada semanal) como para Comprador (kilos comprados y dinero ahorrado semanal).

## 3. STACK TECNOLÓGICO Y METODOLOGÍA DE TRABAJO
- **Stack:** React + Vite + Tailwind CSS + Lucide Icons + Leaflet (mapas gratis) + jsPDF (descarga real de PDF).
- **Persistencia para el prototipo:** `localStorage` con datos realistas precargados (puestos, pedidos y lotes en COP) para que cualquier jurado entre al link de Vercel y pruebe todo al instante sin configurar servidores ni bases de datos.
- **Diseño:** Mobile-first (impecable en celular y escritorio), tipografía clara, paleta cálida y fresca de mercado (verdes frescos, tonos tierra/naranja suave, alto contraste).
- **Arquitectura modular:** Componentes bien separados para facilitar futuras actualizaciones o integraciones con otros proyectos.
- **Forma de trabajo (Scrum incremental):**
  1. Primero confirma que entendiste el contexto y NO generes código todavía hasta recibir los resultados de las entrevistas de campo.
  2. Luego construiremos por Sprints: **Sprint 2** (Core: Login/Términos, Roles, Modelo Híbrido, Perfiles/Estándares dinámicos, Mapa) y **Sprint 3** (Chat seguro, Reseñas/Denuncias, ChatBot + Soporte, Panel Admin, Reporte PDF y pulido UI/UX).
  3. Despliegue final en GitHub + Vercel con link directo funcional.