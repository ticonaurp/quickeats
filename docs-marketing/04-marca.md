# 04 · Identidad de marca de QuickEats (extraída del código)

> Todo lo de este documento sale del código del frontend (`frontend/app/`). En el código, el sistema de diseño se llama **"Mango"** (aparece como "Mango Theme" y "sistema de diseño Mango V2.5").

---

## 1. Nombre y concepto

- **Nombre:** QuickEats ("Quick" = rápido, "Eats" = comer).
- **Concepto de color:** "Mango", una paleta cálida de ámbar y naranja que transmite energía, apetito y rapidez, sobre fondos claros y bloques en azul pizarra muy oscuro.
- **Ubicación declarada:** "Tu delivery favorito en Lima" · "Lima, Perú".

---

## 2. Logo

**No existe un archivo de imagen del logo.** El logo está construido con código (HTML y CSS) y se repite en 3 lugares:
- `frontend/app/components/Navbar.tsx` (landing, login y registro)
- `frontend/app/components/TopNavbar.tsx` (pantallas del cliente)
- `frontend/app/admin/components/Sidebar.tsx` (panel admin)

**Cómo es:**
1. **Isotipo:** un cuadrado de 32 × 32 px con esquinas redondeadas (radio de unos 12 px), relleno con un **degradado diagonal de ámbar `#F59E0B` a naranja `#F97316`**, una letra **"Q" blanca** en peso Black (900) y una sombra naranja suave.
2. **Logotipo:** la palabra **Quick**Eats en peso Black (900), 20 px, con las letras juntas: "Quick" en azul pizarra `#0F172A` y "Eats" en ámbar `#F59E0B` (al pasar el mouse cambia a naranja `#F97316`).

```
 ┌────┐
 │ Q  │  Quick Eats
 └────┘  ^^^^^ ^^^^
 degradado  #0F172A  #F59E0B
 #F59E0B→#F97316
```

