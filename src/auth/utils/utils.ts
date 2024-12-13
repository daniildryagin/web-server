import { Request } from "express";
import { RequestUserData } from "../types/request-user-data.type";

export const utils = {

  extractToken(req: Request): string {
    const [type, accessToken] = req.headers.authorization?.split(' ') || [];
    return type?.toLowerCase() === 'bearer' ? accessToken : undefined;
  },

  attachUserDataToRequest(request: Request, userData: RequestUserData): Request {

    request['user'] = userData;

    return request;
  }
}