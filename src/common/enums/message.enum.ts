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
  LoginRequired = "You must be logged in to access this resource.",
}

export enum NotFoundMessage {
  UserNotFound = "The specified user was not found.",
  OtpNotFound = "OTP record not found.",
  ResourceNotFound = "The requested resource was not found.",
  NotFoundPost = "The requested post was not found.",
  NotFoundCategory = "The requested category was not found.",
}

export enum ValidationMessage {
  InvalidImageFormat = "The image format is incorrect.",
  InvalidEmailFormat = "The email format is incorrect.",
  InvalidPhoneNumberFormat = "The phone number format is incorrect.",
  RequiredFieldMissing = "A required field is missing.",
  PasswordTooWeak = "The provided password is too weak. Please use a stronger password.",
}

export enum PublicMessage {
  Created = "Created successfully.",
  Deleted = "Deleted successfully.",
  Updated = "Updated successfully.",
  Inserted = "Inserted successfully.",
  SentOtp = "OTP sent successfully!",
  LoggedIn = "You have successfully logged in.",
  VerifiedSuccessfully = "Verification was successful!",
  LogoutSuccess = "You have been logged out successfully.",
}


export enum ConflictMessage {
  categoryTitle = "A category with this title already exists.",
}
