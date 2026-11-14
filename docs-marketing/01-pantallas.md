# 01 · Pantallas reales de QuickEats

> Inventario de las pantallas que **existen hoy en el código** (`frontend/app/`), ordenadas como el recorrido de un cliente y luego el del administrador. Para cada una: ruta, rol, qué muestra, qué funciona de verdad, qué es solo visual y qué captura tomar para el informe.

**Convenciones**
- **Rol:** `PÚBLICO` (sin sesión), `USER` (cliente) o `ADMIN` (administrador).
- **✅ Funciona:** conectado al backend y a la base de datos.
- **🎨 Solo visual:** está en la pantalla, pero no tiene lógica real detrás.
- Moneda: soles (S/). Ciudad de referencia en el código: Lima.

---

## Antes de tomar capturas: datos de ejemplo recomendados

Para que las pantallas se vean llenas y coherentes, conviene tener cargado en la base de datos (desde el panel admin):

| Dato | Recomendación |
|---|---|
| **Restaurantes** | 6 a 8 locales de categorías distintas, usando las que existen en el código: Burgers, Pizza, Asiática, Italiana, Chifa, Pollerías, Saludable, Postres. Todos con **foto** (URL de imagen), descripción corta y dirección en Lima. |
| **Tiempos de entrega** | Variados: algunos de **25 min o menos** (así aparecen en el carrusel "Entrega rápida") y otros de 35 a 45 min. |
| **Costo de envío** | Variado, con al menos uno en **S/ 0.00** (se muestra como "Envío Gratis"). |
| **Destacados** | 3 restaurantes marcados como **Destacado**; son los que salen en la landing. |
| **Abierto / cerrado** | La mayoría abiertos y **1 cerrado**, para que aparezca la sección "Fuera de horario". |
| **Productos** | 4 a 6 platos por restaurante, con foto, precio, calorías y 1 o 2 marcados como **Popular**. |
| **Pedidos** | 8 a 15 pedidos de 2 o 3 usuarios, repartidos en **varios meses** y en **todos los estados** (Recibido, Cocina, En camino, Entregado, Cancelado). Así se llenan los gráficos del panel admin. |
| **Usuarios** | Uno cliente (`USER`) y uno administrador (`ADMIN`). |

> Nota: los pedidos se guardan con la fecha real en que se crean; el código no permite elegir la fecha. Para que el gráfico "Ingresos por mes" muestre varios meses, hay que crear pedidos en fechas distintas o cargarlos directamente en la base de datos.

---

## Recorrido del cliente

### 1. Landing page

| | |
|---|---|
| **Ruta** | `/` |
| **Rol** | PÚBLICO |
| **Archivo** | `frontend/app/page.tsx` |

**Qué muestra (de arriba a abajo)**
1. **Barra superior** con el logo QuickEats y los botones de sesión.
2. **Hero:** el titular "La comida que quieres, *en tiempo récord.*", el subtítulo y 2 botones: "Comenzar a pedir" (lleva a registro) y "Explorar locales cercanos" (lleva a login). A la derecha, un **celular ilustrado** con un repartidor ("Carlos Mendoza"), un mapa y el texto "Llega en 12 min".
3. **Cinta animada de antojos:** Burgers 🍔, Makis 🍣, Lomo Saltado 🇵🇪, Pizza 🍕, Pollo a la Brasa 🍗, Postres 🍰, Chifa 🥢.
4. **"¿Por qué QuickEats?"**, en formato bento: "30 min – Entrega rápida y seguimiento en vivo", "Restaurantes de tu zona" y "Soporte cuando lo necesites".
5. **"¿Cómo funciona?"** en 3 pasos: 01 Explora, 02 Pide, 03 Recibe.
6. **"Algunos de nuestros restaurantes":** tarjetas de los restaurantes destacados.
7. **CTA final:** "Menos fricción. Más sabor. Haz tu primer pedido hoy."
8. **Pie de página:** "© 2026 QuickEats. Tu delivery favorito en Lima." y "Lima, Perú."

