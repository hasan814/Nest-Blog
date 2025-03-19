import { ConflictException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { ConflictMessage, PublicMessage } from 'src/common/enums/message.enum';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TProfileImages } from './types/file';
import { ProfileEntity } from './entities/profile.entity';
import { TokenService } from '../auth/token.service';
import { AuthService } from '../auth/auth.service';
import { ProfileDto } from './dto/profile.dto';
import { UserEntity } from './entities/user.entity';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { isDate } from 'class-validator';
import { Gender } from './enum/gender.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    @Inject(REQUEST) private request: Request,
    private authService: AuthService,
    private tokenService: TokenService
  ) { }

  async changeProfile(files: TProfileImages, profileDto: ProfileDto) {
    let { image_profile: uploadedImageProfile, bg_image: uploadedBgImage } = files;
    if (uploadedImageProfile?.length) {
      let image = uploadedImageProfile[0];
      profileDto.image_profile = image?.path?.slice(7);
    }
    if (uploadedBgImage?.length) {
      let image = uploadedBgImage[0];
      profileDto.bg_image = image?.path?.slice(7);
    }
    const user = this.request.user as UserEntity | undefined;
    if (!user) throw new UnauthorizedException('User not found in request.');
    const { id: userId, profileId } = user;
    let profile = await this.profileRepository.findOneBy({ userId });
    const {
      bio,
      birthday,
      gender,
      linkedin_profile,
      nick_name,
      x_profile,
      image_profile,
      bg_image,
    } = profileDto;

    if (profile) {
      if (bio) profile.bio = bio;
      if (birthday && isDate(new Date(birthday))) profile.birthday = new Date(birthday);
      if (gender && Object.values(Gender as any).includes(gender)) profile.gender = gender;
      if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
      if (x_profile) profile.x_profile = x_profile;
      if (image_profile) profile.image_profile = image_profile;
      if (bg_image) profile.bg_image = bg_image;
      if (nick_name) profile.nick_name = nick_name;
    } else {
      const newProfile: DeepPartial<ProfileEntity> = {
        bio,
        birthday,
        gender,
        linkedin_profile,
        x_profile,
        nick_name,
        userId,
        bg_image,
        image_profile,
      };
      profile = this.profileRepository.create(newProfile);
    }
    profile = await this.profileRepository.save(profile);
    if (!profileId) await this.userRepository.update({ id: userId }, { profileId: profile.id });
    return { profile, message: PublicMessage.Updated };
  }

  profile() {
    const user = this.request.user as UserEntity | undefined;
    if (!user) throw new UnauthorizedException('User not found in request.');
    return this.userRepository.findOne({
      where: { id: user.id },
      relations: ['profile']
    });
  }

  async changeEmail(email: string) {
    const loggedInUser = this.request.user as UserEntity | undefined;
    if (!loggedInUser) throw new UnauthorizedException('User not found in request.');
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser && existingUser.id !== loggedInUser.id) throw new ConflictException(ConflictMessage.Email);
    else if (existingUser && existingUser.id === loggedInUser.id) return { message: PublicMessage.Updated };
    loggedInUser.new_email = email;
    await this.userRepository.save(loggedInUser);
    const otp = await this.authService.saveOtp(loggedInUser.id);
    const token = this.tokenService.createEmailToken({ email });
    return { code: otp.code, token };
  }

}
