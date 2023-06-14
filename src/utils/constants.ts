export default {
  DATABASE: {
    HOST: process.env.DATABASE_HOST || "127.0.0.1",
    PASSWORD: process.env.DATABASE_PASSWORD || "",
    PORT: Number(process.env.DATABASE_PORT || 3306),
    SCHEMA: process.env.DATABASE_SCHEMA || "test",
    TYPE: process.env.DATABASE_TYPE || "mysql",
    USER_NAME: process.env.DATABASE_USER_NAME || "root",
  },
  HTTPS: process.env.HTTPS === "true",
  JWT: {
    EXPRIED: {
      ACCESS_TOKEN: "1h",
      REFRESH_TOKEN: "20d",
    },
    KEY: process.env.JWT_KEY || "",
  },
  LOG: {
    MAX_FILES: Number(process.env.LOG_MAX_FILES || 3),
    MAX_SIZE: Number(process.env.LOG_MAX_SIZE || "10m"),
    PATH: process.env.LOG_PATH,
  },
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 3001), // 서버 포트
  PROJECT_NAME: process.env.PROJECT_NAME || "Life is plan",
  REDIS: {
    HOST: process.env.REDIS_HOST || "127.0.0.1",
    PASSWORD: process.env.REDIS_PASS || "",
    PORT: Number(process.env.REDIS_PORT || 6379),
  },
  SOCIAL: {
    GOOGLE: {
      KEY: process.env.GOOGLE_KEY,
      NAME: "google",
      SECRET_KEY: process.env.GOOGLE_SECRET_KEY,
    },
    KAKAO: {
      KEY: process.env.KAKAO_KEY,
      NAME: "kakao",
      SECRET_KEY: process.env.KAKAO_SECRET_KEY,
    },
    NAVER: {
      KEY: process.env.NAVER_KEY,
      NAME: "naver",
      SECRET_KEY: process.env.NAVER_SECRET_KEY,
    },
    REDIRECT_URI: process.env.REDIRECT_URI,
  },
  SSL: {
    CERT: {
      CA_FILE_PATH: process.env.HTTPS === "true" ? process.env.SSL_CA_FILE_PATH : "", // CA 파일
      CERT_FILE_PATH: process.env.HTTPS === "true" ? process.env.SSL_CERT_FILE_PATH : "", // cert 파일
      KEY_FILE_PATH: process.env.HTTPS === "true" ? process.env.SSL_KEY_FILE_PATH : "", // key 파일
    },
    PFX: {
      PFX_FILE_PATH: process.env.HTTPS === "true" ? process.env.SSL_PFX_FILE_PATH : "", // pfx 파일
      PASSWORD: process.env.HTTPS === "true" ? process.env.SSL_PFX_PASS : "", // pfx 비밀번호
    },
    TYPE: process.env.HTTPS === "true" ? process.env.SSL_TYPE : "",
  },
};
