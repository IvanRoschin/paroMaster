# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Копируем только нужные файлы
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
