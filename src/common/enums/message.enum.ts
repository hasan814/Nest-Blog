export enum BadRequestMessage {
  InvalidLoginData = "The provided login information is incorrect.",
  InvalidRegisterData = "The provided registration data is incorrect.",
}

export enum AuthMessage {
  TryAgain = "An error occurred. Please try again!",
  LoginAgain = "Your session has expired. Please log in again.",
  NotFoundAccount = "No account was found with the provided details.",
  ExpiredCode = "The verification code has expired. Please request a new one.",
  AlreadyExistAccount = "An account with this information already exists.",
}

export enum NotFoundMessage {
  UserNotFound = "The specified user was not found.",
  OtpNotFound = "OTP record not found.",
  ResourceNotFound = "The requested resource was not found.",
}

export enum ValidationMessage {
  InvalidEmailFormat = "The email format is incorrect.",
  InvalidPhoneNumberFormat = "The phone number format is incorrect.",
  RequiredFieldMissing = "A required field is missing.",
  PasswordTooWeak = "The provided password is too weak. Please use a stronger password.",
}

export enum PublicMessage {
  SentOtp = "OTP sent successfully!",
  LoggedIn = "You have successfully logged in.",
  VerifiedSuccessfully = "Verification was successful!",
  LogoutSuccess = "You have been logged out successfully.",
}
