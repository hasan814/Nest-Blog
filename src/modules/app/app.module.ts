import { CustomHttpModule } from '../http/http.module';
import { CategoryModule } from '../category/category.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { ImageModule } from '../image/image.module';
import { UserModule } from '../user/user.module';
import { BlogModule } from '../blog/blog.module';
import { AuthModule } from '../auth/auth.module';
import { Module } from '@nestjs/common';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), ".env")
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    UserModule,
    BlogModule,
    AuthModule,
    ImageModule,
    CategoryModule,
    CustomHttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
