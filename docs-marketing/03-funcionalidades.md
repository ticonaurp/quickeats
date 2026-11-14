# 03 · Funcionalidades: implementadas vs. propuestas

> Organizadas por cada lado del mercado multilateral: **comensal**, **restaurante** y **repartidor**, más el **operador** (QuickEats).
>
> - ✅ **Implementado:** funciona hoy en el código.
> - 🟡 **Parcial:** existe una parte, o se ve en pantalla pero sin lógica completa.
> - 🟠 **Propuesto:** no existe. Incluye lo que la web **promete y no cumple**.

---

## Resumen por lado del mercado

| Lado | Hoy | Comentario |
|---|---|---|
| 🧑 Comensal | ✅ Bien cubierto | Recorrido completo: descubrir → pedir → seguir el estado. |
| 🏪 Restaurante | 🟠 **No tiene acceso propio** | Su menú y sus pedidos los gestiona el administrador de QuickEats. |
| 🛵 Repartidor | 🟠 **No existe** | No hay repartidores en el sistema. |
| 🛠️ Operador (QuickEats) | ✅ Panel admin | Métricas, restaurantes, productos y pedidos. |

> **Conclusión clave:** hoy QuickEats funciona como una **tienda de un solo lado** (el operador vende a comensales). Para ser un **mercado multilateral** le faltan los accesos y herramientas propias del restaurante y del repartidor.

---

## 1. 🧑 Comensal

### ✅ Implementado
| Funcionalidad | Detalle |
|---|---|
| Registro e inicio de sesión | Nombre, correo y contraseña cifrada. Sesión con token. |
| Catálogo de restaurantes | Tarjetas con foto, categoría, tiempo y costo de envío. |
| Búsqueda | Por nombre o descripción del **restaurante**; no busca dentro de los platos. |
| Filtro por categoría | All, Burgers, Pizza, Asiática, Italiana, Chifa, Pollerías, Saludable, Postres. |
| Sección "Entrega rápida" | Carrusel con los restaurantes que entregan en 25 minutos o menos. |
| Etiquetas | "Envío Rápido" (30 min o menos), "Destacado", "Envío Gratis", "Cerrado". |
| Restaurantes abiertos y cerrados | Los cerrados aparecen aparte ("Fuera de horario") y no dejan pedir. |
| Menú del restaurante | Platos con foto, precio, descripción, calorías y la marca "Popular". |
| Carrito | Se guarda aunque se cierre el navegador. Solo admite platos de un restaurante a la vez. |
| Checkout en 2 pasos | Dirección con autocompletado de Google Maps y pin arrastrable, notas para el repartidor y método de pago. |
| Pago en efectivo contra entrega | Se registra en el pedido. |
| Pedido con precios congelados | El pedido guarda el precio del momento; cambios posteriores no lo afectan. |
| Mis pedidos | Historial, buscador, filtros por estado y barra de progreso (Recibido → Cocina → En camino → Entregado). Se actualiza solo cada 10 s. |
| Notificación de pedido creado | Aviso en la campanita: "Tu orden ha sido creada exitosamente". |
| Chatbot con IA | Agrega platos al carrito con lenguaje natural ("un par de…", "media docena de…") y consulta el estado de un pedido. Tono amable peruano. |

### 🟡 Parcial
| Funcionalidad | Qué existe | Qué falta |
|---|---|---|
| Pago con tarjeta | Formulario con validación (número válido, fecha no vencida, CVC). | **No cobra.** No hay pasarela; el pago es simulado. |
| Mapa | Mapa de Google en el checkout para elegir la dirección. | Las coordenadas **no se guardan** (solo el texto), y no hay mapa de seguimiento. |
| Seguimiento del pedido | Barra de estados que se actualiza sola. | Los estados los cambia el administrador **a mano**; no hay GPS ni repartidor. |
| Notificaciones | Solo "orden creada", dentro de la web. | No avisa cambios de estado. No hay push, WhatsApp ni email. |
| Términos y privacidad | Casilla obligatoria en el registro. | No existe el documento legal enlazado. |

