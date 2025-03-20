import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ChangeEmailDto, ChangePhoneDto, ChangeUsernameDto, ProfileDto } from './dto/profile.dto';
import { ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { cookiesOptionsToken } from 'src/common/utils/cookie.util';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enums';
import { TProfileImages } from './types/file';
import { PublicMessage } from 'src/common/enums/message.enum';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { multerStorage } from 'src/common/utils/multer.util';
import { CheckOtpDto, UserBlockDto } from '../auth/dto/auth.dto';
import { UserService } from './user.service';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Response } from 'express';
import { Roles } from 'src/common/enums/role.enum';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

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

  @Get('/list')
  @CanAccess(Roles.Admin)
  @Pagination()
  find(@Query() paginationDto: PaginationDto) {
    return this.userService.find(paginationDto)
  }

  @Get('/followers')
  @Pagination()
  followers(@Query() paginationDto: PaginationDto) {
    return this.userService.followers(paginationDto)
  }
  @Get('/following')
  @Pagination()
  following(@Query() paginationDto: PaginationDto) {
    return this.userService.following(paginationDto)
  }

  @Get('/follow/:followingId')
  @ApiParam({ name: "followingId" })
  follow(@Param('followingId', ParseIntPipe) userId: number) {
    return this.userService.followToggle(userId)
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

  @Post("/block")
  @CanAccess(Roles.Admin)
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async block(@Body() blockDto: UserBlockDto) {
    return this.userService.blockToggle(blockDto)
  }

  @Patch("/change-username")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async changeUsername(@Body() usernameDto: ChangeUsernameDto) {
    return this.userService.changeUser(usernameDto.username)
  }
}
