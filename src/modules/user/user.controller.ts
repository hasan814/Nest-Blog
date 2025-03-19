import { Body, Controller, ParseFilePipe, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { multerDestination, multerFilename } from 'src/common/utils/multer.util';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enums';
import { diskStorage } from 'multer';
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
      storage: diskStorage({
        destination: multerDestination("user-profile"),
        filename: multerFilename
      })
    }
  ))
  changeProfile(
    @UploadedFiles() files: { image_profile?: Express.Multer.File[], bg_image?: Express.Multer.File[] },
    @Body() profileDto: ProfileDto
  ) {
    return this.userService.changeProfile(files, profileDto);
  }
}