### 🟠 Propuesto (la web lo promete y NO existe)
| Lo que dice la web | Dónde aparece | Realidad |
|---|---|---|
| "Accede a **cupones exclusivos de bienvenida**" | CTA final de la landing | No hay cupones ni descuentos. |
| "Tu pedido se asigna al **repartidor más cercano** y puedes **seguirlo en el mapa en tiempo real**" | Landing ("¿Por qué QuickEats?") | No hay repartidores ni mapa de seguimiento. |
| "Sigue a tu repartidor en tiempo real hasta que tu pedido llegue a tu puerta" | Landing ("¿Cómo funciona?", paso 03) | Igual que el punto anterior. |
| Celular con "Tu Repartidor: Carlos Mendoza", mapa y "Llega en 12 min" | Hero de la landing | Ilustración decorativa. |
| Calificación **⭐ 4.8** | Tarjetas de restaurantes en la landing | Número fijo. No hay reseñas. |
| "Filtrados por antojo, categoría y **calificación**" | Landing ("¿Cómo funciona?", paso 01) | No se puede filtrar por calificación. |
| "**Pagos seguros**" / "paga de forma segura en segundos" | Registro y landing | El pago con tarjeta es simulado. |
| "**Soporte** cuando lo necesites. Escríbenos y te ayudamos" | Landing | No hay canal de soporte; el chatbot no atiende reclamos. |
| "¿Olvidaste tu contraseña?" | Login | El enlace no hace nada. |

### 🟠 Propuesto (nuevas funcionalidades para el comensal)
- Pasarela de pago real: **Yape**, **Plin**, tarjeta vía **Culqi** o **Niubiz**.
- **Seguimiento en mapa en vivo** del repartidor, con tiempo estimado de llegada.
- **Cupones**: bienvenida, primer pedido, por campaña o por restaurante.
- **Reseñas y calificaciones** de restaurantes (y opcionalmente de repartidores).
- **Programa de referidos** ("invita a un amigo") y **puntos de fidelidad**.
- **Direcciones guardadas** (casa, trabajo).
- **Repetir pedido** con un clic desde el historial.
- **Búsqueda por plato**, no solo por restaurante.
- **Notificaciones push / WhatsApp** en cada cambio de estado.
- **Favoritos.**
- **Propina** para el repartidor.
- **App móvil** (Android / iOS).
- **Soporte** y reclamos (libro de reclamaciones).
- **Recuperación de contraseña.**

---

## 2. 🏪 Restaurante

> Hoy **no existe un rol "restaurante"**. Los roles del sistema son solo `USER` y `ADMIN`. Todo lo de esta sección lo hace hoy el **administrador de QuickEats** en nombre del restaurante.

### ✅ Implementado (desde el panel del administrador)
| Funcionalidad | Detalle |
|---|---|
| Ficha del restaurante | Nombre, descripción, categoría, imagen (por URL) y dirección con Google Maps. |
| Configuración de entrega | Tiempo estimado (min) y costo de envío (S/). |
| Horarios por día | Hora de apertura y cierre para cada día de la semana. |
| Abrir y cerrar el local | Un interruptor; si está cerrado, nadie puede pedir (también lo valida el servidor). |
| Destacar el comercio | Aparece en "Algunos de nuestros restaurantes" de la landing. |
| Menú | Crear, editar y eliminar platos: precio, categoría, calorías, foto, "Popular". |
| Disponibilidad | Marcar un plato como "Agotado" o "Disponible". |
| Gestión de pedidos | Ver pedidos y cambiar su estado (Pendiente → En preparación → En camino → Entregado, o Cancelado). |

