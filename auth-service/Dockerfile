FROM node:20-alpine AS builder
RUN apk add --no-cache tzdata
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
RUN apk add --no-cache tzdata
WORKDIR /app
COPY package*.json ./

# Instalación limpia de dependencias de producción
RUN npm install --only=production

# Copiamos lo compilado y lo necesario de Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# 🌟 NUEVO: Copiar el certificado de seguridad CA a la raíz del runner
COPY --from=builder /app/supabase-ca.crt ./supabase-ca.crt 

EXPOSE 3002
CMD ["node", "dist/main.js"]