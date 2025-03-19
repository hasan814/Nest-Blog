import { Body, Controller, Get, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enums';
import { TProfileImages } from './types/file';
import { multerStorage } from 'src/common/utils/multer.util';
import { UserService } from './user.service';
import { ProfileDto } from './dto/profile.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

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
}