**✅ Funciona:** los restaurantes destacados vienen de la base de datos (se actualizan cada 20 s). Si no hay destacados, muestra los 3 primeros. Las tarjetas muestran la etiqueta "Express" (30 min o menos) o "Cerrado", la categoría, el tiempo y el costo de envío.

**🎨 Solo visual:** el celular con repartidor y mapa es una ilustración. La calificación **⭐ 4.8 está fija** en todas las tarjetas. Las promesas de "seguimiento en vivo", "repartidor más cercano", "soporte" y "cupones exclusivos de bienvenida" no están implementadas (ver `03-funcionalidades.md`).

**📸 Capturas para el informe**
- Hero completo, a pantalla de escritorio.
- Sección "¿Cómo funciona?", útil para explicar la propuesta de valor.
- "Algunos de nuestros restaurantes" con 3 destacados con buenas fotos.
- CTA final.

---

### 2. Registro

| | |
|---|---|
| **Ruta** | `/register` |
| **Rol** | PÚBLICO |
| **Archivos** | `frontend/app/register/page.tsx`, `frontend/app/components/RegisterForm.tsx` |

**Qué muestra:** a la izquierda (solo en escritorio), un panel oscuro con "Únete a QuickEats" y 3 beneficios: "Registros rápidos e inmediatos — sin comisiones ocultas", "Acceso directo a la variedad de los mejores locales" y "Pagos seguros y seguimiento de tu pedido en tiempo real". A la derecha, el formulario "Crear cuenta" con nombre completo, correo, contraseña, confirmar contraseña y una casilla de términos y privacidad.

**✅ Funciona:** crea el usuario en la base de datos (contraseña cifrada), valida que las contraseñas coincidan y que se acepten los términos.

**🎨 Solo visual:** el enlace de "términos y política de privacidad" no lleva a ningún documento. "Pagos seguros" y "seguimiento en tiempo real" son promesas.

**📸 Captura:** la pantalla completa en escritorio, con el panel de beneficios y el formulario a medio llenar.

---

### 3. Login

| | |
|---|---|
| **Ruta** | `/login` |
| **Rol** | PÚBLICO |
| **Archivos** | `frontend/app/login/page.tsx`, `frontend/app/components/LoginForm.tsx` |

**Qué muestra:** a la izquierda, un panel oscuro con 3 cintas animadas de texto ("BURGER • CEVICHE • PIZZA • LOMO…", "QUICKEATS • LIVE • SPEED • PREMIUM" y "DELIVERY • ANTOJO • RÁPIDO • FRESCO • LOCAL • SABOR"). A la derecha, "Bienvenido de nuevo – Inicia sesión y pide como un rey", con correo, contraseña y el enlace "Regístrate gratis".

**✅ Funciona:** inicia sesión y lleva al cliente al catálogo (`/user`) y al administrador al panel (`/admin`).

**🎨 Solo visual:** "¿Olvidaste tu contraseña?" no hace nada.

**📸 Captura:** pantalla completa en escritorio; el panel de cintas animadas funciona bien como imagen de marca.

---

### 4. Catálogo de restaurantes (inicio del cliente)

| | |
|---|---|
| **Ruta** | `/user` |
| **Rol** | USER |
| **Archivo** | `frontend/app/user/page.tsx` |

**Qué muestra:**
- **Barra superior** con el logo, accesos a inicio, pedidos y carrito, la **campanita de notificaciones** y el menú de usuario.
- **Cabecera naranja** con "¿Qué te provoca pedir hoy?" y el buscador "Buscar platos, locales o antojos…".
- **Píldoras de categorías** con emoji: All 🍽️, Burgers 🍔, Pizza 🍕, Asiática 🥢, Italiana 🍝, Chifa 🥡, Pollerías 🍗, Saludable 🥗, Postres 🍰.
- **Carrusel "Entrega rápida ≤ 25 min"** con los restaurantes abiertos que entregan en 25 minutos o menos.
- **"Locales Disponibles – Variedad y rapidez directo a tus manos"**: tarjetas con foto, nombre, categoría, descripción, tiempo y costo de envío, y las etiquetas "Envío Rápido" y "Destacado". Un contador indica "N Abiertos".
- **"Fuera de horario":** los restaurantes cerrados, en gris y con la etiqueta "Cerrado".
- **Botón flotante del chatbot** ("¿Qué vas a pedir hoy?").

