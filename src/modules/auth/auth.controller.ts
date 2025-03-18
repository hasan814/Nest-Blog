import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enums';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post("user-existence")
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  userExistance(@Body() authDto: AuthDto, @Res() res: Response) {
    const result = this.authService.userExistence(authDto)
    res.cookie(CookieKeys.OTP)
  }
}
