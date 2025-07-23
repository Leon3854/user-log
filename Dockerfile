FROM node:20-bookworm-slim

# Установка зависимостей
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    postgresql-client \
    redis-tools \
    netcat-openbsd && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости (без ts-node/esm)
RUN npm install && \
    npm install -g knex typescript && \
    npm cache clean --force

		RUN apt-get update && apt-get install -y redis-tools && rm -rf /var/lib/apt/lists/*

# Копируем остальные файлы
COPY . .

USER node

# Убираем все ESM-флаги
ENV NODE_OPTIONS="--import tsx --experimental-specifier-resolution=node"

CMD ["./wait-for-postgres.sh", "postgres", "npm", "start"]