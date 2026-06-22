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

# Compilar la aplicación de Next.js
RUN npm run build

# Exponer el puerto por defecto de Next.js
EXPOSE 3000

# Arrancar el servidor de Next.js en producción
CMD ["npm", "run", "start"]