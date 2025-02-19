// auth.module.ts
import { AuthController } from './auth.controller';
import { ProfileEntity } from '../user/entities/profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserEntity, ProfileEntity, OtpEntity])  // Registering entities explicitly
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
