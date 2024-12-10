import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class PagerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {
    req.query.take = req.query.take || 10;
    req.query.skip = req.query.skip || 0;
    next();
  }
}