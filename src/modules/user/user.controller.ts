import { UserService } from './user.service';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags("User")
export class UserController {
  constructor(private readonly userService: UserService) { }
}
