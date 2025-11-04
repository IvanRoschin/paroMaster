# ----------------- Stage 1: Build -----------------
FROM node:22-alpine AS builder
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем исходники
COPY . .

# Build-time ARG только для ненужных ENV
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

# Используем BuildKit secrets для чувствительных данных
# На сборке доступны в /run/secrets/SECRET_NAME
RUN --mount=type=secret,id=SMTP_PASSWORD \
    --mount=type=secret,id=WAYFORPAY_SECRET_KEY \
    --mount=type=secret,id=NEXTAUTH_SECRET \
    --mount=type=secret,id=SMTP_EMAIL \
    --mount=type=secret,id=WAYFORPAY_MERCHANT_ACCOUNT \
    --mount=type=secret,id=WAYFORPAY_MERCHANT_DOMAIN \
    --mount=type=secret,id=WAYFORPAY_URL \
    sh -c "export SMTP_PASSWORD=$(cat /run/secrets/SMTP_PASSWORD) && \
           export WAYFORPAY_SECRET_KEY=$(cat /run/secrets/WAYFORPAY_SECRET_KEY) && \
           export NEXTAUTH_SECRET=$(cat /run/secrets/NEXTAUTH_SECRET) && \
           export SMTP_EMAIL=$(cat /run/secrets/SMTP_EMAIL) && \
           export WAYFORPAY_MERCHANT_ACCOUNT=$(cat /run/secrets/WAYFORPAY_MERCHANT_ACCOUNT) && \
           export WAYFORPAY_MERCHANT_DOMAIN=$(cat /run/secrets/WAYFORPAY_MERCHANT_DOMAIN) && \
           export WAYFORPAY_URL=$(cat /run/secrets/WAYFORPAY_URL) && \
           npm run build"

# ----------------- Stage 2: Production -----------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
# Объявляем ARG, чтобы ENV мог его использовать
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

# Копируем только то, что нужно для рантайма
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN npm prune --omit=dev

EXPOSE 3000

CMD ["node_modules/.bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
