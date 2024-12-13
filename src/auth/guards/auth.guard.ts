import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { jwtConstants } from "../jwt.constants";
import { utils } from "../utils/utils";
import { Payload } from "../types/payload.type";
import { RequestUserData } from "../types/request-user-data.type";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const req: Request = context.switchToHttp().getRequest();
    const accessToken = utils.extractToken(req);

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const payload: Payload = await this.jwtService.verifyAsync(
        accessToken,
        {
          secret: jwtConstants.AT_SECRET
        }
      );

      const userData: RequestUserData = { id: payload.sub, email: payload.email };

      utils.attachUserDataToRequest(req, userData);
    }
    catch (exception) {
      throw new UnauthorizedException(exception.message);
    }

    return true;
  }
}