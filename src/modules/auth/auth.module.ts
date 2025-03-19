import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from '../user/entities/profile.entity';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OtpEntity, ProfileEntity])],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService],
  exports: [AuthService, JwtService, TokenService, TypeOrmModule],
})
export class AuthModule { }
