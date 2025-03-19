import { BadRequestException } from "@nestjs/common";
import { ValidationMessage } from "../enums/message.enum";
import { extname, join } from "path";
import { mkdirSync } from "fs";
import { Request } from "express";
import { diskStorage } from "multer";

export type CallbackDestination = (error: Error | null, destination: string) => void;
export type CallbackFilename = (error: Error | null, filename: string | null) => void;
export type MulterFile = Express.Multer.File;

export const multerDestination = (fieldName: string) => {
  return function (req: Request, file: MulterFile, callback: CallbackDestination): void {
    let path = join("public", "uploads", fieldName);
    mkdirSync(path, { recursive: true });
    callback(null, path);
  };
};

export const multerFilename = (req: Request, file: MulterFile, callback: (error: Error | null, filename: string) => void): void => {
  const ext = extname(file.originalname).toLowerCase();
  if (!isValidImageFormat(ext)) {
    callback(new BadRequestException(ValidationMessage.InvalidImageFormat), "invalid-file" + ext);
  } else {
    const filename = `${Date.now()}${ext}`;
    callback(null, filename);
  }
};


const isValidImageFormat = (ext: string) => {
  return [".png", ".jpg", ".jpeg"].includes(ext);
};

export const multerStorage = (folderName: string) => {
  return diskStorage({
    destination: multerDestination(folderName),
    filename: multerFilename
  })
}
