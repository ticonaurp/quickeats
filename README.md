# QuickEats — Cloud-Native Delivery Platform 🚀

**Universidad Ricardo Palma**
**Facultad de Ingeniería**
**Escuela Profesional de Ingeniería Informática**

---

## 👥 Integrantes
* **Alejandro Jesus Briceño Angulo** — `202112454@urp.edu.pe`
* **Mathias Hernan Ticona Alvarez** — `mathias.ticona@urp.edu.pe`
* **Jesus Keith Sanchez Castillon** — `202010163@urp.edu.pe`

* **Modalidad elegida:** Modalidad A — Proyecto integrador

---

## 📝 Descripción Breve del Proyecto

La solución propuesta consiste en **QuickEats**, una mini plataforma de delivery inspirada en aplicaciones como Uber Eats, diseñada bajo un enfoque de arquitectura distribuida basada en microservicios. El proyecto busca aplicar de manera integrada los principios de desarrollo cloud-native, automatización de despliegues y separación de responsabilidades en servicios independientes, replicando un caso de uso realista del sector gastronómico digital. Los usuarios finales podrán registrarse, autenticarse, explorar restaurantes con sus respectivos menús y generar órdenes de pedido.

La arquitectura técnica de la plataforma aprovecha las ventajas de un entorno contenerizado y desacoplado, donde el frontend desarrollado en **Next.js con Tailwind CSS** consume servicios a través de un **API Gateway** centralizado, el cual orquesta la comunicación HTTP REST entre cuatro microservicios independientes (**autenticación, restaurantes, órdenes y notificaciones**) construidos en **NestJS con Prisma ORM** y autenticación basada en **JWT**. La persistencia de datos se gestiona mediante **PostgreSQL** (Supabase), mientras que el ecosistema se despliega de forma automatizada a través de un pipeline de integración y entrega continua en **GitHub Actions** hacia la plataforma cloud **Microsoft Azure** (Azure Container Registry + Azure Container Apps), asegurando un entorno escalable y portable. Despliegue en producción: `https://ca-frontend.braveground-047a1b6e.eastus2.azurecontainerapps.io`.

---

## 📐 Arquitectura del Sistema

El frontend habla **únicamente con el Gateway**, y el Gateway reenvía cada petición al microservicio correspondiente por su DNS interno. La única comunicación servicio-a-servicio es: al crear una orden, `order-service` notifica a `notification-service`.

| Componente | Puerto | Stack | Responsabilidad |
|---|---|---|---|
| `frontend` | 3000 | Next.js / React / Tailwind | UI: landing, registro/login, catálogo, carrito, pago, "Mis Pedidos" y panel de admin. |
| `gateway` | 3001 | NestJS | Puerta de entrada única (reverse proxy); enruta a los microservicios. |
| `auth-service` | 3002 | NestJS + Prisma + JWT | Registro, login, emisión/validación de tokens (bcrypt + JWT). |
| `restaurant-service` | 3003 | NestJS + Prisma | Catálogo de **restaurantes y productos** (menús). |
| `order-service` | 3004 | NestJS + Prisma | Creación y seguimiento de **órdenes**; avisa al notification-service. |
| `notification-service` | 3005 | NestJS + Prisma | **Notificaciones** del usuario (p. ej. "orden creada"). |

**Persistencia:** PostgreSQL en **Supabase** (compartido por los microservicios, cada uno con su propio esquema/tablas).

---

## 🧰 Stack Tecnológico

* **Frontend:** Next.js + React + TypeScript + Tailwind CSS
* **Backend (microservicios):** NestJS + TypeScript + Prisma ORM (driver `pg`)
* **Autenticación:** JWT + bcrypt
* **Base de datos:** PostgreSQL (Supabase)
* **Contenedores:** Docker + Docker Compose
* **Orquestación:** Kubernetes (manifiestos en `k8s/`, probado en Docker Desktop)
* **CI/CD:** GitHub Actions
* **Cloud:** Microsoft Azure (Azure Container Registry + Azure Container Apps)

---

## 📚 Tópicos Elegidos (Modalidad A)

Para el desarrollo e integración de esta solución de TI, se han seleccionado los siguientes 5 tópicos del plan de estudios:

1. **Control de versiones (Git):** Implementación de un repositorio colaborativo unificado (Monorepo) en GitHub, aplicando la estrategia de ramificación GitFlow (ramas `main`, `develop` y `feature/*` independientes) para garantizar un historial de cambios limpio, auditoría de código y revisiones mediante Pull Requests entre los integrantes del equipo.
2. **Contenedores (Docker):** Contenerización completa de la arquitectura utilizando un Dockerfile optimizado por cada microservicio (`auth-service`, `restaurant-service`, `order-service`, `notification-service` y `gateway`) y uno adicional para el frontend Next.js, gestionando la orquestación local y la configuración de redes aisladas entre servicios mediante Docker Compose.
3. **Orquestación (Kubernetes):** Implementación de manifiestos Kubernetes (Deployments, Services e Ingress) ejecutados localmente mediante Minikube o kind, permitiendo orquestar y administrar el conjunto de microservicios en un entorno reproducible basado en contenedores.
4. **DevOps / CI-CD:** Automatización del flujo de integración y entrega continua mediante GitHub Actions, configurando pipelines para instalación de dependencias, validación de compilación, construcción de imágenes Docker y despliegue automatizado hacia el entorno cloud conectado al repositorio principal.
5. **Cloud Computing:** Despliegue de la aplicación en producción sobre **Microsoft Azure**, usando **Azure Container Registry (ACR)** para almacenar las imágenes Docker y **Azure Container Apps (CaaS)** para ejecutar cada servicio de forma independiente y escalable. Las imágenes se construyen automáticamente desde GitHub Actions, gestionando variables de entorno seguras y proveyendo certificados SSL (HTTPS) nativos para todas las comunicaciones.

