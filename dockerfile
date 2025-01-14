# Etapa 1: Build de la aplicación
FROM node:22-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

COPY package*.json ./

# Instala las dependencias solo para producción (sin devDependencies)
RUN npm install --frozen-lockfile --production

COPY . .

# Construye la aplicación para producción
RUN npm run build && npm prune --production

# Etapa 2: 
FROM node:22-alpine AS runner

WORKDIR /app

# Archivos de la etapa de construccion
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

EXPOSE 3000

# Comando para ejecutar la aplicación
ENTRYPOINT ["npm", "run", "start"]

