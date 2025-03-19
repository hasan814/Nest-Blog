import { MulterFile } from "src/common/utils/multer.util"

export type TProfileImages = {
  image_profile: MulterFile[],
  bg_image: MulterFile[]
}