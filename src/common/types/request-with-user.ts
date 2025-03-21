import { UserEntity } from "src/modules/user/entities/user.entity";
import { Request } from "express";

export interface RequestWithUser extends Request {
  user?: UserEntity;
}
