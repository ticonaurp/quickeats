FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar el caché de Docker
COPY package*.json ./
RUN npm install

# Copiar todo el código del frontend
COPY . .

# Recibir la URL del API Gateway desde GitHub Actions e inyectarla en el entorno
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# 🔥 SECCIÓN AJUSTADA: Recibir tu API Key exacta de Google Maps
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Compilar la aplicación de Next.js (Aquí se inyectarán ambas variables en el build estático)
RUN npm run build

# Exponer el puerto por defecto de Next.js
EXPOSE 3000

# Arrancar el servidor de Next.js en producción
CMD ["npm", "run", "start"]