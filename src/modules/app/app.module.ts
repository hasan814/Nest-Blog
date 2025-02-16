import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { join } from 'path';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: join(process.cwd(), ".env")
  }), TypeOrmModule.forRoot(TypeOrmConfig())],
  controllers: [],
  providers: [],
})
export class AppModule { }
