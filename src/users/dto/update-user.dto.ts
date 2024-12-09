import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  @Length(4, 30)
  readonly username?: string;
}