**Otros archivos de imagen:**
- `frontend/app/favicon.ico` (25 931 bytes) tiene el mismo tamaño que el ícono que Next.js trae por defecto, así que **probablemente no es un ícono de marca**.
- `frontend/public/` solo contiene íconos de plantilla de Next.js (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`). Ninguno es de QuickEats.

> **Para el informe y Figma:** conviene recrear el logo como vector con las medidas y colores de arriba, y exportarlo en PNG y SVG.

---

## 3. Paleta de colores

### Colores de marca
| Rol | Nombre | Hex | Dónde se usa |
|---|---|---|---|
| **Primario (mango)** | Ámbar 500 | `#F59E0B` | Color principal: logo ("Eats"), enlaces, botón del CTA final, gráficos del panel admin, selección de texto. |
| **Primario (acción)** | Naranja 500 | `#F97316` | Botones de carrito y checkout, ícono de "+", bordes de foco, pasos del checkout. Es el color con más apariciones directas en el código. |
| **Hover / énfasis** | Naranja 600 | `#EA580C` | Estado al pasar el mouse en botones naranja; cabecera del catálogo (degradado). |
| **Mango acento** | Mango | `#FFB800` | Pin con forma de casita en el mapa del checkout. |
| **Ámbar oscuro** | Ámbar 600 | `#D97706` | Enlaces ("Regístrate gratis", "Ver todos") y final de los degradados. |

### Degradados de marca
| Uso | Degradado |
|---|---|
| Logo, botones principales, píldora de categoría activa | `#F59E0B → #F97316` |
| Titular de la landing ("en tiempo récord.") y texto de login | `#F59E0B → #F97316 → #D97706` |
| Cabecera del catálogo del cliente | `#F59E0B → #EA580C` |

### Neutros
| Rol | Nombre | Hex |
|---|---|---|
| Texto principal y fondos oscuros (hero de login y registro, CTA final, bloque "30 min") | Pizarra 900 | `#0F172A` |
| Fondo oscuro del registro | Pizarra 950 | `#020617` |
| Texto secundario | Pizarra 500 | `#64748B` |
| Texto terciario y placeholders | Pizarra 400 | `#94A3B8` |
| Bordes | Pizarra 100 / 200 | `#F1F5F9` / `#E2E8F0` |
| Fondo general de la web | Pizarra 50 | `#F8FAFC` |
| Tarjetas | Blanco | `#FFFFFF` |
| Fondos suaves de marca | Ámbar 50 / Naranja 50 | `#FFFBEB` / `#FFF7ED` |

### Colores de estado del pedido (usados en "Mis pedidos" y en el admin)
| Estado | Texto | Fondo |
|---|---|---|
| Recibido / Pendiente | `#4B5563` | `#F3F4F6` |
| Cocina / En preparación | `#B45309` | `#FEF3C7` |
| En camino | `#C2410C` | `#FFEDD5` |
| Entregado | `#15803D` | `#DCFCE7` |
| Cancelado | `#DC2626` | `#FEE2E2` |

### Paleta de gráficos (panel admin)
`#F59E0B` · `#3B82F6` · `#22C55E` · `#8B5CF6` · `#EF4444` · `#14B8A6` · `#EC4899` (empieza en mango para alinearse con la marca).

---

## 4. Tipografías

Cargadas desde Google Fonts en `frontend/app/layout.tsx`:

| Fuente | Pesos | Uso previsto |
|---|---|---|
| **Poppins** | 400, 500, 600, 700, 900 | Títulos, logotipo, números grandes ("30 min"). En el código aparece como `font-poppins`. |
| **Plus Jakarta Sans** | 400, 500, 600, 700, 800 | Texto general (párrafos, botones, formularios). |

**Estilo tipográfico de los títulos:** peso **Black (900)** o ExtraBold (800), letras muy juntas (*tracking* apretado) e interlineado corto. Etiquetas pequeñas en **MAYÚSCULAS** con letras separadas (por ejemplo "FUERA DE HORARIO", "PANEL ADMIN").

> ⚠️ **Nota técnica:** la configuración de estilos (`globals.css`) no termina de enlazar estas fuentes con las clases que las usan, así que en el navegador podría verse una fuente del sistema. **Para Figma y el informe, usar Poppins (títulos) y Plus Jakarta Sans (texto)**, que son las fuentes oficiales declaradas.

---

## 5. Estilo visual de los componentes

| Elemento | Estilo |
|---|---|
| **Esquinas** | Muy redondeadas: tarjetas de 24 a 32 px, botones de 12 a 16 px, píldoras totalmente redondas. |
| **Sombras** | Suaves y amplias, a veces teñidas de naranja en los botones de marca. |
| **Tarjetas** | Fondo blanco, borde gris muy claro (`#F1F5F9`), se elevan un poco al pasar el mouse. |
| **Botón primario** | Degradado ámbar → naranja, o fondo pizarra `#0F172A` que cambia a ámbar al pasar el mouse. Texto blanco en negrita. |
| **Botón secundario** | Blanco con borde gris claro y texto pizarra. |
| **Etiquetas (badges)** | Pequeñas, en MAYÚSCULAS y negrita: "EXPRESS" o "ENVÍO RÁPIDO" con degradado naranja y ícono de rayo; "DESTACADO" en ámbar con estrella; "CERRADO" en pizarra oscuro con candado. |
| **Íconos** | Librería **Lucide** (líneas finas): rayo, bicicleta, reloj, bolsa de compras, chef, mapa. |
| **Emojis** | Muy presentes en categorías y antojos: 🍔 🍕 🍣 🍗 🥢 🍰 🥗 🇵🇪. |
| **Animaciones** | Cintas de texto en movimiento infinito, entradas suaves, botones que crecen un poco al pasar el mouse. Respeta la opción de "reducir movimiento" del sistema. |
| **Avisos emergentes** | Esquina superior derecha, con colores (verde para éxito, rojo para error). |
| **Formato de layout** | Bloques tipo "bento" (cuadrícula de tarjetas de distintos tamaños) en la landing; paneles divididos (oscuro decorativo y blanco con formulario) en login y registro. |

---

## 6. Textos, eslóganes y mensajes que aparecen en la web

### Eslóganes principales
- **"La comida que quieres, en tiempo récord."** (titular principal de la landing)
- **"Menos fricción. Más sabor."** (CTA final)
- **"Tu delivery favorito en Lima."** (pie de página)
- **"Inicia sesión y pide como un rey"** (login)
- **"¿Qué te provoca pedir hoy?"** (catálogo del cliente)
- **"Variedad y rapidez directo a tus manos"** (catálogo)

### Landing
- Subtítulo: "Pide a los restaurantes de tu zona y recíbelo en casa. Sigue tu pedido en tiempo real, desde el local hasta tu puerta."
- Botones: "Comenzar a pedir" · "Explorar locales cercanos" · "Ver todos"
- "¿Por qué QuickEats?": "Comida de tus restaurantes favoritos: rápida, fácil y con seguimiento en vivo."
  - "**30 min** – Entrega rápida y seguimiento en vivo"
  - "Restaurantes de tu zona – Trabajamos con locales reales, con sus menús y precios siempre actualizados."
  - "Soporte cuando lo necesites – ¿Algún problema con tu pedido? Escríbenos y te ayudamos a resolverlo rápido."
- "¿Cómo funciona?": "Tres pasos entre tú y tu próxima comida favorita."
  - **01 Explora** – "Descubre los restaurantes cercanos a ti, filtrados por antojo, categoría y calificación."
  - **02 Pide** – "Agrega tus platillos favoritos al carrito y paga de forma segura en segundos."
  - **03 Recibe** – "Sigue a tu repartidor en tiempo real hasta que tu pedido llegue a tu puerta."
- "Algunos de nuestros restaurantes" – "Crea tu cuenta gratis para ver los menús completos y hacer tu pedido."
- CTA final: "Menos fricción. Más sabor. Haz tu primer pedido hoy." – "Regístrate en menos de 30 segundos, accede a cupones exclusivos de bienvenida y experimenta el verdadero delivery en alta velocidad."
- Cinta de antojos: "Burgers 🍔 · Makis 🍣 · Lomo Saltado 🇵🇪 · Pizza 🍕 · Pollo a la Brasa 🍗 · Postres 🍰 · Chifa 🥢"

### Registro
- "Únete a QuickEats" – "Regístrate en segundos y empieza a pedir de los mejores restaurantes de tu zona."
- Beneficios: "Registros rápidos e inmediatos — sin comisiones ocultas" · "Acceso directo a la variedad de los mejores locales" · "Pagos seguros y seguimiento de tu pedido en tiempo real."
- "Crear cuenta" · "Acepto los términos, condiciones y la política de privacidad."

### Login
- "Bienvenido de nuevo" · "Inicia sesión y pide como un rey" · "¿No tienes cuenta? Regístrate gratis"
- Cintas decorativas: "BURGER • CEVICHE • PIZZA • LOMO • SUSHI • TACOS • MAKI • POLLO • CHIFA" · "**QUICKEATS • LIVE • SPEED • PREMIUM**" · "**DELIVERY • ANTOJO • RÁPIDO • FRESCO • LOCAL • SABOR**"

### Experiencia del cliente
- Buscador: "Buscar platos, locales o antojos…"
- "Entrega rápida ≤ 25 min" · "Locales Disponibles" · "Fuera de horario"
- Pedido exitoso: "¡Pedido realizado con éxito! 🎉"
- Mis pedidos vacío: "¿Qué vas a comer hoy?" – "Aún no registras ninguna compra."
- Chatbot: botón "¿Qué vas a pedir hoy?"; saludo "¡Hola! Soy tu asistente de QuickEats con IA. Puedes preguntarme el estado de tus pedidos o pedirme que agregue platos a tu carrito."
- Estados del pedido: **Recibido → Cocina → En Camino → Entregado** (o Cancelado)

### Metadatos (pestaña del navegador)
- Título: "QuickEats — Panel Administrativo y Delivery"
- Descripción: "Plataforma corporativa de gestión de pedidos y control de restaurantes en tiempo real."

---

## 7. Tono de voz

| Rasgo | Ejemplos del código |
|---|---|
| **Cercano y en tuteo** | "¿Qué te provoca pedir hoy?", "tu próxima comida favorita", "Escríbenos y te ayudamos". |
| **Peruano y local** | "¿Qué te provoca…?" (expresión peruana), Lomo Saltado, Pollo a la Brasa, Chifa, Ceviche, "Tu delivery favorito en Lima", soles (S/). El chatbot está instruido a responder con "tono amable peruano". |
| **Enérgico y orientado a la velocidad** | "en tiempo récord", "alta velocidad", "Express", "Envío Rápido", "30 min", "SPEED". |
| **Antojo y placer** | "antojos", "Más sabor", "pide como un rey". |
| **Simple y sin fricción** | "Menos fricción", "en menos de 30 segundos", "Tres pasos". |
| **Con emojis** | En categorías, antojos y mensajes de éxito (🎉). |

**Ideas fuerza que repite la marca:** velocidad · antojo/sabor · local (Lima, restaurantes de tu zona) · facilidad · seguimiento en vivo.

> ⚠️ Algunos mensajes de marca prometen funciones que **no existen** (seguimiento en vivo, cupones, calificaciones, pagos seguros). Ver `03-funcionalidades.md` antes de usarlos en el informe como algo real.
