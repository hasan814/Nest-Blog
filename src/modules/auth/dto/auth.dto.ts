import { IsEnum, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { AuthMethod } from "../enums/method.enum";
import { AuthType } from "../enums/type.enum";

export class AuthDto {
  @ApiProperty()
  @IsString()
  @Length(3, 100)
  username: string;
  @ApiProperty({ enum: AuthType })
  @IsEnum(AuthType)
  type: string;
  @ApiProperty({ enum: AuthMethod })
  @IsEnum(AuthMethod)
  method: AuthMethod
}

export class CheckOtpDto {
  @ApiProperty()
  @IsString()
  @Length(5, 5)
  code: string
}

export class UserBlockDto {
  @ApiProperty()
  userId: number
}