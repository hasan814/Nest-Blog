
export enum BadRequestMessage {
  InValidLoginData = "Information Data is not Correct for Login",
  InValidRegisterData = "Information Data is not Correct for Register"
}
export enum AuthMessage {
  NotFoundAccount = "Account is not Found",
  TryAgain = "Try Again!",
  AlreadyExistAccount = "Account is already Regsiter",
  ExpiredCode = "Code was Expired and try again!"
}
export enum NotFoundMessage { }
export enum ValidationMessage { }

export enum PublicMessage {
  SentOtp = "OTP sent Successfully!"
}