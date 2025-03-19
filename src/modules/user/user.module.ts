
import { UserController } from './user.controller';
import { ProfileEntity } from './entities/profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { OtpEntity } from './entities/otp.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProfileEntity, OtpEntity]),
    AuthModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService]
})
export class UserModule { }
