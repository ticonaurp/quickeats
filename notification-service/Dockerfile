FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
# Aseguramos la instalación limpia de producción y soporte de variables
RUN npm install --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
# Copiar configuración de prisma si existe en la raíz
COPY --from=builder /app/prisma.config.* ./

EXPOSE 3005
CMD ["node", "dist/main.js"]