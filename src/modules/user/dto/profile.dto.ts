import { IsEmail, IsEnum, IsMobilePhone, IsNotEmpty, IsOptional, Length, Matches } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ValidationMessage } from "src/common/enums/message.enum";
import { Gender } from "../enum/gender.enum";

export class ProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Length(3, 100)
  nick_name: string

  @ApiPropertyOptional({ nullable: true })
  @Length(10, 200)
  @IsOptional()
  bio: string

  @ApiPropertyOptional({ nullable: true, format: "binary" })
  image_profile: string

  @ApiPropertyOptional({ nullable: true, format: "binary" })
  bg_image: string

  @ApiPropertyOptional({ nullable: true, enum: Gender })
  @IsEnum(Gender)
  @IsOptional()
  gender: string

  @ApiPropertyOptional({ nullable: true, example: "2025-03-18T20:32:05.513Z" })
  birthday: Date

  @ApiPropertyOptional({ nullable: true })
  x_profile: string

  @ApiPropertyOptional({ nullable: true })
  linkedin_profile: string
}


export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail({}, { message: ValidationMessage.InvalidEmailFormat })
  @IsNotEmpty({ message: "Email is required." })
  email: string;
}

export class ChangePhoneDto {
  @ApiProperty()
  @IsMobilePhone("fa-IR", {}, { message: ValidationMessage.InvalidPhoneNumberFormat })
  @IsNotEmpty({ message: "Phone number is required." })
  phone: string;
}

export class ChangeUsernameDto {
  @ApiProperty({ example: "new_username", description: "The new username" })
  @IsNotEmpty({ message: "Username is required." })
  @Length(3, 20, { message: "Username must be between 3 and 20 characters long." })
  @Matches(/^[a-zA-Z0-9_.]+$/, { message: "Username can only contain letters, numbers, underscores, and dots." })
  username: string;
}