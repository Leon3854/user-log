# Используем официальный образ Node.js
FROM node:20-alpine

# Устанавливаем рабочий каталог
WORKDIR /app

# 1. Устанавливаем системные зависимости
RUN apk add --no-cache curl bash


# 2. Копируем зависимости и устанавливаем их (с кэшированием)
COPY package*.json ./
RUN npm install && \
    npm install -g knex ts-node typescript tsconfig-paths && \
    npm cache clean --force
RUN npm install -g knex@latest ts-node@latest
RUN npm install -g ts-node@latest
# 3. Копируем исходный код
COPY . .

# 4. Создаем необходимые директории
RUN mkdir -p \
    src/database/migrations \
    src/database/seeds \
    src/database/types

# 5. Устанавливаем правильные разрешения
RUN chmod +x wait-for-postgres.sh && \
    chown -R node:node /app

# 6. Переключаем на пользователя node для безопасности
USER node


# 7. Запускаем приложение
CMD ["./wait-for-postgres.sh", "postgres", "npm", "start"]

