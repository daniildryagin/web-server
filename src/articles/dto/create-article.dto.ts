import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateArticleDto {

  @ApiProperty({
    type: String,
    example: 'Название статьи'
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    example: 'Описание статьи'
  })
  @IsNotEmpty()
  description: string;
}
