# === СТАДИЯ 1: Сборка фронтенда ===
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:latest
COPY nginx/conf.d/default.conf /etc/nginx/conf.d
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
