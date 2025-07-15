# Используем официальный образ Node.js
FROM node:20-alpine

# Устанавливаем рабочий каталог
WORKDIR /app

# 1. Копируем зависимости и устанавливаем их
COPY package*.json ./
RUN npm install
RUN npm install -g knex && npm install

# 2. Копируем исходный код
COPY . .
RUN mkdir -p src/database/migrations src/database/seeds

# 3. Собираем приложение
RUN npm run build

# 4. Копируем скрипт ожидания БД и даем права на выполнение
COPY wait-for-postgres.sh .
RUN chmod +x wait-for-postgres.sh

# 5. Устанавливаем curl для healthcheck (если нужно)
RUN apk add --no-cache curl

# 6. Запускаем приложение через скрипт ожидания БД
CMD ["./wait-for-postgres.sh", "postgres", "npm", "start"]