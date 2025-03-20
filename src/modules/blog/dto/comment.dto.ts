import { IsNumber, IsNumberString, IsOptional, Length } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty()
  @Length(5)
  text: string;

  @ApiProperty()
  @IsNumberString()
  blogId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  parentId: number
}