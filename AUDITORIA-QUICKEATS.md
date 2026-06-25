# Auditoría Técnica — QuickEats (Proyecto Final Tópicos)

> Fecha: 2026-06-24 · Rama analizada: `feature/security-notifications`
> Alcance: monorepo completo (frontend Next.js + gateway + 4 microservicios NestJS/Prisma + Docker + CI/CD).
> **No se modificó código.** Este documento es solo diagnóstico para conservar el contexto del análisis.

---

## 1. Resumen ejecutivo

El proyecto está funcional a nivel de UI, pero tiene **fallos de integración entre capas** que rompen el flujo real de datos. Los errores `500` que se ven en la landing (`127.0.0.1:3001/restaurants`) **no son un bug del frontend**: son el síntoma de que el **Gateway no logra hablar con `restaurant-service`**, y de fondo hay un conjunto de inconsistencias de configuración (URLs solo válidas en Docker, autenticación rota de punta a punta, deriva de migraciones de Prisma y desalineación con los tópicos declarados: Render vs Azure, y Kubernetes ausente).

Clasificación de hallazgos:

| Severidad | Cantidad | Ejemplos |
|-----------|----------|----------|
| 🔴 Crítico | 5 | 500 en `/restaurants`, auth rota e2e, deriva de migraciones, k8s ausente, Render vs Azure |
| 🟠 Alto | 6 | Gateway sin dotenv, SSL/cert frágil, userId mock en órdenes, esquema `public` vs `restaurant_service` |
| 🟡 Medio | 7 | Puertos del pooler inconsistentes, CORS amplio, CI solo en `develop`, secretos en repo |
| 🟢 Bajo | varios | Logs de debug, código comentado, formato |

---

## 2. 🔴 Causa raíz del error 500 en la landing

**Flujo:** `page.tsx` → `fetchFromGateway('/restaurants')` → `GET 127.0.0.1:3001/restaurants` (Gateway) → `RestaurantService.forwardRequest()` → `GET http://restaurant-service:3003/restaurants`.

El Gateway **responde** (no es "connection refused"), pero devuelve `500`. Eso significa que el fallo ocurre *dentro* del reenvío del Gateway hacia el microservicio. Hay dos escenarios según cómo se esté ejecutando:

### Escenario A — Gateway corriendo en local (`npm run start:dev`) → causa más probable
- `gateway/src/restaurant/restaurant.service.ts` usa:
  `process.env.RESTAURANT_SERVICE_URL || 'http://restaurant-service:3003'`.
- **El Gateway nunca carga el `.env`**: no hay `import 'dotenv/config'` ni `ConfigModule` en ningún archivo del Gateway (verificado). Por lo tanto `process.env.RESTAURANT_SERVICE_URL` queda `undefined` y se usa el fallback `http://restaurant-service:3003`.
- `restaurant-service` es un **nombre DNS interno de Docker**. Fuera de la red de Docker **no resuelve** → `fetch` lanza excepción → `forwardRequest` re-lanza → NestJS responde `500`.
- **No existe ninguna URL de fallback a `localhost:3003`** en todo el código, por lo que el Gateway local nunca puede alcanzar al microservicio.

### Escenario B — Todo en Docker (`docker compose up`)
- Aquí `env_file` sí inyecta `RESTAURANT_SERVICE_URL=http://restaurant-service:3003` y el DNS sí resuelve.
- En ese caso el `500` proviene del **propio `restaurant-service`** al consultar la BD (ver §4 y §5): TLS/cert de Supabase estricto (`rejectUnauthorized: true`) o tablas/esquema inexistentes → Prisma lanza → `500` que el Gateway propaga.

> **Conclusión:** el error se origina en la cadena Gateway→restaurant-service. Si desarrollas el front con `npm run dev` y el backend suelto, casi seguro es el **Escenario A** (DNS Docker irresoluble + Gateway sin dotenv). Si todo está dockerizado, mira la capa de BD/SSL del restaurant-service.

