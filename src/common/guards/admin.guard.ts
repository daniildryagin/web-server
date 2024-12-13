import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { RequestUserData } from "src/auth/types/request-user-data.type";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(
    private readonly usersService: UsersService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const req = context.switchToHttp().getRequest();
    const userData: RequestUserData = req['user'];
    const user = await this.usersService.getUserById(userData.id);

    return user.isAdmin;
  }
}