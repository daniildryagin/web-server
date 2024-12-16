import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { PostsService } from "../posts.service";
import { UsersService } from "../../users/users.service";

@Injectable()
export class PostsGuard implements CanActivate {

  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const req = context.switchToHttp().getRequest();

    const postId = Number(req.params.id);

    if (Number.isNaN(postId)) {
      throw new BadRequestException('Id не число');
    }

    const post = await this.postsService.findOne(postId);

    const user = await this.usersService.getUserById(req['user'].id);

    if (!user.isAdmin && user.id !== post.authorId) {
      return false;
    }

    return true;
  }
}