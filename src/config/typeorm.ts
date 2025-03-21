import { DataSource } from "typeorm";
import { config } from "dotenv";
import { join } from "path";

config();
config({ path: join(process.cwd(), '.env') });

const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;

if (!DB_HOST || !DB_NAME || !DB_USERNAME || !DB_PASSWORD || !DB_PORT) {
  throw new Error("Database configuration variables (DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT) are missing in the environment.");
}

const port = parseInt(DB_PORT, 10);
if (isNaN(port)) {
  throw new Error(`Invalid database port: ${DB_PORT}. Please check the .env file.`);
}

let dataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: port,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  entities: [
    "dist/**/**/**/*.entity{.ts, .js}",
    "dist/**/**/*.entity{.ts, .js}",
  ],
  migrations: [
    'dist/src/migrations/*{.ts, .js}'
  ],
  migrationsTableName: "blog_migration_db"
});

export default dataSource;
