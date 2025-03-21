
import { GoogleAuthController } from './controllers/google.controller';
import { AuthController } from './controllers/auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from '../user/entities/profile.entity';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OtpEntity, ProfileEntity])],
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, JwtService, TokenService, GoogleStrategy],
  exports: [AuthService, JwtService, TokenService, TypeOrmModule, GoogleStrategy],
})
export class AuthModule { }
