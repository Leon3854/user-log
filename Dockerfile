FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

COPY wait-for-postgres.sh .
RUN chmod +x wait-for-postgres.sh

CMD ["./wait-for-postgres.sh", "postgres", "npm", "start"]