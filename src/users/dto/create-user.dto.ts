import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDto {

  @ApiProperty({
    type: String,
    example: 'test@gmail.com'
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    type: String,
    minLength: 4,
    maxLength: 30,
    example: '123456'
  })
  @Length(4, 30)
  readonly password: string;

  @ApiProperty({
    type: String,
    minLength: 4,
    maxLength: 30,
    required: false,
    example: 'username'
  })
  @IsOptional()
  @IsString()
  @Length(4, 30)
  readonly username?: string;

  @ApiProperty({
    type: Boolean,
    example: 'false'
  })
  @IsOptional()
  @IsBoolean()
  readonly isAdmin?: boolean;
}