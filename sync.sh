#!/bin/bash
echo "⏳ Sincronizando dependencias y tipos de Prisma desde Docker..."

docker cp quickeats_restaurant:/app/node_modules ./restaurant-service/node_modules
docker cp quickeats_auth:/app/node_modules ./auth-service/node_modules
docker cp quickeats_order:/app/node_modules ./order-service/node_modules
docker cp quickeats_notification:/app/node_modules ./notification-service/node_modules
docker cp quickeats_gateway:/app/node_modules ./gateway/node_modules

echo "✅ ¡Entorno local sincronizado! Ya puedes programar sin líneas rojas."