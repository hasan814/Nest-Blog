import { AuthMessage, BadRequestMessage, PublicMessage } from 'src/common/enums/message.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { cookiesOptionsToken } from 'src/common/utils/cookie.util';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../../user/entities/profile.entity';
import { AuthResponse } from '../types/response';
import { TokenService } from './token.service';
import { AuthMethod } from '../enums/method.enum';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { OtpEntity } from '../../user/entities/otp.entity';
import { randomInt } from 'crypto';
import { AuthType } from '../enums/type.enum';
import { AuthDto } from '../dto/auth.dto';
import { REQUEST } from '@nestjs/core';

import {
  Scope,
  Inject,
  Injectable,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { KavenegarService } from 'src/modules/http/kavenegar.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    @Inject(REQUEST) private request: Request,
    private kavehnegarService: KavenegarService,
    private tokenService: TokenService,
  ) { }

  async userExistence(authDto: AuthDto, res: Response) {
    const { method, type, username } = authDto;
    let result: AuthResponse;
    switch (type) {
      case AuthType.Login:
        result = await this.login(method, username);
        await this.sendOtp(method, username, result.code)
        return this.sendResponse(res, result)
      case AuthType.Register:
        result = await this.register(method, username);
        await this.sendOtp(method, username, result.code)
        return this.sendResponse(res, result)
      default:
        throw new UnauthorizedException();
    }
  }

  async login(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidation(method, username);
    const user = await this.checkExistUser(method, validUsername);
    if (!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount);
    const otp = await this.saveOtp(user.id, method)
    const token = this.tokenService.createOtpToken({ userId: user.id })
    return { token, code: otp.code, mobile: user.phone }
  }

  async register(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidation(method, username);
    let user = await this.checkExistUser(method, validUsername);
    if (user) throw new ConflictException(AuthMessage.AlreadyExistAccount);
    if (method === AuthMethod.Username) throw new BadRequestException(BadRequestMessage.InvalidRegisterData)
    user = this.userRepository.create({ [method]: username })
    user = await this.userRepository.save(user)
    user.username = `m_${user.id}`
    await this.userRepository.save(user)
    const otp = await this.saveOtp(user.id, method)
    const token = this.tokenService.createOtpToken({ userId: user.id })
    return { token, code: otp.code }
  }

  async sendResponse(res: Response, result: AuthResponse) {
    const { token } = result
    res.cookie(CookieKeys.OTP, token, cookiesOptionsToken())
    res.json({ message: PublicMessage.SentOtp })
  }

  async checkOtp(code: string) {
    const token = this.request.cookies?.[CookieKeys.OTP]
    if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode)
    const { userId } = this.tokenService.verifyOtpToken(token)
    const otp = await this.otpRepository.findOneBy({ userId })
    if (!otp) throw new UnauthorizedException(AuthMessage.TryAgain)
    const now = new Date()
    if (otp.expiresIn < now) throw new UnauthorizedException(AuthMessage.ExpiredCode)
    if (otp.code !== code) throw new UnauthorizedException(AuthMessage.TryAgain)
    const accessToken = this.tokenService.createAccessToken({ userId })
    if (otp.method === AuthMethod.Email) await this.userRepository.update({ id: userId }, { verify_email: true })
    else if (otp.method === AuthMethod.Phone) await this.userRepository.update({ id: userId }, { verify_email: true })
    return { message: PublicMessage.LoggedIn, accessToken }
  }

  async sendOtp(method: AuthMethod, username: string, code: string) {
    if (method === AuthMethod.Email) {
      // SendEmail
    } else if (method === AuthMethod.Phone) {
      await this.kavehnegarService.sendVerificationSms(username, code)
    }
  }

  async saveOtp(userId: number, method: AuthMethod) {
    const code = randomInt(10000, 99999).toString()
    const expiresIn = new Date(Date.now() + (1000 * 60 * 2))
    let otp = await this.otpRepository.findOneBy({ userId })
    let existOtp = false
    if (otp) {
      existOtp = true
      otp.code = code;
      otp.expiresIn = expiresIn,
        otp.method = method
    } else {
      otp = this.otpRepository.create({ code, expiresIn, userId, method })
    }
    otp = await this.otpRepository.save(otp)
    if (!existOtp) await this.userRepository.update({ id: userId }, { otpId: otp.id })
    return otp
  }

  async checkExistUser(method: AuthMethod, username: string): Promise<UserEntity | null> {
    const fieldMap = {
      [AuthMethod.Phone]: 'phone',
      [AuthMethod.Email]: 'email',
      [AuthMethod.Username]: 'username',
    };
    const field = fieldMap[method];
    if (!field) throw new BadRequestException(BadRequestMessage.InvalidLoginData);
    const user = await this.userRepository.findOneBy({ [field]: username });
    if (user) return user;
    return null;
  }

  async validateAccessToken(token: string): Promise<UserEntity> {
    try {
      const { userId } = this.tokenService.verifyAccessToken(token);
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain);
      return user;
    } catch (error) {
      console.error("Token verification failed:", error.message);
      throw new UnauthorizedException(AuthMessage.LoginAgain);
    }
  }

  usernameValidation(method: AuthMethod, username: string) {
    switch (method) {
      case AuthMethod.Email:
        if (isEmail(username)) return username;
        throw new BadRequestException('Email format is incorrect');
      case AuthMethod.Phone:
        if (isMobilePhone(username, 'fa-IR')) return username;
        throw new BadRequestException('Phone number format is incorrect');
      case AuthMethod.Username:
        return username;
      default:
        throw new UnauthorizedException('Username data is not valid!');
    }
  }

}
