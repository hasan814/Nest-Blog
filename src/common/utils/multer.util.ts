import { extname, join } from "path"
import { mkdirSync } from "fs"
import { Request } from "express"

export type CallbackDestination = (error: Error | null, destination: string) => void
export type CallbackFilename = (error: Error | null, Filename: string) => void
export type MulterFile = Express.Multer.File

export const multerDestination = (fieldName: string) => {
  return function (req: Request, file: MulterFile, callback: CallbackDestination): void {
    let path = join("public", "uploads", fieldName)
    mkdirSync(path, { recursive: true })
    callback(null, path)
  }
}

export const multerFilename = (req: Request, file: MulterFile, callback: CallbackFilename): void => {
  const ext = extname(file.originalname)
  const filename = `${Date.now()}.${ext}`
  callback(null, filename)
}
