# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Установим зависимости только один раз
COPY package*.json ./
RUN npm ci

# Копируем исходники
COPY . .

# Указываем build-time ARG для Next.js
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

# Сборка production версии
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Оставляем возможность пробросить MONGODB_URI в рантайме
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

# Копируем только то, что нужно для рантайма
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Оптимизация: удаляем devDependencies
RUN npm prune --omit=dev

EXPOSE 3000

# Используем прямой путь вместо npx (ускоряет старт)
CMD ["node_modules/.bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
