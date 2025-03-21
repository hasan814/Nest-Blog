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
    // ======= Tokens =========
    COOKIE_SECRET: string
    OTP_TOKEN_SECRET: string
    ACCESS_TOKEN_SECRET: string
    EMAIL_TOKEN_SECRET: string
    PHONE_TOKEN_SECRET: string
    // ======= Kavenegar =========
    SEND_SMS_URL: string
    // ======= Kavenegar =========
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
  }
}
