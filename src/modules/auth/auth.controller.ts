import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enums';
import { AuthService } from './auth.service';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { Response } from 'express';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post("user-existence")
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  async userExistance(@Body() authDto: AuthDto, @Res() res: Response) {
    return this.authService.userExistence(authDto, res)
  }
}
