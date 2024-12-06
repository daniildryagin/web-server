import { Request } from "express";

export const utils = {

  extractToken(req: Request): string {
    const [type, accessToken] = req.headers.authorization?.split(' ') || [];
    return type.toLowerCase() === 'bearer' ? accessToken : undefined;
  },

}