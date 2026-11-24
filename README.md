# 🍲 A la Olla — Rescate de Excedentes Agrícolas en Barranquilla

> **Builder Case · BecaTech+ — Universidad de los Andes**  
> **Prototipo en vivo:** [https://a-la-olla.vercel.app](https://a-la-olla.vercel.app)

**A la Olla** es una aplicación web progresiva de economía circular diseñada a partir de **6 entrevistas bilaterales de campo en Barranquilla** (Ciudadela 20 de Julio, 7 de Abril y Conidec) para reducir la merma diaria de frutas y verduras en plazas, fruvers y puestos populares.

Conecta a comerciantes formales e informales con hogares y corrientazos bajo un **modelo híbrido** —encargos matutinos (5:00 a. m. – 8:00 a. m.) y remates de última hora (1:00 p. m. – 4:00 p. m.)—, operando con **pago contra inspección**, privacidad por diseño y autosostenibilidad financiera sin subsidios.

---

## ✨ Funcionalidades Principales

* **Interfaz de dos caras según el rol real:**
  * **Compradores (*"Pide pa' tu olla"*):** exploración de lotes en remate, encargos matutinos, mapa con zona de privacidad, chat seguro y seguimiento de ahorro semanal.
  * **Vendedores (*"Pon pa' la olla"*):** publicación rápida con calculadora coherente (*Extra +40%*, *Regular +20%* o remate real), etiquetas dinámicas, *Modo Sin Celular*, panel de ganancias con consejos automáticos y descarga de **reporte semanal en PDF**.
  * **Cuentas híbridas (*"Compro y vendo"*):** interruptor para alternar ambas perspectivas manteniendo el rol correcto en cada hilo de chat.
* **Separación sanitaria estricta:** distinción clara entre **Pa' Cocina / Pulpa (100% sano)** y **Pa' Cría / Abono**, con opción editable *"Otros"*.
* **Privacidad y confianza por diseño:** sin exposición de números telefónicos; validación mediante códigos de entrega `OLLA-###`, mapa dual (pin exacto para locales formales y radio protegido para puestos informales) y reseñas verificadas.
* **Panel Administrativo y Data Science (`/admin`):**
  * Modelo financiero **0% subsidios** (punto de equilibrio en **9 puestos formales** con cuota fija de `$10.000 COP/sem` y Plan Popular `$0–$3.000 COP/sem`).
  * Simulador **What-If** de escalamiento con cálculo de toneladas rescatadas y $CO_2e$ evitado (factor FAO: `2,5 kg CO₂e / kg`).
  * Copiloto de moderación con puntaje de riesgo determinístico (`0–100`), gestión de reembolsos con integridad contable y hoja de ruta de expansión para Latinoamérica.

---

## 🔑 Accesos Demo para Evaluación

En [`/login`](https://a-la-olla.vercel.app/login) puedes ingresar en **1 clic** o usar estas credenciales:

| Perfil | Correo | Contraseña | Qué explorar |
| :--- | :--- | :--- | :--- |
| **Vendedor Formal (Fruver LMC)** | `edwin@fruverlmc.co` | `123456` | *Pon pa' la olla*, `/ganancias`, reporte PDF semanal y chat de vendedor |
| **Administrador & Data Science** | `admin@alaolla.co` | `AdminOlla2026*` | `/admin`: sostenibilidad, simulador *What-If*, denuncias y reembolsos |
| **Compradora / Vendedora Informal** | *Acceso 1 clic en `/login`* | — | Perspectiva de compra (*Wilmary*) y puesto popular (*Ana*) |

---

## 🛠️ Stack Técnico y Alcance del Prototipo

* **Frontend:** React + Vite + Tailwind CSS (bundle inicial optimizado **< 110 kB gz**).
* **Arquitectura de prototipo:** Persistencia local en `localStorage` con datos operativos simulados para permitir pruebas inmediatas sin fricción de servidor. El siguiente paso de producción contempla migración a backend transaccional (PostgreSQL/Supabase) y notificaciones reales.
* **Horario inteligente:** Detecta la hora real del navegador frente al horario de plaza (5:00 a. m. – 4:00 p. m.) y activa automáticamente el modo demostración fuera de jornada para facilitar evaluaciones nocturnas.

### Ejecución local

```bash
npm install
npm run dev

### Para generar el build de producción:
npm run build

📍 Validación de Campo y Autoría
Investigación: 6 entrevistas bilaterales presenciales en Barranquilla (Ciudadela 20 de Julio, 7 de Abril y Conidec) a comercios formales (Fruver LMC), puestos informales, corrientazos (El Punto Clave) y hogares.

Autor: Gabriel Andrés Múnera Rocha · Barranquilla, Colombia.

Contexto: Reto Builder Case — BecaTech+ · Universidad de los Andes (Noviembre de 2026).
