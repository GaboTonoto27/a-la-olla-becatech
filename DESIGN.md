# GUÍA DE ESTÉTICA Y UI/UX — "A LA OLLA" (CERO LOOK GENÉRICO DE IA)

## 1. PERSONALIDAD VISUAL
- **Inspiración:** Mercado fresco de barrio moderno, cálido, limpio y honesto (piensa en madera clara, hojas verdes, tomate maduro y papel limpio; NUNCA estética fría de cripto/tech ni SaaS morado).
- **Entorno real de uso:** Celulares de gama media/baja en Barranquilla, usados a plena luz del sol por vendedores mayores de 25 a 60+ años con las manos ocupadas.

## 2. PROHIBICIONES ESTRICTAS (ANTI "AI SLOP")
- PROHIBIDO usar degradados morados, azules neón o fondos oscuros estilo futurista.
- PROHIBIDO llenar botones o títulos de emojis (🍅🥬🔥); usa SIEMPRE íconos vectoriales de `lucide-react`.
- PROHIBIDO usar sombras pesadas o bordes chillones; usa bordes sutiles de 1px (`border-stone-200`) y sombras mínimas.
- PROHIBIDO amontonar demasiada información en una tarjeta; respira con espacio en blanco generoso.
- PROHIBIDO usar jerga técnica en los textos visibles (nada de "Marketplace", "B2B", "Dashboard", "Latencia"). Usa español colombiano cálido y directo ("Tu puesto", "Pide pa' la olla", "Última hora", "Ahorro de la semana").

## 3. PALETA DE COLORES (ALTO CONTRASTE AL SOL)
- **Fondo principal:** Crema cálido / papel limpio `#FAF8F5` (no blanco clínico `#FFFFFF` puro).
- **Superficies / Tarjetas:** Blanco `#FFFFFF` con borde suave `#E7E2D8`.
- **Color primario (Confianza / Frescura):** Verde Mercado Profundo `#1B5E3A` (hover `#14472B`).
- **Color acento (Urgencia / Última Hora / Tomate):** Terracota Cálido `#D9532F`.
- **Color alerta suave (Estándar / Refrigeración):** Azul Fresco `#0E7490` (solo para el sello "Cuenta con refrigeración") y Ámbar `#B45309` para avisos de cierre próximo.
- **Texto principal:** Carbón oscuro `#1C1F1D` (contraste AAA).
- **Texto secundario:** Piedra `#57534E`.

## 4. TIPOGRAFÍA Y USABILIDAD MÓVIL
- **Títulos y marca ("A la Olla"):** `Bricolage Grotesque` (peso 700/800) desde Google Fonts.
- **Cuerpo, precios y botones:** `Plus Jakarta Sans` (peso 400, 500, 600, 700).
- **Tamaño táctil mínimo:** Todos los botones principales deben medir al menos `48px` de alto (`min-h-[48px]`) para tocarse fácil sin equivocarse.
- **Navegación móvil:** Barra inferior fija (Bottom Navigation Bar) con máximo 4 pestañas claras en móvil, y barra superior limpia en escritorio (`md:` y `lg:`).
- **Jerarquía de precios:** Precio normal tachado en pequeño + precio de rescate en grande y negrita en Verde Mercado (`$1.200/kg`).
- **Estándares dinámicos:** Usar interruptores (`Toggle / Switch`) claros y etiquetas tipo píldora (*pills*) legibles en la ficha de cada puesto.