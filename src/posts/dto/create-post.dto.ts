import { IsNotEmpty } from "class-validator";

export class CreatePostDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
}
