import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { AuthMessage } from "src/common/enums/message.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { SKIP_AUTH } from "src/common/decorators/skip-auth.decorator";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { isJWT } from "class-validator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isSkeppedAuthorization = this.reflector.get<boolean>(SKIP_AUTH, context.getHandler())
    if (isSkeppedAuthorization) return true
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request & { user?: UserEntity }>();
    const token = this.extractToken(request);
    const user = await this.authService.validateAccessToken(token);
    if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain);
    request.user = user;
    return true;
  }

  protected extractToken(request: Request): string {
    const { authorization } = request.headers;
    if (!authorization || authorization.trim() === "") throw new UnauthorizedException(AuthMessage.LoginRequired);
    const [bearer, token] = authorization.split(" ");
    if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) throw new UnauthorizedException(AuthMessage.LoginRequired);
    return token;
  }
}