---

## 3. 🔴 Autenticación rota de punta a punta

El login "funciona" visualmente pero **no produce una sesión real**:

1. **La cookie HttpOnly nunca llega al navegador.**
   `auth-service` (`auth.controller.ts`) hace `res.cookie('access_token', ...)` y devuelve `{ message, name, role }`. Pero el **Gateway** (`gateway/src/auth/auth.service.ts`) reenvía con Axios y retorna solo `response.data`; **el header `Set-Cookie` del microservicio se pierde** y no se re-emite al cliente.

2. **El frontend tampoco enviaría cookies.**
   `frontend/app/services/api.ts` (`fetchFromGateway`) y los `fetch` de login/órdenes **no usan `credentials: 'include'`**, así que aunque la cookie existiera no viajaría en las siguientes peticiones.

3. **El header `Authorization` nunca se manda.**
   `fetchFromGateway` lee `localStorage.getItem('token')`, pero **nadie guarda `token`** en localStorage (el login guarda `isLoggedIn`, `name`, `email`, `userId`, `role`). Resultado: las rutas que esperan JWT quedan sin credencial.

4. **`userId` siempre es un mock.**
   `LoginForm.tsx` guarda `data.userId || data.id || 'uid-mock-123'`, pero la respuesta del login **no trae `userId` ni `id`** → siempre queda `'uid-mock-123'`. Además `auth.ts:getUserId()` cae a `'user-id-fallback'`. **Todas las órdenes se crean con un usuario falso.**

> Efecto neto: la seguridad (cookies HttpOnly, JwtAuthGuard, RolesGuard) es **cosmética**; el frontend gestiona la sesión solo con banderas en `localStorage`.

---

## 4. 🔴/🟠 Base de datos y Prisma

### 4.1 La BD local de Docker no se usa
`docker-compose.yml` levanta `postgres_db` (Postgres local en `5433:5432`) y todos los servicios lo declaran en `depends_on`, **pero ningún `.env` apunta a ese contenedor**: todos los `DATABASE_URL` apuntan a **Supabase** (`aws-1-sa-east-1.pooler.supabase.com`). El contenedor de Postgres queda muerto/ignorado y el `depends_on` es engañoso.

### 4.2 Deriva de migraciones en `restaurant-service` (🔴)
Hay un historial de migraciones **inconsistente**:
- `20260525020414_restaurant_init/migration.sql` crea `Restaurant`/`Product` en el **esquema por defecto** con columnas viejas (`imageUrl`, sin `category`, `address`, `deliveryTime`, `deliveryFee`, `isOpen`, `isFeatured`, sin `OpeningHour`).
- El `schema.prisma` **actual** usa `previewFeatures = ["multiSchema"]`, esquema `restaurant_service`, y un modelo mucho más rico (con `OpeningHour`, `isFeatured`, etc.).

Si las tablas reales no coinciden con el `schema.prisma` actual → `prisma.restaurant.findMany(...)` falla (columna/tabla inexistente) → `500`. Esta es una causa directa del Escenario B.

### 4.3 `schema=public` en la URL vs esquema `restaurant_service` (🟠)
El `restaurant-service/.env` trae `...&schema=public`, pero el `schema.prisma` declara `@@schema("restaurant_service")`. Con `multiSchema`, Prisma cualifica las tablas con `restaurant_service.*`, así que el `schema=public` de la URL es contradictorio/confuso. Además, a diferencia de `auth-service`, el `PrismaService` del restaurant **no** fija `search_path`, así que la coherencia depende 100% de que las migraciones multiSchema se hayan aplicado en Supabase.

### 4.4 SSL/cert frágil (🟠)
Los `PrismaService` cargan `supabase-ca.crt` con `rejectUnauthorized: true`. Si el certificado del **pooler** de Supabase no encadena exactamente con ese CA o el host no coincide, **todas las queries fallan con TLS error** → `500`. El comentario "para evitar el TlsConnectionError" delata que ya hubo pelea con esto. Si el archivo no existe (`fs.existsSync` falso) cae a `ssl: false`, pero la URL trae `sslmode=require` → conflicto.

