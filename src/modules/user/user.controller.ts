import { Body, Controller, Get, Patch, Post, Put, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ChangeEmailDto, ProfileDto } from './dto/profile.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enums';
import { TProfileImages } from './types/file';
import { PublicMessage } from 'src/common/enums/message.enum';
import { multerStorage } from 'src/common/utils/multer.util';
import { CheckOtpDto } from '../auth/dto/auth.dto';
import { UserService } from './user.service';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Response } from 'express';

@Controller('user')
@ApiTags("User")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Put("/profile")
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(FileFieldsInterceptor([
    { name: "image_profile", maxCount: 1 },
    { name: "bg_image", maxCount: 1 }],
    {
      storage: multerStorage("user-profile")
    }
  ))
  changeProfile(
    @UploadedFiles() files: TProfileImages,
    @Body() profileDto: ProfileDto
  ) {
    return this.userService.changeProfile(files, profileDto);
  }

  @Get("/profile")
  profile() {
    return this.userService.profile()
  }

  @Patch("/change-email")
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res({ passthrough: true }) res: Response) {
    const { code, token, message } = await this.userService.changeEmail(emailDto.email);
    if (message) return { message };
    res.cookie(CookieKeys.OTP, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });
    return { code, message: PublicMessage.SentOtp };
  }

  @Post("/verify-email-otp")
  async verifyEmail(@Body() otpDto: CheckOtpDto) {
    return this.userService.verifyEmail(otpDto.code)
  }

}
