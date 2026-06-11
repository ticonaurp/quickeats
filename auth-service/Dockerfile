FROM node:20-alpine

WORKDIR /app

# Copiamos los descriptores de dependencias
COPY package*.json ./

# Instalamos todas las dependencias necesarias para compilar NestJS 11 y TypeScript 5
RUN npm install

# Copiamos el código fuente y el esquema de Prisma
COPY . .

# Generamos los clientes de Prisma 7.8.0
RUN npx prisma generate

# Compilamos el proyecto de NestJS
RUN npm run build

EXPOSE 3002

# Ejecutamos el archivo empaquetado real
CMD ["node", "dist/main.js"]