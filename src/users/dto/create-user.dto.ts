import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDto {

  @IsEmail()
  readonly email: string;

  @Length(4, 30)
  readonly password: string;

  @IsOptional()
  @IsString()
  @Length(4, 30)
  readonly username?: string;
}