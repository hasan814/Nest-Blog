namespace NodeJS {
  interface ProcessEnv {
    // ======= Application =========
    PORT: string;
    // ======= DataBase =========
    DB_PORT: string;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    // ======= DataBase =========
    COOKIE_SECRET: string
    OTP_TOKEN_SECRET: string
  }
}