**✅ Funciona:** la búsqueda por nombre o descripción del restaurante, el filtro por categoría y la separación entre abiertos y cerrados. La lista se actualiza sola (cada 10 s y en tiempo real cuando el admin cambia un restaurante).

**Detalle:** el buscador dice "platos", pero solo busca en el nombre y la descripción del **restaurante**, no en los platos.

**📸 Capturas para el informe**
- Vista general con la cabecera, las categorías y el carrusel Express.
- La misma vista con una categoría seleccionada, por ejemplo "Pollerías", para mostrar la segmentación.
- La sección "Fuera de horario" con 1 restaurante cerrado.

---

### 5. Menú del restaurante

| | |
|---|---|
| **Ruta** | `/restaurants/[id]` |
| **Rol** | USER |
| **Archivos** | `frontend/app/restaurants/[id]/page.tsx` y `components/` (RestaurantHero, RestaurantInfoCard, MenuSection, CartSidebar) |

**Qué muestra:** una foto grande del restaurante con su nombre y categoría; una tarjeta informativa con descripción, costo de envío y estado abierto o cerrado; la lista de platos con foto, descripción, precio, calorías, la marca "Popular" y el botón "Agregar" (o los botones − / + si el plato ya está en el carrito); y a la derecha la barra "Tu pedido" con subtotal, envío, total y el botón para ir al carrito.

**✅ Funciona:** agregar y quitar platos. Si el restaurante está cerrado, los botones dicen "Cerrado" y no dejan agregar. No permite mezclar platos de 2 restaurantes ("Ya tienes productos de X en tu carrito. Vacíalo antes de pedir en otra tienda.").

**🎨 Detalle:** si un plato no tiene calorías cargadas, la pantalla muestra "350 cal" por defecto. Conviene cargar calorías reales antes de tomar la captura.

**📸 Captura:** el menú de un restaurante abierto, con 2 o 3 platos ya agregados para que la barra "Tu pedido" muestre montos.

---

### 6. Carrito

| | |
|---|---|
| **Ruta** | `/cart` |
| **Rol** | USER (si no hay sesión, al continuar pide iniciar sesión) |
| **Archivos** | `frontend/app/cart/page.tsx` y `cart/components/` |

**Qué muestra:** el restaurante del pedido, la lista de platos con cantidad (− / +) y opción de eliminar, una tarjeta de "Entrega estimada" y un "Resumen del pedido" con subtotal, costo de envío y total, más los botones para vaciar el carrito y continuar.

**✅ Funciona:** el carrito se guarda en el navegador y se mantiene al recargar la página. Si está vacío, muestra "Tu carrito está vacío – Explora el menú y agrega tus platos favoritos."

**📸 Captura:** carrito con 3 platos y el resumen visible.

---

### 7. Pago (checkout)

| | |
|---|---|
| **Ruta** | `/pago` |
| **Rol** | USER |
| **Archivos** | `frontend/app/pago/page.tsx`, `components/checkout/` (StepIndicator, AddressSection, PaymentSection, OrderSummarySidebar) |

**Qué muestra:** un indicador de 2 pasos y, a la derecha, el "Resumen del Pedido".
- **Paso 1, "Dirección de Entrega":** un buscador de direcciones con autocompletado de **Google Maps**, un **mapa con un pin** que se puede arrastrar (el pin es una casita color mango) y el campo de notas ("Nro. de departamento, piso, instrucciones especiales para el repartidor…").
- **Paso 2, "Método de Pago":** "Tarjeta de Crédito / Débito" (nombre, número, vencimiento MM/AA y CVC) o "Efectivo contra entrega".

