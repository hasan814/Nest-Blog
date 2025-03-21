import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthService } from '../services/auth.service';
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";


@Controller('/auth/google')
@ApiTags('Google Auth')
@UseGuards(AuthGuard('google'))
export class GoogleAuthController {
  constructor(private authService: AuthService) { }
  @Get()
  googleLogin(@Req() req) { }

  @Get('/redirect')
  googleRedirect(@Req() req) {
    const userData = req.user
    return this.authService.googleAuth(userData)
  }

}