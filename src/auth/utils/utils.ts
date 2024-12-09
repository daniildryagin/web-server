import { Request } from "express";
import { UserDataRequest } from "../types/user-data-request.type";

export const utils = {

  extractToken(req: Request): string {
    const [type, accessToken] = req.headers.authorization?.split(' ') || [];
    return type?.toLowerCase() === 'bearer' ? accessToken : undefined;
  },

  attachUserDataToRequest(request: Request, user: UserDataRequest): Request {

    request['user'] = { ...user };

    return request;
  }
}