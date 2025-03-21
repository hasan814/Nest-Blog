import { NextFunction, Request, Response } from "express";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { AuthService } from "src/modules/auth/services/auth.service";
import { isJWT } from "class-validator";

@Injectable()
export class AddToUserReq implements NestMiddleware {
  constructor(private authService: AuthService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractToken(req);
    if (!token) return next()
    try {
      let user = await this.authService.validateAccessToken(token);
      if (user) req.user = user
    } catch (error) {
      console.log(error)
    }
    next()
  }

  protected extractToken(request: Request) {
    const { authorization } = request.headers;
    if (!authorization || authorization.trim() === "") return null
    const [bearer, token] = authorization.split(" ");
    if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) return null;
    return token;
  }
}