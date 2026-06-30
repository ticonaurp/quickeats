# Orquestación con Kubernetes — QuickEats

Manifiestos para ejecutar QuickEats en un clúster local de **Kubernetes** (Docker Desktop / kubeadm).
Esto **no modifica los microservicios**: reutiliza las mismas imágenes Docker, solo las orquesta.

## Contenido
- `00-namespace.yaml` — namespace `quickeats`.
- `01-secret.yaml` — credenciales (DATABASE_URL de cada servicio + JWT_SECRET).
- `02-configmap.yaml` — URLs internas entre servicios.
- `auth.yaml`, `restaurant.yaml`, `order.yaml`, `notification.yaml` — Deployment + Service (ClusterIP) de cada microservicio.
- `gateway.yaml` — Deployment + Service **LoadBalancer** (queda en `localhost:3001`).
- `frontend.yaml` — Deployment + Service **LoadBalancer** (queda en `localhost:3000`).
- `ingress.yaml` — Ingress (cumple el tópico; requiere instalar ingress-nginx).

## Requisitos previos
1. Docker Desktop con **Kubernetes habilitado** (cluster Active).
2. `kubectl get nodes` debe mostrar `docker-desktop` en **Ready**.

## Paso 1 — Construir la imagen del frontend (la única que falta)
Las 5 imágenes del backend ya existen en Docker Desktop. Falta el frontend; constrúyelo
apuntando al gateway (que estará en `localhost:3001`):

```bash
# Desde la raíz del proyecto
docker build --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001 -t quickeats-frontend:latest ./frontend
```

> Si reconstruyes el backend en algún momento, usa estos nombres exactos de imagen:
> `quickeats-auth-service:latest`, `quickeats-restaurant-service:latest`,
> `quickeats-order-service:latest`, `quickeats-notification-service:latest`, `quickeats-gateway:latest`.

## Paso 2 — Desplegar todo
```bash
kubectl apply -f k8s/
```
(Si la primera vez te da un error de "namespace not found", vuelve a ejecutar el mismo comando.)

## Paso 3 — Verificar
```bash
kubectl get pods -n quickeats        # todos deben quedar Running
kubectl get svc  -n quickeats        # gateway y frontend con EXTERNAL-IP = localhost
```

## Paso 4 — Acceder
- **Frontend:** http://localhost:3000
- **API (gateway):** http://localhost:3001/restaurants

Login de prueba: `topicos2@gmail.com` / `Prueba12345` (admin) · `topicos1@gmail.com` / `Prueba12345` (usuario).

## (Opcional) Ingress — para mostrar el tópico completo
```bash
# 1) Instalar el controlador de Ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
# 2) El ingress.yaml ya se aplicó con kubectl apply -f k8s/
kubectl get ingress -n quickeats
```
Para que el frontend use el Ingress en vez de `localhost:3001`, reconstruye su imagen con
`--build-arg NEXT_PUBLIC_API_URL=http://api.quickeats.localhost` y vuelve a aplicar.

## Comandos útiles
```bash
kubectl logs -n quickeats deploy/auth-service     # ver logs de un servicio
kubectl describe pod -n quickeats <nombre-pod>    # diagnosticar un pod
kubectl delete -f k8s/                            # borrar todo lo desplegado
```
