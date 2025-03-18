import { Injectable, UnauthorizedException } from "@nestjs/common";
import { TAccessTokenPayload, TCookiePayload } from "./types/payload";
import { AuthMessage } from "src/common/enums/message.enum";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) { }

  createOtpToken(payload: TCookiePayload) {
    const token = this.jwtService.sign(payload, { secret: process.env.OTP_TOKEN_SECRET, expiresIn: 60 * 2 })
    return token
  }
  verifyOtpToken(token: string): TAccessTokenPayload {
    try {
      return this.jwtService.verify(token, { secret: process.env.OTP_TOKEN_SECRET })
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.TryAgain)
    }
  }

  createAccessToken(payload: TAccessTokenPayload) {
    const token = this.jwtService.sign(payload, { secret: process.env.ACCESS_TOKEN_SECRET, expiresIn: "1y" })
    return token
  }

  verifyAccessToken(token: string): TAccessTokenPayload {
    try {
      return this.jwtService.verify<TAccessTokenPayload>(token, { secret: process.env.ACCESS_TOKEN_SECRET });
    } catch (error) {
      throw new UnauthorizedException(AuthMessage.LoginAgain);
    }
  }


}