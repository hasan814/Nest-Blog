import { TCookiePayload } from "./types/payload";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) { }
  createOtpToken(payload: TCookiePayload) {
    const token = this.jwtService.sign(payload, { secret: process.env.OTP_TOKEN_SECRET, expiresIn: 60 * 2 })
    return token
  }
}