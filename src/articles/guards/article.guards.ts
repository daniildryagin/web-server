import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ArticlesService } from "../articles.service";
import { UsersService } from "../../users/users.service";

@Injectable()
export class ArticlesGuard implements CanActivate {

  constructor(
    private readonly usersService: UsersService,
    private readonly articlesService: ArticlesService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const req = context.switchToHttp().getRequest();

    const articleId = Number(req.params.id);

    if (Number.isNaN(articleId)) {
      throw new BadRequestException('Id не число');
    }

    const article = await this.articlesService.findOne(articleId);

    const user = await this.usersService.getUserById(req['user'].id);

    if (!user.isAdmin && user.id !== article.authorId) {
      return false;
    }

    return true;
  }
}