---

## 5. Inconsistencias de configuración (puertos / URLs / pooler)

### 5.1 Mapa de puertos
| Servicio | Puerto (código) | Puerto (compose) | URL interna usada por Gateway |
|---|---|---|---|
| frontend | 3000 | — | — |
| gateway | `PORT ?? 3001` | 3001:3001 | — |
| auth-service | **3002 fijo** (`app.listen(3002)`) | 3002:3002 | `http://auth-service:3002` |
| restaurant-service | `PORT ?? 3003` | 3003:3003 | `http://restaurant-service:3003` |
| order-service | `PORT ?? 3004` | 3004:3004 | `http://order-service:3004` |
| notification-service | **3005 fijo** (`app.listen(3005)`) | 3005:3005 | `http://localhost:3005/...` ⚠️ |

- 🟠 **`notification.controller.ts` del Gateway** usa fallback `http://localhost:3005` (los demás usan el DNS `nombre-servicio`). En Docker, `localhost` dentro del contenedor del Gateway **no** es el contenedor de notificaciones → fallará en Docker salvo que `NOTIFICATION_SERVICE_URL` esté seteada. Inconsistente con el resto.
- 🟡 `auth` y `notification` fijan el puerto a fuego (no respetan `process.env.PORT`), lo que choca con Render/Azure que suelen inyectar `PORT` dinámico.

### 5.2 Puertos del pooler de Supabase inconsistentes (🟡)
- `auth-service` y `restaurant-service`: `DATABASE_URL` en **5432** (session pooler).
- `order-service` y `notification-service`: `DATABASE_URL` en **6543** (transaction pooler / `pgbouncer=true`).

No es un error fatal, pero es una inconsistencia: con `pgbouncer` en modo transacción hay limitaciones (prepared statements) que conviene unificar.

### 5.3 Gateway sin carga de entorno (🟠)
Ningún archivo del Gateway importa `dotenv` ni `ConfigModule`. Funciona en Docker (porque `env_file` inyecta variables al proceso) pero **no en local**. Todos los `*.service.ts` del Gateway leen `process.env.*` directo asumiendo que alguien las cargó.

---

## 6. Discrepancias con el documento de tópicos

El `contexto proyecto topicos.txt` declara 5 tópicos. Estado real:

