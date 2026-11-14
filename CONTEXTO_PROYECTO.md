# QuickEats: contexto completo del proyecto

> Documento de contexto para otro asistente o chat. Resume qué es QuickEats, qué hace realmente, cómo está construido y qué tan útil es como base para un proyecto de mercadotecnia. Separa con claridad lo que **está implementado** de lo que solo **se promete en la interfaz**.

---

## 1. Resumen

**QuickEats** es una plataforma web de delivery de comida, inspirada en Uber Eats, Rappi o PedidosYa y orientada al mercado peruano: precios en soles (S/.), comida peruana como Lomo Saltado, Pollo a la Brasa y Chifa, y un chatbot con "tono amable peruano".

- **Origen:** es el proyecto integrador (Modalidad A) de un curso de Ingeniería Informática de la Universidad Ricardo Palma (Lima, Perú).
- **Equipo:** 3 estudiantes.
- **Objetivo original:** demostrar ingeniería de software cloud-native, no validar un negocio. Los 5 tópicos evaluados son técnicos: Git/GitFlow, Docker, Kubernetes, CI/CD (GitHub Actions) y Cloud (Microsoft Azure).
- **Estado:** es un MVP funcional, desplegado en Azure con URL pública. Los datos (restaurantes, pedidos, usuarios) son de prueba; no hay clientes ni restaurantes reales.

---

## 2. Usuarios y funcionalidades

### 2.1 Cliente (comensal), rol `USER`

| Pantalla | Qué hace realmente |
|---|---|
| **Landing page** (`/`) | Hero con el titular "La comida que quieres, en tiempo récord.", botones "Comenzar a pedir" y "Explorar locales cercanos", una cinta animada de antojos (Burgers, Makis, Lomo Saltado, Pizza, Pollo a la Brasa, Postres, Chifa), una sección "¿Por qué QuickEats?" con tarjetas, "¿Cómo funciona?" en 3 pasos (Explora → Pide → Recibe), restaurantes destacados traídos de la base de datos y un CTA final ("Menos fricción. Más sabor. Haz tu primer pedido hoy."). |
| **Registro / Login** | Cuenta con nombre, email y contraseña. Contraseñas con bcrypt y sesión con JWT. |
| **Catálogo** (`/user`) | Lista de restaurantes con buscador, filtro por categoría y una sección "Express" para los que entregan en 30 minutos o menos. Los restaurantes cerrados se muestran aparte. |
| **Menú del restaurante** (`/restaurants/[id]`) | Productos con foto, descripción, precio, categoría, calorías y marca de "popular". Carrito lateral. |
| **Carrito** (`/cart`) | Persistido en el navegador (localStorage). Muestra subtotal, costo de envío y tiempo estimado. |
| **Checkout** (`/pago`) | 2 pasos: dirección (más notas de entrega) y método de pago (tarjeta o efectivo contra entrega). |
| **Mis pedidos** (`/orders`) | Historial con estados: Recibido (PENDING) → Cocina (PREPARING) → En camino (DELIVERING) → Entregado (DELIVERED), o Cancelado (CANCELLED). Se puede filtrar por estado. |
| **Notificaciones** | Campanita en la barra superior. Hoy solo se genera "Tu orden ha sido creada exitosamente". |
| **Chatbot con IA** | Asistente flotante (modelo Llama 3.1 8B vía Groq) con 2 funciones: (1) consultar el estado de un pedido por su código; (2) agregar productos al carrito con lenguaje natural, por ejemplo "ponme un par de burger master" agrega 2 unidades. |

### 2.2 Administrador, rol `ADMIN`

| Pantalla | Qué hace |
|---|---|
| **Panel de control** (`/admin`) | Métricas calculadas con datos reales de la base: ingresos totales (sin contar pedidos cancelados), número de pedidos, restaurantes y productos; gráfico de ingresos por mes (últimos 6 meses); gráfico de pedidos por categoría de restaurante; top 5 de restaurantes con más pedidos; 5 pedidos más recientes. |
| **Restaurantes** | Crear, editar y listar: nombre, descripción, categoría, dirección, imagen, tiempo de entrega, costo de envío, horarios por día, abierto/cerrado y "destacado" (que aparece en la landing). |
| **Productos** | Crear, editar, eliminar y filtrar: nombre, descripción, precio, categoría, calorías, imagen, disponible y popular. |
| **Pedidos** | Ver todos los pedidos y cambiar su estado a mano. |

