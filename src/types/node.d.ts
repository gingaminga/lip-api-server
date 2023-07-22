declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_HOST: string;
    DATABASE_PASSWORD: string;
    DATABASE_PORT: number;
    DATABASE_SCHEMA: string;
    DATABASE_TYPE: "mysql";
    DATABASE_USER_NAME: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_PROJECT_ID: string;
    GOOGLE_KEY: string;
    GOOGLE_SECRET_KEY: string;
    HTTPS: "true" | "false";
    JWT_KEY: string;
    KAKAO_KEY: string;
    KAKAO_SECRET_KEY: string;
    LOG_MAX_FILES: number;
    LOG_MAX_SIZE: string;
    LOG_PATH: string;
    NAVER_KEY: string;
    NAVER_SECRET_KEY: string;
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    PROJECT_NAME: string;
    REDIRECT_URI: string;
    REDIS_HOST: string;
    REDIS_PASS: string;
    REDIS_PORT: number;
    SSL_CA_FILE_PATH: string;
    SSL_CERT_FILE_PATH: string;
    SSL_KEY_FILE_PATH: string;
    SSL_PFX_FILE_PATH: string;
    SSL_PFX_PASS: string;
    SSL_TYPE: "crt" | "pfx";
  }
}
