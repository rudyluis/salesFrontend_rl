# cafe-sales-insights-dash/Dockerfile
# PRIMERA ETAPA: Fase de construcción (build) de la aplicación React
# Usamos una imagen Node.js para instalar dependencias y construir el proyecto
FROM node:18-alpine as build-step

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de dependencias para aprovechar la caché de Docker
# Si package.json o package-lock.json no cambian, Docker no reinstalará node_modules
COPY package.json .
COPY package-lock.json .
RUN npm install # Instala todas las dependencias de Node.js

# Copia el resto del código del frontend al contenedor
COPY . .

# Ejecuta el comando de construcción de Vite. Esto creará los archivos estáticos
# en la carpeta 'dist' (o la que uses para tu build).
# Render.com inyectará VITE_API_URL, así que no necesitas un .env aquí.
RUN npm run build

# SEGUNDA ETAPA: Fase de ejecución (runtime) con Nginx
# Usamos una imagen de Nginx muy ligera para servir los archivos estáticos
FROM nginx:alpine

# Copia los archivos estáticos construidos desde la etapa anterior (build-step)
# al directorio de servido de Nginx.
COPY --from=build-step /app/dist /usr/share/nginx/html

# Expone el puerto 80, que es el puerto HTTP estándar donde Nginx escuchará.
EXPOSE 80

# Comando para iniciar Nginx en primer plano (sin modo daemon)
CMD ["nginx", "-g", "daemon off;"]