### 2.3 Reglas de negocio implementadas
- No se puede crear un pedido para un restaurante cerrado; el backend lo valida.
- Cada pedido guarda una "foto" de los precios del momento de la compra (subtotal, envío y total), así que cambiar después un precio no altera los pedidos anteriores.
- Un pedido pertenece a un solo restaurante.

---

## 3. Lo que la interfaz promete pero NO está implementado

Es importante para cualquier uso de marketing: la landing contiene textos aspiracionales que el producto todavía no cumple.

| Promesa en la UI | Realidad |
|---|---|
| "Accede a cupones exclusivos de bienvenida" | No existe ningún sistema de cupones, descuentos ni promociones. |
| "Sigue tu pedido en el mapa en tiempo real" / "se asigna al repartidor más cercano" | No hay mapa, geolocalización ni repartidores. El estado del pedido lo cambia el admin a mano. El celular con mapa de la landing es una ilustración decorativa. |
| Calificación ⭐ 4.8 en las tarjetas de restaurante | Está fija en el código. No existen reseñas ni calificaciones. |
| Pago con tarjeta | Simulado. Valida el formato (algoritmo de Luhn, vencimiento, CVC), pero no cobra; no hay pasarela (Culqi, Niubiz, Izipay, Mercado Pago, Yape). |
| "Soporte cuando lo necesites" | No hay un canal de soporte; solo existe el chatbot, que no atiende reclamos. |

---

## 4. Lo que no existe (relevante para marketing)

- **Analítica y tracking:** no hay Google Analytics, Meta Pixel, Tag Manager ni captura de UTM. No se puede medir el origen del tráfico ni la conversión del embudo.
- **Canales de comunicación externos:** no hay email marketing, SMS, WhatsApp ni notificaciones push. Las notificaciones solo existen dentro de la app.
- **Fidelización:** no hay puntos, referidos, suscripción ni programa de lealtad.
- **Lado del restaurante y del repartidor:** un marketplace real tiene 3 públicos (comensal, restaurante, repartidor). Aquí solo existen el cliente y un admin central.
- **Datos de mercado reales:** todo es de prueba.
- **App móvil nativa:** es solo web (responsive).

---

## 5. Identidad de marca existente

- **Nombre:** QuickEats.
- **Color principal:** "mango", es decir, ámbar/naranja (`#f59e0b`, `amber-500` → `orange-500`), sobre fondos claros y bloques en azul pizarra oscuro (`slate-900`).
- **Tipografía de títulos:** Poppins, en negrita y con letras juntas.
- **Tono:** cercano, rápido, con emojis y guiños peruanos.
- **Mensajes clave ya redactados:**
  - "La comida que quieres, en tiempo récord."
  - "Menos fricción. Más sabor."
  - "Regístrate en menos de 30 segundos."
  - "30 min: entrega rápida y seguimiento en vivo."
  - "Restaurantes de tu zona."
- **Ejes de la propuesta de valor:** velocidad, restaurantes locales, facilidad de uso, seguimiento del pedido y asistente con IA.

---

## 6. Arquitectura técnica (resumen)

| Componente | Tecnología | Responsabilidad |
|---|---|---|
| Frontend | Next.js (App Router) + React + TypeScript + Tailwind CSS | Toda la interfaz |
| API Gateway | NestJS | Punto de entrada único; enruta a los microservicios. Aquí vive el chatbot (`POST /ai/chat`). |
| auth-service | NestJS + Prisma + JWT + bcrypt | Usuarios y roles (USER / ADMIN) |
| restaurant-service | NestJS + Prisma | Restaurantes, horarios y productos |
| order-service | NestJS + Prisma | Pedidos e ítems; avisa al notification-service |
| notification-service | NestJS + Prisma | Notificaciones del usuario |
| Base de datos | PostgreSQL en Supabase | Persistencia |
| Infraestructura | Docker, Docker Compose, Kubernetes, GitHub Actions, Azure Container Registry + Azure Container Apps | Contenedores, orquestación, CI/CD y nube (entornos dev y prod) |

