import { AuthMessage, BadRequestMessage } from 'src/common/enums/message.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../user/entities/profile.entity';
import { TokenService } from './token.service';
import { AuthMethod } from './enums/method.enum';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { randomInt } from 'crypto';
import { AuthType } from './enums/type.enum';
import { AuthDto } from './dto/auth.dto';

import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthResponse } from './types/response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    private tokenService: TokenService
  ) { }

  async userExistence(authDto: AuthDto, res: Response) {
    const { method, type, username } = authDto;
    let result: AuthResponse;
    switch (type) {
      case AuthType.Login:
        result = await this.login(method, username);
        return this.sendResponse(res, result)
      case AuthType.Register:
        result = await this.register(method, username);
        return this.sendResponse(res, result)
      default:
        throw new UnauthorizedException();
    }
  }

  async login(method: AuthMethod, username: string): Promise<AuthResponse> {
    const validUsername = this.usernameValidation(method, username);
    const user = await this.checkExistUser(method, validUsername);
    if (!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount);
    const otp = await this.saveOtp(user.id)
    const token = this.tokenService.createOtpToken({ userId: user.id })
    return { token, code: otp.code }
  }

  async register(method: AuthMethod, username: string): Promise<AuthResponse> {
    const validUsername = this.usernameValidation(method, username);
    let user = await this.checkExistUser(method, validUsername);
    if (user) throw new ConflictException(AuthMessage.AlreadyExistAccount);
    if (method === AuthMethod.Username) throw new BadRequestException(BadRequestMessage.InValidRegisterData)
    user = this.userRepository.create({ [method]: username })
    user = await this.userRepository.save(user)
    user.username = `m_${user.id}`
    await this.userRepository.save(user)
    const otp = await this.saveOtp(user.id)
    const token = this.tokenService.createOtpToken({ userId: user.id })
    return { token, code: otp.code }
  }

  async sendResponse(res: Response, result: AuthResponse) {
    const { token, code } = result
    res.cookie(CookieKeys.OTP, token, { httpOnly: true })
    res.json({ message: "OTP sent Successfully", code })
  }

  async checkOtp() { }

  async saveOtp(userId: number) {
    const code = randomInt(10000, 99999).toString()
    const expiresIn = new Date(Date.now() + (1000 * 60 * 2))
    let otp = await this.otpRepository.findOneBy({ userId })
    let existOtp = false
    if (otp) {
      existOtp = true
      otp.code = code;
      otp.expiresIn = expiresIn
    } else {
      otp = this.otpRepository.create({ code, expiresIn, userId })
    }
    otp = await this.otpRepository.save(otp)
    if (!existOtp) await this.userRepository.update({ id: userId }, { otpId: otp.id })
    return otp
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

  async checkExistUser(method: AuthMethod, username: string): Promise<UserEntity | null> {
    const fieldMap = {
      [AuthMethod.Phone]: 'phone',
      [AuthMethod.Email]: 'email',
      [AuthMethod.Username]: 'username',
    };
    const field = fieldMap[method];
    if (!field) throw new BadRequestException(BadRequestMessage.InValidLoginData);
    const user = await this.userRepository.findOneBy({ [field]: username });
    if (user) return user;
    return null;
  }
}