**✅ Funciona:** crea el pedido real en la base de datos, con los precios congelados, y lleva a "Mis pedidos" con el aviso "¡Pedido realizado con éxito! 🎉". El backend rechaza el pedido si el restaurante está cerrado. El formulario de tarjeta valida que el número sea matemáticamente válido (algoritmo de Luhn) y que la fecha no esté vencida.

**🎨 Solo visual o parcial:**
- **El pago con tarjeta es simulado:** no se cobra nada ni se conecta con ninguna pasarela. "Procesando pago…" es solo una animación.
- Se guarda la **dirección en texto**, pero **no las coordenadas** del pin.
- El mapa necesita una clave de Google Maps (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`); sin ella, el buscador se queda en "Cargando buscador…".

**📸 Capturas para el informe**
- Paso 1 con una dirección de Lima seleccionada y el pin en el mapa (requiere la clave de Google Maps).
- Paso 2 con "Tarjeta" seleccionada y datos de prueba, por ejemplo `4242 4242 4242 4242`.

---

### 8. Mis pedidos

| | |
|---|---|
| **Ruta** | `/orders` |
| **Rol** | USER |
| **Archivo** | `frontend/app/orders/page.tsx` |

**Qué muestra:** el título "Mis Pedidos", un buscador, filtros por estado con contador (Todos, Recibido, Cocina, En Camino, Entregado, Cancelado) y tarjetas de pedido con el restaurante, la fecha, el número de items, el total y una **barra de progreso de 4 pasos** (Recibido → Cocina → En Camino → Entregado). Al expandir una tarjeta se ve el "Resumen de platillos", la dirección de entrega, el subtotal y el envío.

**✅ Funciona:** el historial real del usuario. Se actualiza solo cada 10 segundos, así que si el admin cambia el estado, el cliente lo ve.

**🎨 Importante:** el avance de estado **lo hace el administrador a mano**. No hay repartidor, GPS ni mapa de seguimiento.

**📸 Capturas para el informe**
- La lista con pedidos en varios estados y los filtros con contadores.
- Un pedido expandido en estado "En Camino", con la barra de progreso.

---

### 9. Notificaciones (componente de la barra superior)

| | |
|---|---|
| **Ubicación** | Campanita en `TopNavbar` (visible en `/user` y en otras pantallas del cliente) |
| **Rol** | USER |
| **Archivo** | `frontend/app/components/TopNavbar.tsx` |

**Qué muestra:** un contador de no leídas (hasta "9+") y una lista desplegable con "Notificaciones (N)", el botón "Marcar todas" y cada aviso con su fecha relativa.

**✅ Funciona:** solo se genera un tipo de aviso: **"Tu orden ha sido creada exitosamente"**, al crear un pedido. Los cambios de estado del pedido **no** generan notificación.

**📸 Captura:** la campanita abierta con 2 o 3 avisos, alguno sin leer.

---

### 10. Chatbot con IA

| | |
|---|---|
| **Ubicación** | Botón flotante en el catálogo (`/user`) |
| **Rol** | USER |
| **Archivos** | `frontend/app/components/AiChatbot.tsx`, `gateway/src/ai/` |

**Qué muestra:** una ventana "Asistente QuickEats AI" con el saludo "¡Hola! Soy tu asistente de QuickEats con IA. Puedes preguntarme el estado de tus pedidos o pedirme que agregue platos a tu carrito." y el campo "Pregunta por un pedido o pide agregar un plato…".

**✅ Funciona:** usa el modelo Llama 3.1 vía Groq y tiene 2 capacidades reales:
1. **Agregar al carrito con lenguaje natural:** por ejemplo, "ponme un par de [nombre de plato]" agrega 2 unidades al carrito de verdad. Entiende expresiones como "un par" o "media docena".
2. **Consultar el estado de un pedido** por su código corto de 8 caracteres (el que se ve en "Mis pedidos").

El historial del chat se guarda en el navegador. Respeta la regla de un solo restaurante por carrito.

**Requisito:** necesita la clave `GROQ_API_KEY` en el gateway; sin ella responde con un error de conexión.

**📸 Capturas para el informe**
- Una conversación donde el usuario pide un plato y el bot confirma que lo agregó.
- Una conversación consultando el estado de un pedido.

---

## Recorrido del administrador

> Al iniciar sesión con un usuario `ADMIN`, el sistema lleva a `/admin`. Todas las pantallas tienen una **barra lateral** (`admin/components/Sidebar.tsx`) con el logo, la etiqueta "Panel Admin", Panel de Control, Restaurantes, Productos, Pedidos, el correo del admin y "Cerrar Sesión". La barra se puede colapsar.

### 11. Panel de control

| | |
|---|---|
| **Ruta** | `/admin` |
| **Rol** | ADMIN |
| **Archivos** | `frontend/app/admin/page.tsx`, `admin/components/` |

**Qué muestra:** el título "Panel de Control – Resumen operativo de QuickEats" y:
- **4 tarjetas de métricas:** Ingresos Totales (S/, sin pedidos cancelados), Pedidos, Restaurantes y Productos.
- **Gráfico de área "Ingresos por mes"** de los últimos 6 meses.
- **Gráfico de dona "Pedidos por Categoría"**, según la categoría del restaurante.
- **"Pedidos Recientes":** los 5 últimos, con su estado.
- **"Restaurantes con más pedidos":** el top 5.

**✅ Funciona:** todas las cifras se calculan con datos reales de la base. Es la pantalla más útil para hablar de KPIs en el informe.

**📸 Captura:** la pantalla completa con datos cargados. Es una de las más importantes del informe.

---

### 12. Gestión de pedidos

| | |
|---|---|
| **Ruta** | `/admin/orders` |
| **Rol** | ADMIN |
| **Archivo** | `frontend/app/admin/orders/page.tsx` |

**Qué muestra:** "Gestión de Pedidos", el buscador "Buscar por ID, restaurante o plato…", 4 tarjetas (Pedidos totales, Ingresos, Pendientes, Entregados), filtros por estado y una tabla (o lista en el celular) con cada pedido, el método de pago (Efectivo o Tarjeta), el total y un **selector para cambiar el estado**.

**✅ Funciona:** cambiar el estado (Pendiente → En preparación → En camino → Entregado, o Cancelado). Es lo que mueve la barra de progreso que ve el cliente.

**📸 Captura:** la tabla con pedidos en distintos estados y el selector de estado abierto.

---

### 13. Restaurantes: listado

| | |
|---|---|
| **Ruta** | `/admin/restaurants` |
| **Rol** | ADMIN |
| **Archivo** | `frontend/app/admin/restaurants/page.tsx` |

**Qué muestra:** un buscador, el indicador "Sincronizando live" y una tabla con Restaurante, Categoría, Entrega, Estado (un interruptor Abierto/Cerrado) y la acción "Editar". Tiene un botón para crear uno nuevo.

**✅ Funciona:** abrir y cerrar un restaurante con un clic; el cambio se refleja enseguida en el catálogo del cliente.

**📸 Captura:** la tabla con 6 a 8 restaurantes, alguno cerrado.

---

### 14. Restaurantes: crear o editar

| | |
|---|---|
| **Rutas** | `/admin/restaurants/new`, `/admin/restaurants/[id]/edit` |
| **Rol** | ADMIN |
| **Archivos** | `admin/restaurants/components/RestaurantForm.tsx` y los formularios `FormBasicInfo`, `FormLocation`, `FormDelivery`, `FormHours`, `FormVisibility` |

**Qué muestra:** un formulario por bloques:
- **Información Básica:** nombre, descripción, categoría e imagen con vista previa.
- **Ubicación del Local:** buscador de Google Maps con mapa y pin.
- **Configuración de Entrega:** tiempo (min) y costo de envío (S/).
- **Horarios:** apertura y cierre por día de la semana.
- **Visibilidad:** "Abierto Actualmente – El local recibirá pedidos en la aplicación" y "Destacar Comercio – Aparecerá en la sección preferencial de la home".

**✅ Funciona:** guarda todos los campos. La imagen se ingresa como **URL**, no se sube un archivo. De la ubicación se guarda la **dirección en texto**, no las coordenadas.

**📸 Captura:** el formulario de edición de un restaurante con todos los bloques llenos, mostrando sobre todo "Visibilidad" y "Horarios".

---

### 15. Productos: listado

| | |
|---|---|
| **Ruta** | `/admin/products` |
| **Rol** | ADMIN |
| **Archivo** | `frontend/app/admin/products/page.tsx` |

**Qué muestra:** el título "Productos", un filtro, tarjetas de producto con foto, precio, restaurante y un interruptor **Disponible / Agotado**, los botones Editar y Eliminar (con ventana de confirmación) y el botón para agregar un producto.

**✅ Funciona:** marcar productos como agotados, eliminarlos y filtrarlos.

**📸 Captura:** la cuadrícula de productos con fotos y alguno marcado como agotado.

---

### 16. Productos: crear o editar

| | |
|---|---|
| **Rutas** | `/admin/products/new`, `/admin/products/[id]/edit` |
| **Rol** | ADMIN |
| **Archivos** | `admin/products/new/page.tsx`, `admin/products/[id]/edit/page.tsx` |

**Qué muestra:** "Agregar Producto – Agrega un nuevo ítem al menú", con selector de restaurante, nombre (por ejemplo "Lomo Saltado Clásico"), descripción, precio, categoría (Hamburguesas, Pizzas, Pastas, Pollo, Chifa, Chaufa, Tallarín, Sushi, Rolls, Risotto, Bowls, Ensaladas, Acompañamientos, Entradas, Combos, Bebidas, Smoothies, Postres, Tortas y General), calorías, URL de la imagen con vista previa e interruptores de disponible y popular.

**✅ Funciona:** crea y edita productos reales.

**📸 Captura:** el formulario lleno con la vista previa de la imagen.

---

## Resumen del recorrido

| # | Pantalla | Ruta | Rol | ¿Captura prioritaria? |
|---|---|---|---|---|
| 1 | Landing | `/` | Público | ⭐ Sí |
| 2 | Registro | `/register` | Público | Sí |
| 3 | Login | `/login` | Público | Opcional |
| 4 | Catálogo | `/user` | USER | ⭐ Sí |
| 5 | Menú del restaurante | `/restaurants/[id]` | USER | ⭐ Sí |
| 6 | Carrito | `/cart` | USER | Sí |
| 7 | Pago | `/pago` | USER | ⭐ Sí |
| 8 | Mis pedidos | `/orders` | USER | ⭐ Sí |
| 9 | Notificaciones | (barra superior) | USER | Opcional |
| 10 | Chatbot IA | (botón flotante) | USER | ⭐ Sí (diferenciador) |
| 11 | Panel de control | `/admin` | ADMIN | ⭐ Sí |
| 12 | Gestión de pedidos | `/admin/orders` | ADMIN | Sí |
| 13 | Restaurantes: listado | `/admin/restaurants` | ADMIN | Opcional |
| 14 | Restaurantes: formulario | `/admin/restaurants/...` | ADMIN | Sí |
| 15 | Productos: listado | `/admin/products` | ADMIN | Opcional |
| 16 | Productos: formulario | `/admin/products/...` | ADMIN | Opcional |

> **No existen** pantallas para el restaurante como usuario propio, para el repartidor, para cupones, para reseñas ni para el seguimiento en mapa. Están descritas en `05-pantallas-por-disenar.md`.
