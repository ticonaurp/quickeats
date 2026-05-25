```markdown
# QuickEats — Cloud-Native Delivery Platform 🚀

**Universidad Ricardo Palma** **Facultad de Ingeniería** **Escuela Profesional de Ingeniería Informática**

---

## 👥 Integrantes
* **Alejandro Jesus Briceño Angulo** — `202112454@urp.edu.pe`
* **Mathias Hernan Ticona Alvarez** — `mathias.ticona@urp.edu.pe`
* **Jesus Keith Sanchez Castillon** — `202010163@urp.edu.pe`

* **Modalidad elegida:** Modalidad A — Proyecto integrador

---

## 📝 Descripción Breve del Proyecto

La solución propuesta consiste en **QuickEats**, una mini plataforma de delivery inspirada en aplicaciones como Uber Eats, diseñada bajo un enfoque de arquitectura distribuida basada en microservicios. El proyecto busca aplicar de manera integrada los principios de desarrollo cloud-native, automatización de despliegues y separación de responsabilidades en servicios independientes, replicando un caso de uso realista del sector gastronómico digital. Los usuarios finales podrán registrarse, autenticarse, explorar restaurantes con sus respectivos menús y generar órdenes de pedido.

La arquitectura técnica de la plataforma aprovecha las ventajas de un entorno contenerizado y desacoplado, donde el frontend desarrollado en **Next.js con Tailwind CSS** consume servicios a través de un **API Gateway** centralizado, el cual orquesta la comunicación HTTP REST entre cuatro microservicios independientes (**autenticación, restaurantes, órdenes y notificaciones**) construidos en **NestJS con Prisma ORM** y autenticación basada en **JWT**. La persistencia de datos se gestiona mediante **PostgreSQL**, mientras que el ecosistema se despliega de forma automatizada a través de un pipeline de integración y entrega continua en **GitHub Actions** hacia la plataforma cloud **Render**, asegurando un entorno escalable y portable.

---

## 📐 Arquitectura del Sistema

La plataforma centraliza el flujo de peticiones de los clientes a través de un API Gateway unificado, distribuyendo la carga lógica y el almacenamiento de la siguiente manera:

* **`frontend` (Next.js / TypeScript):** Interfaz de usuario interactiva y optimizada para la autenticación, exploración del catálogo de restaurantes y gestión de pedidos.
* **`gateway` (NestJS - Puerto 3001):** Puerta de entrada única (Reverse Proxy) que valida el tráfico, unifica las rutas públicas y redirige las peticiones internamente a los microservicios correspondientes.
* **`auth-service` (NestJS):** Servicio encargado del registro de usuarios, control de accesos y emisión/validación de tokens JWT.
* **`restaurant-service` (NestJS - Puerto 3003):** Microservicio dedicado a la administración del catálogo de restaurantes y sus respectivos menús/productos utilizando Prisma 7.
* **`order-service` (NestJS):** Orquestador de las órdenes de compra, vinculando a los usuarios con los productos seleccionados.
* **`notification-service` (NestJS):** Sistema encargado del envío de alertas y notificaciones sobre el estado de los pedidos.

---

## 📚 Tópicos Elegidos (Modalidad A)

Para el desarrollo e integración de esta solución de TI, se han seleccionado los siguientes 5 tópicos del plan de estudios:

1. **Control de versiones (Git):** Implementación de un repositorio colaborativo unificado (Monorepo) en GitHub, aplicando la estrategia de ramificación GitFlow (ramas `main`, `develop` y `feature/*` independientes) para garantizar un historial de cambios limpio, auditoría de código y revisiones mediante Pull Requests entre los integrantes del equipo.
2. **Contenedores (Docker):** Contenerización completa de la arquitectura utilizando un Dockerfile optimizado por cada microservicio (`auth-service`, `restaurant-service`, `order-service`, `notification-service` y `gateway`) y uno adicional para el frontend Next.js, gestionando la orquestación local y la configuración de redes aisladas entre servicios mediante Docker Compose.
3. **Orquestación (Kubernetes):** Implementación de manifiestos Kubernetes (Deployments, Services e Ingress) ejecutados localmente mediante Minikube o kind, permitiendo orquestar y administrar el conjunto de microservicios en un entorno reproducible basado en contenedores.
4. **DevOps / CI-CD:** Automatización del flujo de integración y entrega continua mediante GitHub Actions, configurando pipelines para instalación de dependencias, validación de compilación, construcción de imágenes Docker y despliegue automatizado hacia el entorno cloud conectado al repositorio principal.
5. **Cloud Computing:** Despliegue de la aplicación en producción utilizando un modelo PaaS (Platform as a Service) a través de la plataforma Render. Se configurarán Web Services independientes que compilarán los contenedores automáticamente desde GitHub, gestionando variables de entorno seguras y proveyendo certificados SSL (HTTPS) nativos para todas las comunicaciones.

---

## 🚀 Guía de Inicio Rápido (Entorno Local)

### 1. Prerrequisitos
Asegúrate de tener instalado en tu máquina:
* Node.js (v18 o superior)
* Docker & Docker Compose
* Git

### 2. Clonar el Repositorio
```bash
git clone [https://github.com/ticonaurp/cloud-native-delivery-platform.git](https://github.com/ticonaurp/cloud-native-delivery-platform.git)
cd cloud-native-delivery-platform

```

### 3. Levantar la Infraestructura Base (PostgreSQL)

Inicia el contenedor de base de datos ejecutando el archivo `docker-compose.yml` en la raíz:

```bash
docker compose up -d

```

### 4. Inicializar el Microservicio de Restaurantes (`restaurant-service`)

Navega a la carpeta del servicio, instala las dependencias y corre las migraciones de Prisma 7 para mapear el esquema relacional en PostgreSQL:

```bash
cd restaurant-service
npm install
npx prisma db push
npm run start:dev

```

### 5. Inicializar el API Gateway (`gateway`)

En una terminal paralela, levanta la pasarela de entrada (Puerto 3001) para comenzar a redirigir el tráfico:

```bash
cd gateway
npm install
npm run start:dev

```

---

## 🛣️ Endpoints Disponibles a través del Gateway (Puerto 3001)

### 🍔 Módulo de Restaurantes

* `GET /restaurants` - Recupera todos los restaurantes registrados junto con su lista de productos asociados (`include: { products: true }`).
* `POST /restaurants` - Registra un nuevo establecimiento en la plataforma.
```json
{
  "name": "Pizza Planet",
  "description": "Comida rápida intergaláctica"
}

```



### 🍕 Módulo de Productos

* `GET /products` - Lista el catálogo global de productos disponibles en el sistema.
* `POST /products` - Agrega un platillo al menú de un restaurante específico mapeando su ID correspondiente.
```json
{
  "name": "Pizza Pepperoni Familiar",
  "description": "Grande con extra queso",
  "price": 45.9,
  "restaurantId": "UUID_DEL_RESTAURANTE"
}

```



---

## 📈 Roadmap y Avance del Proyecto

* [x] Documentación inicial, delimitación de la arquitectura y definición de integrantes.
* [x] Contenerización y configuración de la Base de Datos relacional PostgreSQL.
* [x] Desarrollo del microservicio central `restaurant-service` integrado con Prisma 7 y `PrismaPg`.
* [x] Implementación del Proxy Inverso en el `gateway` (Enrutamiento del Puerto 3001 ➡️ 3003).
* [ ] Conexión de la interfaz web `frontend` (Next.js) para Login y catálogo dinámico.
* [ ] Implementación de la lógica de negocio transaccional en `order-service`.
* [ ] Configuración del sistema de alertas asíncronas en `notification-service`.
* [ ] Diseño de manifiestos y orquestación local con Kubernetes.
* [ ] Automatización e integración del pipeline CI/CD en GitHub Actions hacia Render.

```

### 💡 Pasos para actualizarlo en tu proyecto:
1. Copia este bloque de código.
2. Abre el archivo `README.md` en la raíz de tu proyecto en VS Code, borra lo que haya y pega esto.
3. Haz un nuevo commit rápido para que quede actualizado en tu GitHub:
```bash
git add README.md
git commit -m "docs: update README with official project name QuickEats and academic details"
git push origin main

```