### 🟠 Propuesto
- **Registro y acceso propio** del restaurante (rol `RESTAURANTE`), con verificación de datos (RUC).
- **Panel del restaurante**: solo sus pedidos y su menú.
- **Recepción de pedidos en tiempo real** con sonido o alerta, y botones Aceptar / Rechazar / "Listo para recoger".
- **Tiempo de preparación** configurable por pedido.
- **Métricas propias**: ventas, ticket promedio, platos más vendidos, horas pico, calificación.
- **Liquidaciones y pagos**: cuánto vendió, comisión de QuickEats y monto a depositar.
- **Crear sus propias promociones** (2x1, descuento por horario).
- **Responder reseñas.**
- **Subir fotos** directamente (hoy se pega una URL).
- **Plan de visibilidad pagada** (aparecer como destacado).

---

## 3. 🛵 Repartidor

> **No existe nada** para el repartidor en el código actual: no hay rol, pantalla, tabla en la base de datos ni ubicación GPS.

### ✅ Implementado
- Ninguna funcionalidad.
- Lo único relacionado es que el cliente puede dejar **notas para el repartidor** (piso, departamento, instrucciones) en el checkout, y que existe el estado de pedido **"En camino"** (que cambia el administrador a mano).

### 🟠 Propuesto
- **Registro y verificación** del repartidor (DNI, licencia, SOAT, vehículo).
- **Conectarse / desconectarse** para recibir pedidos.
- **Ofertas de pedido** con distancia, pago estimado y botón Aceptar / Rechazar.
- **Navegación** al restaurante y luego al cliente, con Google Maps.
- **Envío de ubicación GPS en vivo**, que alimenta el mapa del comensal.
- **Cambiar estados**: "Recogido", "En camino", "Entregado" (con foto o código de confirmación).
- **Ganancias**: del día, de la semana, propinas e historial de pagos.
- **Calificación** del repartidor.
- **Botón de ayuda y emergencia.**

---

## 4. 🛠️ Operador (QuickEats)

### ✅ Implementado
| Funcionalidad | Detalle |
|---|---|
| Panel de control con métricas reales | Ingresos totales (sin cancelados), número de pedidos, restaurantes y productos. |
| Gráfico de ingresos por mes | Últimos 6 meses. |
| Pedidos por categoría | Gráfico de dona, según la categoría del restaurante. |
| Top 5 restaurantes | Los que tienen más pedidos. |
| Pedidos recientes | Los 5 últimos. |
| Gestión de pedidos | Buscador, filtros, tarjetas (totales, ingresos, pendientes, entregados) y cambio de estado. |
| Gestión de restaurantes y productos | Alta, edición, apertura/cierre, destacados y agotados. |

### 🟠 Propuesto
- **Comisiones** por pedido y por restaurante (modelo de ingresos).
- **Gestión de restaurantes y repartidores afiliados** (aprobaciones, suspensiones).
- **Gestión de campañas y cupones.**
- **Analítica de marketing**: origen del tráfico (UTM), conversión del embudo (visita → registro → primer pedido → recompra), retención por cohortes y costo de adquisición. Con **Google Analytics 4** y **Meta Pixel**.
- **Segmentación de clientes** (frecuentes, inactivos, nuevos) para campañas de email o WhatsApp.
- **Moderación de reseñas.**
- **Zonas de cobertura** y tarifas de envío por distancia.

---

## 5. Datos que el sistema ya guarda (útiles para marketing)

| Dato | Dónde | Uso posible |
|---|---|---|
| Fecha de registro del usuario | Usuarios | Cohortes, tiempo hasta el primer pedido. |
| Pedidos por usuario (fecha, total, restaurante) | Pedidos | Frecuencia de compra, ticket promedio, recompra. |
| Platos de cada pedido | Pedidos | Platos más vendidos. |
| Método de pago (tarjeta / efectivo) | Pedidos | Preferencias de pago. |
| Categoría del restaurante | Restaurantes | Categorías más pedidas. |
| Estado del pedido | Pedidos | Tasa de cancelación. |

**No se guarda:** edad, sexo, distrito estructurado, coordenadas de entrega, dispositivo, canal de adquisición ni la navegación dentro de la web.
