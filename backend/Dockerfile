FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine as production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
RUN npm install pm2 -g
COPY --from=builder /app/dist ./dist/
COPY ecosystem.config.js ./
EXPOSE 4000
CMD ["pm2-runtime", "start", "ecosystem.config.js"]