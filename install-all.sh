#!/bin/bash

# Colores para la terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Iniciando instalación masiva de dependencias para QuickEats...${NC}\n"

# Arreglo con todos los directorios que contienen un package.json
SERVICES=("gateway" "auth-service" "restaurant-service" "order-service" "notification-service" "frontend")

for SERVICE in "${SERVICES[@]}"
do
    if [ -d "$SERVICE" ]; then
        echo -e "${BLUE}--------------------------------------------------${NC}"
        echo -e "${GREEN}📦 Instalando dependencias locales en: $SERVICE...${NC}"
        echo -e "${BLUE}--------------------------------------------------${NC}"
        
        cd $SERVICE
        
        # Ejecuta la instalación local
        npm install
        
        # Si el servicio usa Prisma, genera el cliente local automáticamente
        if [ -f "prisma/schema.prisma" ]; then
            echo -e "${GREEN}🔮 Detectado Prisma en $SERVICE. Generando tipos locales...${NC}"
            npx prisma generate
        fi
        
        # Regresa a la raíz
        cd ..
    else
        echo -e "${BLUE}⚠️ Carpeta $SERVICE no encontrada, saltando...${NC}"
    fi
done

echo -e "\n${GREEN}✅ ¡Proceso completado! Todas las dependencias locales y tipos de Prisma están sincronizados.${NC}"