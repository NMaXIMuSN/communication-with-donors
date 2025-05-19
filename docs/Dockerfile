# Stage 1: сборка Docusaurus
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: nginx
FROM nginx:alpine

# Копируем собранный сайт в директорию nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Опционально: кастомная конфигурация nginx
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
