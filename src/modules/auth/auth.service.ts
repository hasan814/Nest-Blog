
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthMessage, BadRequestMessage } from 'src/common/enums/message.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from '../user/entities/profile.entity';
import { AuthMethod } from './enums/method.enum';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthType } from './enums/type.enum';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
  ) { }
  userExistence(authDto: AuthDto) {
    const { method, type, username } = authDto
    switch (type) {
      case AuthType.Login:
        return this.login(method, username)
      case AuthType.Register:
        return this.register(method, username)
      default:
        throw new UnauthorizedException()
    }
  }
  async login(method: AuthMethod, username: string) {
    const validUserName = this.usernameValidator(method, username)
    const user = await this.checkExistUser(method, validUserName)
    if (!user) throw new UnauthorizedException(AuthMessage.NotFoundAccount)
  }
  async register(method: AuthMethod, username: string) {
    const validUserName = this.usernameValidator(method, username)
    const user = await this.checkExistUser(method, validUserName)
    if (user) throw new ConflictException(AuthMessage.AlreadyExistAccount)
  }

  async checkExistUser(method: AuthMethod, username: string) {
    let user: UserEntity | null = null;
    if (method === AuthMethod.Phone) user = await this.userRepository.findOneBy({ phone: username })
    else if (method === AuthMethod.Email) user = await this.userRepository.findOneBy({ email: username })
    else if (method === AuthMethod.Username) user = await this.userRepository.findOneBy({ username })
    else throw new BadRequestException(BadRequestMessage.InValidLoginData)
    return user
  }
  usernameValidator(method: AuthMethod, username: string) {
    switch (method) {
      case AuthMethod.Email:
        if (isEmail(username)) return username
        throw new BadRequestException("Email format is incorrect")
      case AuthMethod.Phone:
        if (isMobilePhone(username, "fa-IR")) return username
        throw new BadRequestException("mobile format is incorrect")
      case AuthMethod.Username:
        return username
      default:
        throw new UnauthorizedException("Username Data is not Valid")
    }
  }
}
