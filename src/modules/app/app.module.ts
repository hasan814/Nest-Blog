import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { join } from 'path';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: join(process.cwd(), ".env")
  })],
  controllers: [],
  providers: [],
})
export class AppModule { }
