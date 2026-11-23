# Progreso — Bloque 2 listo (falta tu revisión en el navegador)
- Pacto compacto (cabe en 720 px, "Jamás" visible) con línea de etiqueta Cría / Abono. Selector de plaza en la barra superior: Barranquilla · Piloto Activo, Bogotá, Medellín, CDMX (moneda y lotes demo por plaza).
- `/ultima-hora`: catálogo con fotos reales (Barranquilla) o ícono (otras plazas), precio tachado, reloj/barra, filtros por categoría y Cocina/Cría. Apartar gratis genera código `OLLA-###`, descuenta stock en localStorage; comprador revisa y se lleva o rechaza.
- `/pedidos`: comprador encarga (qué, kilos, hora, presupuesto); vendedor responde en 2 toques y comprador elige oferta.
- Vendedor: publicar en 3 pasos + etiqueta rápida, Modo Sin Celular (aviso al comprador), apartados con perfil del comprador, retirar lotes. Inicio con cifras vivas por rol.
- Datos: `store.js` v2, `semilla.js`, `lib/acciones.js` (reglas puras). Lotes demo se renuevan al abrir; los vencidos se ocultan solos. `npm run build` OK (JS inicial 93 KB gz). Sin Playwright aún.
- Sigue: Bloque 3 (estándares dinámicos, puestos, mapa Leaflet).
