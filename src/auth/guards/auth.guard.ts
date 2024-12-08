import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { jwtConstants } from "../jwt.constants";
import { utils } from "../utils/utils";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const req = context.switchToHttp().getRequest();
    const accessToken = utils.extractToken(req);

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: jwtConstants.AT_SECRET
      });

      req.user = {
        id: payload.sub,
        email: payload.email
      };
    }
    catch (exception) {
      throw new UnauthorizedException(exception.message);
    }

    return true;
  }
}