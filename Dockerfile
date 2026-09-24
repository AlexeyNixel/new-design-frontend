# syntax=docker/dockerfile:1

# ---------- Сборка ----------
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NUXT_TELEMETRY_DISABLED=1

# Зависимости отдельным слоем — пересобираются только при смене lock-файла.
# --ignore-scripts: postinstall (`nuxt prepare`) требует исходники проекта
# (nuxt.config.ts читает папку public), он всё равно выполнится внутри `nuxt build`.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .

# Значения по умолчанию, «зашиваемые» в сборку. Оба переопределяются при запуске
# контейнера (см. ENV ниже), поэтому один образ подходит для разных окружений.
ARG NUXT_PUBLIC_API_BASE=https://api2.infomania.ru
ARG NUXT_PUBLIC_SITE_URL=https://alt.infomania.ru
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE \
    NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL

RUN npx nuxt build

# ---------- Запуск ----------
# .output самодостаточен: Nitro кладёт нужные зависимости в .output/server/node_modules
FROM node:22-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    NUXT_TELEMETRY_DISABLED=1 \
    HOST=0.0.0.0 \
    PORT=3000

# Переопределение при запуске (docker run -e ...):
#   NUXT_PUBLIC_API_BASE_URL — адрес бэкенда (ключ runtimeConfig.public.apiBaseUrl)
#   NUXT_PUBLIC_SITE_URL     — адрес сайта для canonical, robots.txt
#   NUXT_SITE_URL            — адрес сайта для sitemap.xml

COPY --from=build --chown=node:node /app/.output ./.output

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + process.env.PORT + '/robots.txt').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
