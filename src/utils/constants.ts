export default {
  LOG_MAX_FILES: Number(process.env.LOG_MAX_FILES || 3),
  LOG_MAX_SIZE: Number(process.env.LOG_MAX_SIZE || 10),
  LOG_PATH: process.env.LOG_PATH,
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3001), // 서버 포트
  PROJECT_NAME: process.env.PROJECT_NAME || "LIP",
  REDIS: {
    HOST: process.env.REDIS_HOST || "127.0.0.1",
    PASSWORD: process.env.REDIS_PASS || "",
    PORT: Number(process.env.REDIS_PORT || 6379),
  },
};
