import { AuthController } from './auth.controller';
import { ProfileEntity } from '../user/entities/profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { OtpEntity } from '../user/entities/otp.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserEntity, ProfileEntity, OtpEntity])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService],
})
export class AuthModule { }
