import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { catchError, lastValueFrom, map } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { SmsTemplate } from "./enum/sms-template.enum";

import * as queryString from 'qs'

@Injectable()
export class KavenegarService {
  constructor(private httpService: HttpService) { }

  async sendVerificationSms(receptor: string, code: string) {
    const params = queryString.stringify({ receptor, token: code, template: SmsTemplate.Verify })
    console.log(params)
    const { SEND_SMS_URL } = process.env
    const result = await lastValueFrom(
      this.httpService.get(`${SEND_SMS_URL}?${params}`)
        .pipe(map(res => res.data))
        .pipe(catchError(err => {
          console.log(err)
          throw new InternalServerErrorException("Kavenegar")
        }))
    )
    console.log(result)
    return result
  }
}