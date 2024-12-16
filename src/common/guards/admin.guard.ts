import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UsersService } from "../../users/users.service";
import { RequestUserData } from "../../auth/types/request-user-data.type";

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