import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { ProfileEntity } from "src/modules/user/entities/profile.entity"
import { UserEntity } from "src/modules/user/entities/user.entity"
import { OtpEntity } from "src/modules/user/entities/otp.entity"


export function TypeOrmConfig(): TypeOrmModuleOptions {
  const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env
  return {
    type: "postgres",
    host: DB_HOST,
    port: +DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    autoLoadEntities: false,
    synchronize: true,
    entities: [UserEntity, ProfileEntity, OtpEntity]
  }
}