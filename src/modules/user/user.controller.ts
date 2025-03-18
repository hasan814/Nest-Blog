import { Body, Controller, Put } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enums';
import { UserService } from './user.service';
import { ProfileDto } from './dto/profile.dto';

@Controller('user')
@ApiTags("User")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Put("/profile")
  @ApiConsumes(SwaggerConsumes.MultipartData)
  changeProfile(@Body() profileDto: ProfileDto) {
    return this.userService.changeProfile(profileDto)
  }
}