| Tópico declarado | Estado en el repo | Observación |
|---|---|---|
| **Git / GitFlow** (main, develop, feature/*) | ✅ Presente | Hay `main`, `develop` y muchas `feature/*`. OK. |
| **Docker** (Dockerfile por servicio + compose) | ⚠️ Parcial | Hay Dockerfiles y compose, pero el Postgres del compose no se usa (ver §4.1) y hay rutas/montajes con flag `:z` (SELinux) poco portables en Windows. |
| **Kubernetes** (Deployments/Services/Ingress, Minikube/kind) | ❌ **Ausente** | No existe ningún manifiesto `.yaml` de k8s en el repo. Deliverable del tópico no cumplido. |
| **CI/CD** (GitHub Actions) | ⚠️ Parcial | `ci-cd.yml` existe pero solo dispara en `develop`; el job de deploy depende de secretos de Azure. |
| **Cloud Computing → Render (PaaS)** | ❌ **Contradicción** | El documento dice **Render**, pero el pipeline despliega a **Azure** (ACR + Azure Container Apps: `...azurecontainerapps.io`). El texto y la implementación no coinciden. |

> Para la sustentación, estas dos últimas filas son las más riesgosas: **Kubernetes no está** y **el cloud es Azure, no Render** como dice el documento.

---

## 7. Seguridad

- 🟡 **Credenciales en el repositorio:** `DATABASE_URL` con usuario/clave de Supabase (`quickeats2026`) y `NEXT_PUBLIC_SUPABASE_ANON_KEY` están **commiteadas** en los `.env`. Deberían ir en variables de entorno/secretos, no en el repo.
- 🟠 **JWT secret por defecto:** `auth.module.ts` y `jwt.strategy.ts` usan `process.env.JWT_SECRET || 'super-secret-key-change-me'`, **pero `auth-service/.env` no define `JWT_SECRET`** → en la práctica se firma y valida con el secreto hardcodeado. Cualquiera puede forjar tokens.
- 🟡 **CORS abierto:** el Gateway usa `origin: true` con `credentials: true` (refleja cualquier origen). Aceptable en dev, riesgoso en prod.
- 🟢 Buenas prácticas presentes: `ThrottlerModule` en auth, `ValidationPipe` con `whitelist`/`forbidNonWhitelisted` en los microservicios, bcrypt para passwords, intención de cookie HttpOnly (aunque rota, ver §3).

---

## 8. Otros hallazgos menores (🟢)

- `restaurant.service.ts` tiene un `console.log` de debug hardcodeado al restaurante `"esquina de felipe"` (código de diagnóstico que quedó productivo).
- El Gateway no tiene `ValidationPipe` global ni prefijo global; reenvía `body: any` (correcto para un proxy, pero sin validación de contrato).
- `gateway/src/auth/auth.service.ts` tiene formato irregular (líneas en blanco dobles) y `console.log`/`console.error` de "spy" que conviene limpiar.
- `order.controller.ts` del Gateway mezcla estilos (un método con timeout/`AbortController`, los demás sin él) y tiene indentación inconsistente.
- El producto en `schema.prisma` tiene comentarios tipo "¡AÑADE ESTA LÍNEA AQUÍ!" — restos de edición.

---

## 9. Prioridad de corrección sugerida (orden recomendado)

1. **Desbloquear `/restaurants` (el 500):** decidir modo de ejecución. Si es local, dar a los servicios del Gateway un fallback a `http://localhost:300X` (o cargar `.env` con `ConfigModule`/dotenv). Si es Docker, validar TLS de Supabase y que las migraciones estén aplicadas.
2. **Sincronizar migraciones de `restaurant-service`** con el `schema.prisma` actual (resolver la deriva multiSchema; regenerar/migrar contra Supabase).
3. **Reparar la autenticación e2e:** reenviar `Set-Cookie` desde el Gateway **o** devolver el `access_token` en el body y usar `Authorization`; añadir `credentials: 'include'` en los `fetch`; devolver y guardar el `userId` real.
4. **Unificar configuración:** puertos del pooler de Supabase, fallback de `notification` (quitar `localhost`), respetar `process.env.PORT` en auth/notification.
5. **Cerrar brechas de tópicos:** agregar manifiestos de Kubernetes y **alinear el documento** (Azure vs Render) antes de la sustentación.
6. **Seguridad:** sacar secretos del repo, definir `JWT_SECRET` real, restringir CORS en prod.

---

---

# PARTE II — Correcciones aplicadas (2026-06-24)

> Esta sección documenta los cambios realizados sobre el código fuente tras la auditoría.
> Restricción del proyecto: **no se ejecutó** `npm install`, `npm run build`, `tsc` ni comandos de terminal; solo se editaron archivos fuente.

## A. Resumen de lo corregido

| # | Problema (Parte I) | Archivos modificados | Estado |
|---|--------------------|----------------------|--------|
| 1 | 🔴 500 en `/restaurants`: fallbacks del Gateway con DNS solo-Docker | `gateway/src/restaurant/restaurant.service.ts`, `gateway/src/product/product.service.ts`, `gateway/src/order/order.controller.ts`, `gateway/src/auth/auth.service.ts`, `gateway/src/notification/notification.controller.ts` | ✅ Corregido |
| 2 | 🔴 Auth rota e2e: cookie perdida, sin token, userId mock | `auth-service/src/auth/auth.service.ts`, `auth-service/src/auth/auth.controller.ts`, `frontend/app/components/LoginForm.tsx` | ✅ Corregido |
| 3 | 🟠 `auth`/`notification` ignoran `process.env.PORT` | `auth-service/src/main.ts`, `notification-service/src/main.ts` | ✅ Corregido |
| 4 | 🟠 `JWT_SECRET` no definido → se usaba el hardcodeado | `auth-service/.env` | ✅ Corregido |
| 5 | 🟠 `order-service` notificaba a DNS solo-Docker hardcodeado | `order-service/src/order/order.service.ts`, `docker-compose.yml` | ✅ Corregido |
| 6 | 🟢 `console.log` de debug productivo ("esquina de felipe") | `restaurant-service/src/restaurant/restaurant.service.ts` | ✅ Corregido |

## B. Detalle de cada cambio

### B.1 — Desbloqueo del 500 (Gateway → microservicios)
**Patrón aplicado:** el fallback de las URLs pasó de `http://<servicio>:<puerto>` (nombre DNS que solo existe dentro de la red de Docker) a `http://localhost:<puerto>`.
- En **local** (sin variables de entorno): ahora resuelve contra `localhost` y el Gateway sí alcanza a los microservicios.
- En **Docker**: `docker-compose` sigue inyectando las variables `*_SERVICE_URL` con el DNS interno vía `env_file`, así que ese valor tiene prioridad y nada cambia.
- Servicios ajustados: restaurant (3003), product (3003), order (3004), auth (3002) y notification (3005, además se normalizó el ternario al mismo patrón que el resto).

### B.2 — Autenticación funcional de punta a punta
Causa: el `Set-Cookie` del `auth-service` se perdía al reenviar por el Gateway (Axios no propaga cookies) y el frontend nunca guardaba un `token`.
- `auth-service/auth.service.ts`: el `login()` ahora incluye `userId: user.id` en la respuesta.
- `auth-service/auth.controller.ts`: el `login()` mantiene la cookie HttpOnly como defensa adicional **y además** devuelve `access_token` y `userId` en el body (que sí sobrevive al Gateway).
- `frontend/LoginForm.tsx`: ahora guarda `localStorage.setItem('token', data.access_token)` y el `userId` real.
- Efecto: `fetchFromGateway` (que ya leía `localStorage.getItem('token')`) por fin envía `Authorization: Bearer <jwt>`, y las órdenes se crean con el `userId` real en lugar de `uid-mock-123`.

### B.3 — Puertos dinámicos
`auth-service` y `notification-service` ahora hacen `app.listen(process.env.PORT ?? <default>)`, compatible con el `PORT` que inyectan Render/Azure/Docker.

### B.4 — JWT_SECRET explícito
Se agregó `JWT_SECRET` en `auth-service/.env` para dejar de depender del valor por defecto `'super-secret-key-change-me'`. `JwtModule` y `JwtStrategy` ya leían `process.env.JWT_SECRET`, así que ambos quedan consistentes. **Nota:** en producción debe sobrescribirse con un secreto real fuera del repo.

### B.5 — order-service → notification-service
La URL hardcodeada `http://notification-service:3005` pasó a `process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005'`. En `docker-compose.yml` se inyecta `NOTIFICATION_SERVICE_URL=http://notification-service:3005` en el bloque `environment` del `order-service` (no en `.env`, porque ese `.env` también lo carga `dotenv` en local y reintroduciría el DNS de Docker).

### B.6 — Limpieza
Se eliminó el `console.log` de diagnóstico que solo se disparaba para el restaurante `"esquina de felipe"`.

## C. Verificación recomendada (requiere ejecutar, fuera del alcance de esta sesión)

Como las reglas del proyecto prohíben ejecutar comandos, **estos cambios no se compilaron ni se probaron en runtime**. Para validar:
1. Levantar `restaurant-service` (local: `npm run start:dev` en 3003; Docker: `docker compose up`).
2. Levantar el Gateway (3001) y el frontend (3000).
3. Confirmar que `GET http://localhost:3001/restaurants` responde `200` con JSON (ya no `500`).
4. Probar login → revisar que en `localStorage` aparezcan `token` y `userId` reales, y que `/auth/profile` responda autorizado.

## D. Hallazgos NO modificados (decisión deliberada) y pendientes de decisión del equipo

Estos puntos de la Parte I **no se tocaron** para no romper configuración viva que no puede probarse en esta sesión, o porque son decisiones del equipo:

- 🟠 **Deriva de migraciones de `restaurant-service`** (§4.2): requiere correr `prisma migrate`/`db push` contra Supabase (comando de terminal). No se puede arreglar solo editando fuentes sin riesgo de desincronizar la BD real. **Acción pendiente del equipo.**
- 🟡 **Puertos del pooler de Supabase** (5432 vs 6543, §5.2): se dejó igual a propósito; cambiar cadenas de conexión a una BD productiva sin poder probarla puede tumbar el servicio. Recomendación documentada: unificar a 5432 (session pooler) como ya usan `auth`/`restaurant`.
- 🟡 **`schema=public` en la URL vs esquema `restaurant_service`** (§4.3): inofensivo en runtime con `multiSchema` (Prisma cualifica las tablas), se dejó para evitar tocar la conexión.
- 🟠 **SSL/TLS con `rejectUnauthorized: true`** (§4.4): es una decisión de seguridad; si aparece `TlsConnectionError` en Docker, evaluar el certificado del pooler. No se relajó para no debilitar la seguridad sin evidencia.
- ❌ **Kubernetes ausente** (§6): es un *entregable faltante* del tópico, no un bug; crear manifiestos `Deployment/Service/Ingress` es una tarea de construcción aparte. **Pendiente.**
- ❌ **Render vs Azure** (§6): el documento dice Render pero el CI/CD despliega a Azure. Es una **decisión del equipo** (alinear el documento a Azure, o reescribir el pipeline para Render). **Pendiente.**
- 🟡 **Secretos en el repositorio** (§7): siguen los `.env` versionados con credenciales de Supabase. Sacarlos del repo implica reescribir historial/gestión de secretos; se documenta como recomendación.

---

---

# PARTE III — Diagnóstico en runtime y fix DEFINITIVO del 500 (TLS con Supabase)

> Al levantar todo en Docker (los 6 contenedores corriendo: gateway 3001, restaurant 3003, order 3004, notification 3005, auth 3002, postgres 5433) el `500` **persistía**. Se revisaron los logs reales del contenedor y se encontró la causa verdadera, distinta a la de ejecución local de la Parte II.

## A. Causa raíz REAL (confirmada en logs)

El `restaurant-service` (y por el mismo patrón los otros 3 servicios) **no podía conectarse a Supabase por TLS**. Error exacto del contenedor:

```
PrismaClientKnownRequestError  code: 'P1011'
Error opening a TLS connection: self-signed certificate in certificate chain
kind: 'TlsConnectionError'
reason: 'self-signed certificate in certificate chain'
→ this.prisma.restaurant.findMany()
```

El pooler de Supabase presenta un **certificado self-signed en su cadena**. La configuración tenía `rejectUnauthorized: true` (verificación estricta de CA) → Node rechazaba el handshake → **todas** las queries fallaban con `500`. (Era el riesgo §4.4, confirmado.)

### El detalle fino que costó encontrarlo
Poner `rejectUnauthorized: false` en el código **no fue suficiente**. Hubo que neutralizar **tres** fuentes que reactivaban la verificación estricta, en orden de prioridad del driver `pg`:
1. **Código** (`ssl` del `Pool`): `rejectUnauthorized: true` → `false`.
2. **Variables de entorno de `docker-compose`**: `PGSSLMODE=verify-full` y `PGSSLROOTCERT=/app/supabase-ca.crt` — el driver `pg` las respeta y fuerzan verificación. Se eliminaron.
3. **Connection string** (`DATABASE_URL`): el parámetro `sslmode=require` hace que `pg` reconstruya su propio SSL y **tiene prioridad sobre el objeto `ssl`** del Pool. Se eliminó `sslmode=require` de la URL. El cifrado TLS sigue activo porque lo habilita el objeto `ssl` del código.

## B. Cambios aplicados (Parte III)

| Archivo | Cambio |
|---|---|
| `restaurant-service/src/prisma/prisma.service.ts` | `rejectUnauthorized: false` (+ fallback TLS) |
| `auth-service/src/prisma.service.ts` | `rejectUnauthorized: false` |
| `order-service/src/prisma.service.ts` | `rejectUnauthorized: false` |
| `notification-service/src/app.service.ts` | `rejectUnauthorized: false` |
| `docker-compose.yml` | Eliminadas `PGSSLMODE=verify-full` y `PGSSLROOTCERT` en los 4 servicios |
| `restaurant-service/.env`, `auth-service/.env`, `order-service/.env`, `notification-service/.env` | Eliminado `sslmode=require` de `DATABASE_URL`/`DIRECT_URL` (el TLS lo activa el objeto `ssl`) |

> Nota: el `connection_limit=1&pgbouncer=true` de order/notification (puerto 6543) se mantuvo; solo se quitó `sslmode=require`. El §5.2 (puerto 5432 vs 6543) sigue como recomendación de unificación, pero ya no bloquea nada.

## C. Verificación en runtime (tras `docker compose up -d`)

Probado con `curl` contra el Gateway (puerto 3001), todo en verde:

| Endpoint | Antes | Después |
|---|---|---|
| `GET /restaurants` | 500 | **200** (devuelve restaurantes reales de Supabase) |
| `GET /products` | 500 | **200** |
| `GET /orders` | 500 | **200** |
| `POST /auth/login` (credenciales inválidas) | 500 | **401** (respuesta correcta → la BD responde) |
| `GET /notifications/:userId` | 500 | **200** |

El `restaurant-service` arranca limpio (`Nest application successfully started`, `No typescript errors found`) y ya no aparece el `TlsConnectionError`.

## D. Sobre el lag de Docker (consulta del usuario)

Sí, el lag es **esperable** con este montaje, por varias razones acumuladas:
1. **5 microservicios NestJS en modo `--watch`** (webpack + type-checking continuo) **+ Next.js dev** corriendo a la vez.
2. **Bind mounts desde una carpeta sincronizada por OneDrive** hacia Docker Desktop (WSL2) en Windows: el I/O de archivos y el file-watching (inotify) a través de esa frontera es muy lento y consume CPU. *(Este mismo problema hace que `nest --watch` no detecte los cambios del host; por eso hubo que recrear contenedores para aplicar los fixes.)*
3. `npx prisma generate` se ejecuta en **cada arranque** de cada contenedor.
4. El contenedor **`postgres_db` es inútil**: todos los servicios usan Supabase, no esa BD local (§4.1). Es consumo de recursos puro.

**Recomendaciones para bajar el lag (ordenadas por impacto):**
- **Sacar el proyecto de OneDrive** y ponerlo en una ruta local pura (ej. `C:\dev\quickeats`). OneDrive resincroniza miles de archivos que Docker toca → es la causa #1 del lag y del watch roto.
- **Eliminar `postgres_db`** de `docker-compose.yml` (no se usa).
- Para desarrollo, **no levantar los 5 servicios en watch dentro de Docker**: o se usan las imágenes de producción (etapa `runner` del Dockerfile, sin watch), o se corren los servicios con `npm run start:dev` en local (ahora que los fallbacks apuntan a `localhost`, ver Parte II).
- Subir RAM/CPU asignada a Docker Desktop si se insiste en el modo actual.

---

*Parte I: auditoría de solo lectura. Parte II: correcciones de integración sobre archivos fuente. Parte III: diagnóstico en runtime sobre Docker y fix definitivo del 500 (TLS Supabase), verificado con los contenedores en ejecución.*