---

## ⚙️ Cómo levantar el proyecto en una PC nueva

> La base de datos está en **Supabase (la nube)**: **no** hay que instalar PostgreSQL.

### 0. Prerrequisitos
* **Node.js 20**
* **Git** (en Windows incluye **Git Bash**, necesario para el script de instalación)
* **Docker Desktop** (solo si se usará la Opción B o Kubernetes)

### 1. Clonar el repositorio
```bash
git clone https://github.com/ticonaurp/quickeats.git
cd quickeats
git checkout develop   # rama con la versión más reciente
```

### 2. Crear los archivos `.env` (OBLIGATORIO — no vienen en el repo)
Crea estos **6 archivos**, cada uno en su carpeta, con este contenido exacto:

**`frontend/.env`**
```
NEXT_PUBLIC_SUPABASE_URL=https://nbtsxxhnsjhplwvqjtwu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_bbvDdAVajwIIUTb4kxizrA_54XDJCZi
NEXT_PUBLIC_API_URL=http://127.0.0.1:3001
```

**`gateway/.env`**
```
AUTH_SERVICE_URL=http://auth-service:3002
RESTAURANT_SERVICE_URL=http://restaurant-service:3003
ORDER_SERVICE_URL=http://order-service:3004
NOTIFICATION_SERVICE_URL=http://notification-service:3005
```

**`auth-service/.env`**
```
JWT_SECRET=quickeats_jwt_2026_4f8b1c9d2e7a6f30b5c4d8e1a9f2c7b6
DATABASE_URL=postgresql://postgres.nbtsxxhnsjhplwvqjtwu:quickeats2026@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?schema=public
DIRECT_URL=postgresql://postgres.nbtsxxhnsjhplwvqjtwu:quickeats2026@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?schema=public
```

**`restaurant-service/.env`**
```
DATABASE_URL="postgresql://postgres.nbtsxxhnsjhplwvqjtwu:quickeats2026@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres.nbtsxxhnsjhplwvqjtwu:quickeats2026@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?schema=public"
```

**`order-service/.env`**
```
DATABASE_URL="postgresql://postgres.nbtsxxhnsjhplwvqjtwu:quickeats2026@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&schema=public"
DIRECT_URL="postgresql://postgres.nbtsxxhnsjhplwvqjtwu:quickeats2026@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?schema=public"
```

**`notification-service/.env`**
```
DATABASE_URL="postgresql://postgres.nbtsxxhnsjhplwvqjtwu:quickeats2026@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&schema=public"
DIRECT_URL="postgresql://postgres.nbtsxxhnsjhplwvqjtwu:quickeats2026@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?schema=public"
```

> Los certificados `supabase-ca.crt` **sí vienen** en el repo. No se versionan los `.env` por seguridad; en producción estas variables van como secretos en Azure.

---

### Opción A — Local con un solo comando (recomendada, más liviana)
```bash
# 1) Instalar dependencias + generar Prisma en los 6 proyectos (en Git Bash)
bash install-all.sh

# 2) Instalar la herramienta que levanta todo junto (concurrently)
npm install

# 3) Levantar los 6 servicios en una sola terminal
npm run start:all
```
Abrir **http://localhost:3000**. Para apagar todo: `Ctrl + C`.

### Opción B — Con Docker (microservicios en contenedores)
```bash
# Levanta los 5 microservicios del backend (Gateway 3001 + auth/restaurant/order/notification)
docker compose up -d --build

# En otra terminal, levantar el frontend
cd frontend && npm install && npm run dev
```
Abrir **http://localhost:3000**. Para apagar el backend: `docker compose down`.

### Opción C — Kubernetes (orquestación)
Ver la guía detallada en **[`k8s/README.md`](./k8s/README.md)** (Docker Desktop con Kubernetes habilitado → `kubectl apply -f k8s/`).

---

### Credenciales de prueba
| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `topicos2@gmail.com` | `Prueba12345` |
| Usuario | `topicos1@gmail.com` | `Prueba12345` |

---

## 🛣️ Endpoints principales (a través del Gateway, puerto 3001)

| Módulo | Método y ruta | Descripción |
|---|---|---|
| Auth | `POST /auth/register` · `POST /auth/login` | Registro y login (devuelve JWT). |
| Restaurantes | `GET /restaurants` · `POST /restaurants` · `PATCH /restaurants/:id` | Listar, crear y editar restaurantes. |
| Productos | `GET /products` · `POST /products` · `PUT /products/:id` · `DELETE /products/:id` | CRUD de productos (filtrable por `?restaurantId=`). |
| Órdenes | `POST /orders` · `GET /orders` · `GET /orders/user/:id` · `PATCH /orders/:id/status` | Crear orden, historial y cambio de estado. |
| Notificaciones | `GET /notifications/:userId` · `POST /notifications` · `PATCH /notifications/:id/read` | Avisos del usuario. |

---

## ✅ Estado del proyecto (tópicos cumplidos)

| Tópico | Estado |
|---|---|
| Control de versiones (Git / GitFlow) | ✅ |
| Contenedores (Docker + Docker Compose) | ✅ |
| Orquestación (Kubernetes — `k8s/`) | ✅ |
| DevOps / CI-CD (GitHub Actions) | ✅ |
| Cloud Computing (Azure ACR + Container Apps) | ✅ |
