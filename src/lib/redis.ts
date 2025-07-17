import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: parseInt(process.env.REDIS_PORT || "6379"),
});

// Обработка ошибок глобально для всего приложения
redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redis;
