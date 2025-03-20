import { Body, Controller, Get, Patch, Post, Put, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ChangeEmailDto, ChangePhoneDto, ChangeUsernameDto, ProfileDto } from './dto/profile.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { cookiesOptionsToken } from 'src/common/utils/cookie.util';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enums';
import { TProfileImages } from './types/file';
import { PublicMessage } from 'src/common/enums/message.enum';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { multerStorage } from 'src/common/utils/multer.util';
import { CheckOtpDto } from '../auth/dto/auth.dto';
import { UserService } from './user.service';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { Response } from 'express';

@Controller('user')
@ApiTags("User")
@AuthDecorator()
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
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res({ passthrough: true }) res: Response) {
    const { code, token, message } = await this.userService.changeEmail(emailDto.email);
    if (message) return { message };
    res.cookie(CookieKeys.EmailOTP, token, cookiesOptionsToken());
    return { code, message: PublicMessage.SentOtp };
  }

  @Post("/verify-email-otp")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async verifyEmail(@Body() otpDto: CheckOtpDto) {
    return this.userService.verifyEmail(otpDto.code)
  }

  @Patch("/change-phone")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changePhone(@Body() phoneDto: ChangePhoneDto, @Res({ passthrough: true }) res: Response) {
    const { code, token, message } = await this.userService.changePhone(phoneDto.phone);
    if (message) return { message };
    res.cookie(CookieKeys.PhoneOTP, token, cookiesOptionsToken());
    return { code, message: PublicMessage.SentOtp };
  }

  @Post("/verify-phone-otp")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async verifyPhone(@Body() phoneDto: CheckOtpDto) {
    return this.userService.verifyPhone(phoneDto.code)
  }

  @Patch("/change-username")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeUsername(@Body() usernameDto: ChangeUsernameDto) {
    return this.userService.changeUser(usernameDto.username)
  }
}
