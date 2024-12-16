import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";

@Injectable()
export class UsersGuard implements CanActivate {

  constructor(
    private readonly usersService: UsersService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const req = context.switchToHttp().getRequest();

    const userIdToAccess = Number(req.params.id);

    const user = await this.usersService.getUserById(req['user'].id);

    if (!user.isAdmin && user.id !== userIdToAccess) {
      return false;
    }

    return true;
  }
}