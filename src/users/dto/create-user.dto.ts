import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {

  @IsEmail()
  readonly email: string;

  @Length(4, 30)
  readonly password: string;

  @IsString()
  @Length(4, 30)
  readonly username?: string;
}