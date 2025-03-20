export enum BadRequestMessage {
  AlreadyRejected = "This item has already been rejected.",
  AlreadyAccepted = "This item has already been accepted.",
  SomeThingWrong = "Something went wrong. Please try again later.",
  InvalidLoginData = "The provided login information is incorrect.",
  InvalidRegisterData = "The provided registration data is incorrect.",
  InvalidEmail = "The provided email is invalid. Please enter a valid email address.",
  InvalidPhone = "The provided phone number is invalid. Please enter a valid phone number.",
  InvalidCategories = "The selected categories are invalid. Please select valid categories.",
}



export enum AuthMessage {
  TryAgain = "An error occurred. Please try again!",
  LoginAgain = "Your session has expired. Please log in again.",
  LoginRequired = "You must be logged in to access this resource.",
  Blocked = "Your account has been blocked. Please contact support.",
  NotFoundAccount = "No account was found with the provided details.",
  AlreadyExistAccount = "An account with this information already exists.",
  ExpiredCode = "The verification code has expired. Please request a new one.",
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
  Like = "You liked this item.",
  Created = "Created successfully.",
  Deleted = "Deleted successfully.",
  Updated = "Updated successfully.",
  SentOtp = "OTP sent successfully!",
  Inserted = "Inserted successfully.",
  Dislike = "You disliked this item.",
  Bookmark = "Item added to your bookmarks.",
  LoggedIn = "You have successfully logged in.",
  UnFollowed = "You have unfollowed this item.",
  Followed = "You are now following this item.",
  DeletedComment = "Comment deleted successfully.",
  unBookmark = "Item removed from your bookmarks.",
  UpdatedComment = "Comment updated successfully.",
  CreatedComment = "Comment created successfully.",
  VerifiedSuccessfully = "Verification was successful!",
  LogoutSuccess = "You have been logged out successfully.",
  Block = "You have blocked this item.",
  UnBlock = "You have unblocked this item."
}



export enum ConflictMessage {
  categoryTitle = "A category with this title already exists.",
  Email = "This email is already associated with an existing account.",
  Phone = "This phone number is already linked to another account.",
  Username = "This username is already taken. Please choose another."
}

