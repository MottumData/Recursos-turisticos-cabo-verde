# Etapa 1: Build de la aplicación
FROM node:22-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

COPY package*.json ./

# Instala las dependencias solo para producción (sin devDependencies)
RUN npm install --frozen-lockfile 

COPY . .

EXPOSE 3000

# Comando para ejecutar la aplicación
ENTRYPOINT ["npm", "run", "dev"]
