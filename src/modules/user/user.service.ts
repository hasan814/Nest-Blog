import { Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { ProfileDto } from './dto/profile.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { isDate } from 'class-validator';
import { Gender } from './enum/gender.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    @Inject(REQUEST) private request: Request
  ) { }
  async changeProfile(files: { image_profile?: Express.Multer.File[], bg_image?: Express.Multer.File[] }, profileDto: ProfileDto) {
    console.log("Uploaded Files:", files);

    const user = this.request.user as UserEntity | undefined;
    if (!user) throw new UnauthorizedException("User not found in request.");

    const { id: userId, profileId } = user;
    let profile = await this.profileRepository.findOneBy({ userId });

    const { bio, birthday, gender, linkedin_profile, nick_name, x_profile } = profileDto;

    if (profile) {
      if (bio) profile.bio = bio;
      if (birthday && isDate(new Date(birthday))) profile.birthday = new Date(birthday);
      if (gender && Object.values(Gender as any).includes(gender)) profile.gender = gender;
      if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
      if (x_profile) profile.x_profile = x_profile;
      if (nick_name) profile.nick_name = nick_name;
    } else {
      if (!nick_name) throw new Error("nick_name cannot be null");
      profile = this.profileRepository.create({
        bio,
        birthday,
        gender,
        linkedin_profile,
        x_profile,
        nick_name,
        userId
      });
    }

    profile = await this.profileRepository.save(profile);
    if (!profileId) await this.userRepository.update({ id: userId }, { profileId: profile.id });

    return profile;
  }

}