### Modelo de datos
- **User:** id, name, email, password, role (USER/ADMIN), createdAt.
- **Restaurant:** name, description, category, address, deliveryTime (min), deliveryFee, isOpen, isFeatured, image, openingHours[], products[].
- **OpeningHour:** dayOfWeek, openTime, closeTime.
- **Product:** name, description, price, category, calories, image, isAvailable, isPopular.
- **Order:** userId, restaurantId, restaurantName, address, deliveryNotes, paymentMethod (CARD/CASH), subtotal, deliveryFee, total, status, createdAt, items[].
- **OrderItem:** productId, name, price, quantity.
- **Notification:** userId, message, isRead, createdAt.

Datos que ya se podrían explotar para marketing: frecuencia de compra por usuario, ticket promedio, categorías más pedidas, restaurantes top, método de pago preferido, hora y día de los pedidos y fecha de registro (para cohortes). **No se registran:** edad, género, distrito estructurado, dispositivo ni canal de adquisición.

---

## 7. Evaluación para un proyecto de mercadotecnia

### Fortalezas como base
1. Es un **producto funcional y desplegado** que se puede mostrar como MVP en una presentación.
2. Tiene un **embudo de conversión completo** (landing → registro → catálogo → carrito → pago → pedido), útil para explicar el customer journey, el modelo AIDA o el análisis de fricción.
3. Ya tiene **identidad de marca y mensajes** redactados.
4. Su **panel de KPIs reales** sirve para hablar de decisiones basadas en datos.
5. Un **diferenciador innovador**: el chatbot con IA para pedir en lenguaje natural.
6. El **pago contra entrega** encaja bien con los hábitos del consumidor peruano.
7. **Segmentación natural** por tipo de comida, por delivery Express y por restaurantes destacados.

### Debilidades y riesgos
1. Hay **promesas sin respaldo** (cupones, mapa en tiempo real, reseñas). Deben presentarse como "fase 2" o retirarse del copy.
2. No hay **medición**: sin analítica no se pueden reportar resultados de campañas.
3. La **competencia** es fuerte y consolidada en Perú: Rappi, PedidosYa y, en menor medida, apps propias de cadenas.
4. Le falta el **lado de oferta**: no hay estrategia ni herramientas para captar restaurantes y repartidores.
5. Sin **pagos reales**, no puede operar comercialmente.

### Encaje según el tipo de trabajo

| Tipo de proyecto de marketing | Encaje |
|---|---|
| Plan de marketing para una startup de delivery (FODA, PESTEL, 4P/7P, buyer persona, posicionamiento, competencia) | ✅ Muy bueno |
| Análisis de UX y embudo de conversión | ✅ Bueno |
| Pitch o presentación de emprendimiento | ✅ Bueno, presentándolo como MVP |
| Campaña de marketing digital con métricas reales | ⚠️ Requiere analítica y usuarios reales |
| Estrategia de promociones o fidelización | ⚠️ Requiere implementar cupones, reseñas o referidos, o proponerlos como roadmap |

### Ideas de mejora con impacto en marketing (roadmap)
- Sistema de **cupones** (por ejemplo, de bienvenida o por primer pedido) que cumpla la promesa de la landing.
- **Reseñas y calificaciones reales** de restaurantes.
- **Google Analytics 4 / Meta Pixel** y captura de **UTM** en el registro.
- **Programa de referidos** ("invita a un amigo").
- Notificaciones por **email o WhatsApp** (confirmación, carrito abandonado, reactivación).
- Campos de **distrito** y canal de adquisición en el registro, para segmentar.
- Seguimiento real del repartidor (mapa) y onboarding de restaurantes.

---

## 8. Instrucciones para el asistente que reciba este documento
- Distingue siempre entre lo **implementado** (secciones 2 y 6) y lo **prometido o no existente** (secciones 3 y 4). No presentes como real algo de las secciones 3 o 4.
- El contexto de mercado es **Perú (Lima)**, con moneda en soles.
- El usuario es estudiante universitario de Ingeniería Informática y quiere evaluar o reutilizar QuickEats como base de un proyecto de mercadotecnia.
