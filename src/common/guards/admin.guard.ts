import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private readonly usersService: UsersService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const req = context.switchToHttp().getRequest();
    const user = await this.usersService.getUserById(req['user'].id);

    if (!user.isAdmin) {
      return false;
    }

    return true;
  }
}