import { Body, Controller, Get, Patch, Put, Res, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enums';
import { TProfileImages } from './types/file';
import { multerStorage } from 'src/common/utils/multer.util';
import { UserService } from './user.service';
import { ChangeEmailDto, ChangePhoneDto, ProfileDto } from './dto/profile.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Response } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { cookiesOptionsToken } from 'src/common/utils/cookie.util';
import { PublicMessage } from 'src/common/enums/message.enum';

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
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res: Response) {
    const { code, token, message } = await this.userService.changeEmail(emailDto.email)
    if (message) return res.json({ message })
    res.cookie(CookieKeys.EmailOTP, token, cookiesOptionsToken())
    res.json({ code, message: PublicMessage.SentOtp })
  }

}
