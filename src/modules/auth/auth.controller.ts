import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto, CheckOtpDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enums';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("user-existence")
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  async userExistance(@Body() authDto: AuthDto, @Res() res: Response) {
    return this.authService.userExistence(authDto, res)
  }

  @Post("check-otp")
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.authService.checkOtp(checkOtpDto.code)
  }

  @Get("Check-login")
  checkLogin(@Req() req: Request) {
    return req.user
  }
}
