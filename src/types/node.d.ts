declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_HOST: string;
    DATABASE_PASSWORD: string;
    DATABASE_PORT: number;
    DATABASE_SCHEMA: string;
    DATABASE_TYPE: "mysql";
    DATABASE_USER_NAME: string;
    HTTPS: "true" | "false";
    KAKAO_KEY: string;
    LOG_MAX_FILES: number;
    LOG_MAX_SIZE: string;
    LOG_PATH: string;
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
