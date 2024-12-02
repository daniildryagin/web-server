import { User } from "src/users/entities/user.entity";

export class CreatePostDto {
  name: string;
  description: string;
  authorId: number;
}
